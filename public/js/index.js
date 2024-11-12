document.addEventListener('DOMContentLoaded', () => {
    const scrapeButton = document.getElementById('scrape-button');
    const productGrid = document.getElementById('product-grid');

    // Fetch products immediately when the page loads
    fetchProducts();

    // Fetch products from the server
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:3000/scrape');
            const products = await response.json();
            console.log('Products:', products);
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to fetch products.');
        }
    }

    // Load products on button click
    scrapeButton.addEventListener('click', async () => {
        scrapeButton.disabled = true;
        scrapeButton.textContent = 'Scraping...';

        try {
            const response = await fetch('http://localhost:3000/scrape');
            const products = await response.json();
            console.log('Products:', products);
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to fetch products.');
        } finally {
            scrapeButton.disabled = false;
            scrapeButton.textContent = 'Get Latest Products';
        }
    });

    // Function to display products on the page
    function displayProducts(products) {
        productGrid.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${product.price}</div>
                <div class="product-link"><a href="${product.link}" target="_blank">View Product</a></div>
            `;

            productGrid.appendChild(productCard);
        });
    }
});