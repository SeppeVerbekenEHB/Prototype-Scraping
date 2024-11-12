// Fetch the data from the JSON file and render it
async function fetchProducts() {
    try {
        const response = await fetch('../output/torfs_data.json');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Error fetching the product data:", error);
    }
}

// Render the products on the page
function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('col-md-4', 'product-card');

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image img-fluid">
            <div class="product-info">
                <h2 class="product-name">${product.name}</h2>
                <p class="product-price">€ ${product.price}</p>
                <div class="product-link">
                    <a href="${product.link}" target="_blank">View Product</a>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Load products when the page loads
document.addEventListener('DOMContentLoaded', fetchProducts);
