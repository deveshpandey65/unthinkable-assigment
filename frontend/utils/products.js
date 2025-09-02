export const products = [
    { id: 1, name: 'Wireless Headphones', price: 99.99, image: 'https://placehold.co/400x400/1e293b/d4d4d4?text=Headphones', category: 'Audio' },
    { id: 2, name: 'Smartwatch', price: 199.99, image: 'https://placehold.co/400x400/1e293b/d4d4d4?text=Smartwatch', category: 'Wearable Tech' },
    { id: 3, name: 'Portable Speaker', price: 59.99, image: 'https://placehold.co/400x400/1e293b/d4d4d4?text=Speaker', category: 'Audio' },
    { id: 4, name: 'HD Camera', price: 249.99, image: 'https://placehold.co/400x400/1e293b/d4d4d4?text=Camera', category: 'Photography' },
    { id: 5, name: 'Ergonomic Mouse', price: 49.99, image: 'https://placehold.co/400x400/1e293b/d4d4d4?text=Mouse', category: 'Peripherals' },
    { id: 6, name: 'Mechanical Keyboard', price: 129.99, image: 'https://placehold.co/400x400/1e293b/d4d4d4?text=Keyboard', category: 'Peripherals' },
    { id: 7, name: "Smart Thermostat", price: 199.99, image: "https://placehold.co/400x400/1e293b/d4d4d4?text=Thermostat", category: "Home Automation" },
    { id: 8, name: "Robot Vacuum", price: 349.99, image: "https://placehold.co/400x400/1e293b/d4d4d4?text=Vacuum", category: "Home Appliance" },
    { id: 9, name: "Air Purifier", price: 129.99, image: "https://placehold.co/400x400/1e293b/d4d4d4?text=Air+Purifier", category: "Home Appliance" },
    { id: 10, name: "Coffee Maker", price: 79.99, image: "https://placehold.co/400x400/1e293b/d4d4d4?text=Coffee+Maker", category: "Kitchen" },
    { id: 11, name: '4K Monitor', price: 349.99, image: 'https://placehold.co/400x400/1e293b/d4d4d4?text=4K+Monitor', category: 'Displays' },
    { id: 12, name: 'Webcam', price: 79.99, image: 'https://placehold.co/400x400/1e293b/d4d4d4?text=Webcam', category: 'Photography' },
];
// Simulated data for new sections
export const recommendedProducts = [
    products[0],
    products[5],
    products[2],
    products[4]
];
export const seasonalProducts = [
    products[7],
    products[8],
    products[9],
    products[10]
    ];
//get product by id
export const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
}