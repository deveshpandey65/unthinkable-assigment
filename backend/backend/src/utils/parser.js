const Product = require("../models/Product");
const nlp = require("compromise");

// Keywords per language
const keywordsMap = {
    en: {
        add: ["add", "buy", "need", "want", "get", "pick up", "grab", "purchase"],
        remove: ["remove", "delete", "take out", "get rid of", "erase", "cross off", "take off"],
        show: ["show list", "show", "what's in my list", "see", "view", "read"],
        suggest: ["suggest", "recommend", "give me ideas for", "advice", "tips"],
        complete: ["complete", "done", "finished", "got", "checked off"],
        order: ["order", "checkout", "buy now", "place order"],
        seasonal: ["seasonal", "season", "in season", "current season", "monthly specials"],
        similar: ["similar", "alternative", "substitute", "replace", "other options", "other choices"],
        recommended: ["recommend", "recommended", "recommendation", "best picks", "top picks"]
    },
    hi: {
        add: ["जोड़ो","जोड़ें", "खरीदो", "चाहिए", "लाना", "ले आओ", "पिक करो", "पकड़ो", "खरीद"],
        remove: ["हटाओ", "डिलीट करो", "निकाल दो", "छोड़ दो", "मिटाओ", "क्रॉस करो", "उतार दो"],
        show: ["सूची दिखाओ", "दिखाओ", "मेरी सूची में क्या है", "देखो", "देखना", "पढ़ो"],
        suggest: ["सुझाव दो", "सिफारिश करो", "विचार दो", "सलाह दो", "टिप्स दो"],
        complete: ["पूरा हुआ", "हो गया", "समाप्त", "कर लिया", "टिक कर दो"],
        order: ["ऑर्डर करो", "चेकआउट", "अभी खरीदो", "ऑर्डर डालो", "खरीदारी पूरी करो"],
        seasonal: ["मौसमी", "सीजन", "मौसम में", "इस समय उपलब्ध", "महीने का विशेष"],
        similar: ["समान", "विकल्प", "बदलाव", "बदल दो", "अन्य विकल्प", "दूसरे चुनाव"],
        recommended: ["सुझाया गया", "सिफारिश", "अनुशंसा", "सबसे अच्छा", "टॉप पिक", "बेहतर चुनाव"]
    },
    bn: {
        add: ["যোগ করুন", "কিনুন", "প্রয়োজন", "চাই", "নিন", "তুলে নিন", "ধরুন", "ক্রয় করুন"],
        remove: ["অপসারণ করুন", "মুছে ফেলুন", "বের করে দিন", "ফেলে দিন", "মুছুন", "কেটে দিন", "খুলে ফেলুন"],
        show: ["তালিকা দেখান", "দেখান", "আমার তালিকায় কী আছে", "দেখতে চাই", "দেখুন", "পড়ুন"],
        suggest: ["পরামর্শ দিন", "সুপারিশ করুন", "আমাকে আইডিয়া দিন", "উপদেশ দিন", "টিপস দিন"],
        complete: ["সম্পূর্ণ", "শেষ", "সমাপ্ত", "হয়ে গেছে", "চেক করা হয়েছে"],
        order: ["অর্ডার করুন", "চেকআউট", "এখনই কিনুন", "অর্ডার দিন"],
        seasonal: ["মৌসুমী", "মৌসুম", "এখন কোন মৌসুম", "বর্তমান মৌসুম", "মাসিক বিশেষ"],
        similar: ["একই রকম", "বিকল্প", "প্রতিস্থাপন", "অন্য অপশন", "অন্য পছন্দ"],
        recommended: ["প্রস্তাবিত", "সুপারিশকৃত", "প্রস্তাব", "সেরা পছন্দ", "শীর্ষ পছন্দ"]
    }
};

// Quantity extractor
function parseQuantity(text) {
    const doc = nlp(text);
    let numbers = doc.numbers().values().toNumber().out("array");
    if (numbers.length > 0) return numbers[0];

    if (/\b(a|an|half|dozen)\b/i.test(text)) {
        const map = { a: 1, an: 1, half: 0.5, dozen: 12 };
        const match = text.match(/\b(a|an|half|dozen)\b/i)[0].toLowerCase();
        return map[match] || 1;
    }

    return 1;
}

// Try matching product from DB
async function findProductInText(text) {
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, "");
    const products = await Product.find({}, "name brand").lean();
    for (const p of products) {
        if (cleanText.includes(p.name.toLowerCase())) {
            return p;
        }
    }
    return null;
}

// Translate to English if needed
async function translateToEnglish(text, sourceLang) {
    if (sourceLang === "en") return text; // skip translation
    const res = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: "en",
            format: "text"
        }),
    });

    const data = await res.json();
    return data.translatedText || text; // fallback
}

// Main parser
async function parseVoiceCommand(text, language) {
    // 🔹 First translate the text to English if needed
    let tText=text
    console.log(text,language)
    if (language=='hi'){
         tText = await translateToEnglish(text, 'Hindi');
    }
    else if (language == 'bn') {
         tText = await translateToEnglish(text, 'Bengali');
    }
    else{
         tText = text
        
    }
    console.log(tText)
    const lowerText = tText.toLowerCase();
    const langKeywords = keywordsMap[language] || keywordsMap.en;
    const doc = nlp(lowerText);

    // --- SHOW LIST ---
    if (langKeywords.show.some(kw => lowerText.includes(kw))) {
        return { intent: "show" };
    }

    // --- ADD ITEM ---
    if (langKeywords.add.some(kw => lowerText.includes(kw))) {
        const quantity = parseQuantity(tText);
        const product = await findProductInText(tText);
        return { intent: "add", product, quantity };
    }

    // --- REMOVE ITEM ---
    if (langKeywords.remove.some(kw => lowerText.includes(kw))) {
        const quantity = parseQuantity(tText);
        const product = await findProductInText(tText);
        return { intent: "remove", product, quantity };
    }

    // --- SUGGEST / SEASONAL / SIMILAR ---
    if (langKeywords.suggest.some(kw => lowerText.includes(kw))) {
        return { intent: "suggest" };
    }
    if (langKeywords.seasonal.some(kw => lowerText.includes(kw))) {
        return { intent: "seasonal" };
    }
    if (langKeywords.similar.some(kw => lowerText.includes(kw))) {
        const product = await findProductInText(tText);
        return { intent: "similar", product };
    }

    // --- COMPLETE ---
    if (langKeywords.complete.some(kw => lowerText.includes(kw))) {
        return { intent: "complete" };
    }

    // --- ORDER ---
    if (langKeywords.order.some(kw => lowerText.includes(kw))) {
        if (lowerText.includes("cart")) {
            return { intent: "order", type: "cart" };
        }
        const product = await findProductInText(tText);
        return { intent: "order", type: "product", product };
    }

    // --- UNKNOWN ---
    return { intent: "unknown" };
}

module.exports = { parseVoiceCommand };
