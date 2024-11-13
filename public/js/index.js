document.addEventListener('DOMContentLoaded', () => {
    const scrapeButton = document.getElementById('scrape-button');
    const genderDropdown = document.getElementById('gender-dropdown');
    const categoryDropdown = document.getElementById('category-dropdown');
    const productGrid = document.getElementById('product-grid');
    

    const categories = {
        heren: {
            'sneakers': 'Sneakers',
            'geklede-schoenen': 'Geklede Schoenen',
            'lage-schoenen': 'Lage Schoenen',
            'hoge-schoenen': 'Hoge Schoenen',
            'boots': 'Boots',
            'pantoffels': 'Pantoffels',
            'outdoorschoenen': 'Outdoorschoenen',
            'sandalen-en-slippers': 'Sandalen en Slippers'
        },
        dames: {
            'sneakers': 'Sneakers',
            'enkellaarsjes': 'Enkellaarsjes',
            'lage-schoenen': 'Lage Schoenen',
            'pumps': 'Pumps',
            'laarzen': 'Laarzen',
            'boots': 'Boots',
            'pantoffels': 'Pantoffels',
            'outdoorschoenen': 'Outdoorschoenen',
            'sandalen': 'Sandalen',
            'slippers': 'Slippers'
        }
    };

    // Load categories based on gender selection
    genderDropdown.addEventListener('change', () => {
        const selectedGender = genderDropdown.value;
        updateCategoryOptions(selectedGender);
    });

    // Initialize the dropdown with heren categories
    updateCategoryOptions('heren');

    // Initial load for the heren categories
    function updateCategoryOptions(gender) {
        const categoriesForGender = categories[gender];
        categoryDropdown.innerHTML = ''; // Clear existing categories

        for (const key in categoriesForGender) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = categoriesForGender[key];
            categoryDropdown.appendChild(option);
        }
    }


    // Load products on button click
    scrapeButton.addEventListener('click', async () => {
        scrapeButton.disabled = true;
        scrapeButton.textContent = 'Scraping...';

        // Get selected category from dropdown
        const selectedCategory = categoryDropdown.value;
        const selectedGender = genderDropdown.value;

        try {
            const response = await fetch(`http://localhost:3000/scrape?category=${selectedCategory}&gender=${selectedGender}`);
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
                <div class="product-price">€ ${product.price}</div>
                <div class="product-link"><a href="${product.link}" target="_blank">View Product</a></div>
            `;

            productGrid.appendChild(productCard);
        });
    }
});
