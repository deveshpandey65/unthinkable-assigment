const Product = require("../models/Product");
const nlp = require("compromise");

// Keywords per language
const keywordsMap = {
    en: {
        find: ["find", "search", "look for", "show me", "get me", "show"],
    },
    hi: {
        find: ["खोजो", "ढूंढो", "तलाश करो", "मुझे दिखाओ", "लाओ", "दिखाओ"]
    },
    bn: {
        find: ["খুঁজুন", "খুঁজে দিন", "তালাশ করুন", "আমাকে দেখান", "আনুন", "দেখান"]
    }

};



// Parse price filters
function parsePriceFilter(text) {
    const filters = {};
    const lower = text.toLowerCase();

    const lessMatch = lower.match(/less than (\d+)/i);
    if (lessMatch) filters.priceLt = Number(lessMatch[1]);

    const greaterMatch = lower.match(/greater than (\d+)/i);
    if (greaterMatch) filters.priceGt = Number(greaterMatch[1]);

    return filters;
}

// Try matching product from DB
async function findProductInText(text) {
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, "");
    const products = await Product.find({}, "name brand category").lean();
    for (const p of products) {
        if (cleanText.includes(p.name.toLowerCase())) return p;
    }
    return null;
}

// Try matching brand from text
async function findBrandInText(text) {
    const cleanText = text.toLowerCase();
    const products = await Product.find({}, "brand").lean();
    const brands = [...new Set(products.map(p => p.brand.toLowerCase()).filter(Boolean))];
    for (const brand of brands) {
        if (cleanText.includes(brand)) return brand;
    }
    return null;
}

// Try matching category from text
async function findCategoryInText(text) {
    const cleanText = text.toLowerCase();
    const products = await Product.find({}, "category").lean();
    const categories = [...new Set(products.map(p => p.category.toLowerCase()).filter(Boolean))];
    for (const cat of categories) {
        if (cleanText.includes(cat)) return cat;
    }
    return null;
}

// Main parser
async function parseFindCommand(text, language = "en") {
    const lowerText = text.toLowerCase();
    const langKeywords = keywordsMap[language] || keywordsMap.en;

    // --- FIND INTENT ---
    if (langKeywords.find.some(kw => lowerText.includes(kw))) {
        const product = await findProductInText(text);
        const brand = await findBrandInText(text);
        const category = await findCategoryInText(text);
        const priceFilters = parsePriceFilter(text);

        return {
            intent: "find",
            product: product || null,
            filters: {
                brand: brand || null,
                category: category || null,
                ...priceFilters
            }
        };
    }

    // --- UNKNOWN ---
    return { intent: "unknown" };
}

module.exports = { parseFindCommand };
