async function fetchProducts() {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Fetched products:', data);  // Debugging: Log fetched data
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}
function truncateTitle(title, maxLength) {
    if (title.length > maxLength) {
        return title.substring(0, maxLength) + '..'; 
    }
    return title;
}

function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab');
    const productContainers = document.querySelectorAll('.products');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`.tab[onclick="switchTab('${tabId}')"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    productContainers.forEach(container => {
        container.classList.remove('active');
    });
    const activeContainer = document.getElementById(tabId);
    if (activeContainer) {
        activeContainer.classList.add('active');
    }
}

function calculateDiscount(price, compareAtPrice) {
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

async function loadProducts() {
    const data = await fetchProducts();
    if (!data) {
        console.error('No products data found');  // Debugging: Log if products data is missing
        return;
    }

    const categories = data.categories;

    categories.forEach(category => {
        const categoryId = category.category_name.toLowerCase();
        const container = document.getElementById(categoryId);
        if (container) {
            let productCards = '';
            const maxTitleLength = 11
            category.category_products.forEach(product => {
                const discount = calculateDiscount(product.price, product.compare_at_price);
                const badgeText = product.badge_text ? `<div class="badge">${product.badge_text}</div>` : '';
                const truncatedTitle = truncateTitle(product.title, maxTitleLength);
                productCards += `
                    <div class="product-card">
                        <div class="image-container">
                            ${badgeText}
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                        <div class="product-info">
                        <div class="title-vendor">
                            <h3>${truncatedTitle} </h3>
                            <p>
                              <span class="vendor-dot"></span>
                              ${product.vendor}
                            </p>
                        </div>
                            
                            <p><span class="price">Rs ${product.price}.00</span> <span class="compare-at-price"> ${product.compare_at_price}.00</span> <span class="discount">${discount}% Off</span></p>
                            
                            <a href="#" class="add-to-cart">Add to Cart</a>
                        </div>
                    </div>
                `;
            });
            container.innerHTML = productCards;
        } else {
            console.error(`No container found for category: ${categoryId}`);  // Debugging: Log if no container is found for a category
        }
    });
    switchTab('men')
}

window.onload = loadProducts;

