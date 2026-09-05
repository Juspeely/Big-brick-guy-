// Admin Panel JavaScript

let products = [];
let orders = [];
let editingProductId = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadOrders();
    updateStats();
    loadSettings();
    setupProductForm();
});

// Load products from localStorage
function loadProducts() {
    const savedProducts = localStorage.getItem('bigbrickguy_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Load default products
        products = [
            {
                id: 1,
                name: "Superhero Bundle",
                category: "superhero",
                price: 24.99,
                description: "Custom Batman & Superman minifigures with accessories",
                image: null,
                emoji: "🦸"
            },
            {
                id: 2,
                name: "Dragon Master",
                category: "fantasy",
                price: 19.99,
                description: "Fantasy warrior with dragon armor and sword",
                image: null,
                emoji: "🐉"
            },
            {
                id: 3,
                name: "Ninja Warrior",
                category: "superhero",
                price: 15.99,
                description: "Black belt ninja with authentic weapons",
                image: null,
                emoji: "🥷"
            },
            {
                id: 4,
                name: "Wizard Collection",
                category: "fantasy",
                price: 22.99,
                description: "Powerful wizard with staff and spellbook",
                image: null,
                emoji: "🧙"
            },
            {
                id: 5,
                name: "Custom Pirate",
                category: "custom",
                price: 18.99,
                description: "Unique pirate captain with custom details",
                image: null,
                emoji: "🏴‍☠️"
            },
            {
                id: 6,
                name: "Space Explorer",
                category: "custom",
                price: 21.99,
                description: "Futuristic astronaut with advanced suit",
                image: null,
                emoji: "🧑‍🚀"
            },
            {
                id: 7,
                name: "Medieval Knight",
                category: "fantasy",
                price: 20.99,
                description: "Armored knight with sword and shield",
                image: null,
                emoji: "🛡️"
            },
            {
                id: 8,
                name: "Superhero Pack",
                category: "superhero",
                price: 29.99,
                description: "3-pack of popular superheroes",
                image: null,
                emoji: "🦹"
            }
        ];
        saveProducts();
    }
    displayProducts();
    syncProductsToStore();
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('bigbrickguy_products', JSON.stringify(products));
    syncProductsToStore();
}

// Sync products to main store
function syncProductsToStore() {
    localStorage.setItem('bigbrickguy_products_sync', JSON.stringify(products));
}

// Display products in table
function displayProducts() {
    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = '';

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No products yet. Add one!</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        const imageDisplay = product.image ? `<img src="${product.image}" alt="${product.name}" class="product-thumbnail">` : `<span class="emoji-display">${product.emoji}</span>`;
        row.innerHTML = `
            <td>#${product.id}</td>
            <td class="image-cell">${imageDisplay}</td>
            <td>${product.name}</td>
            <td><span style="background: #f0f0f0; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">${product.category}</span></td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.description.substring(0, 30)}...</td>
            <td>
                <div class="table-actions">
                    <button class="btn-small btn-edit" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Preview image
function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('image-preview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            preview.dataset.imageData = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Open add product modal
function openAddProductModal() {
    editingProductId = null;
    document.getElementById('modal-title').textContent = 'Add New Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('image-preview').dataset.imageData = '';
    document.getElementById('product-modal').classList.add('active');
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        editingProductId = productId;
        document.getElementById('modal-title').textContent = 'Edit Product';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-emoji').value = product.emoji;
        
        const imagePreview = document.getElementById('image-preview');
        if (product.image) {
            imagePreview.innerHTML = `<img src="${product.image}" alt="Preview">`;
            imagePreview.dataset.imageData = product.image;
        } else {
            imagePreview.innerHTML = '';
            imagePreview.dataset.imageData = '';
        }
        
        document.getElementById('product-modal').classList.add('active');
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        displayProducts();
    }
}

// Close product modal
function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

// Setup product form submission
function setupProductForm() {
    document.getElementById('product-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const productId = parseInt(document.getElementById('product-id').value);
        const name = document.getElementById('product-name').value;
        const category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const description = document.getElementById('product-description').value;
        const emoji = document.getElementById('product-emoji').value || '🧱';
        const imageData = document.getElementById('image-preview').dataset.imageData || null;

        if (editingProductId) {
            // Update existing product
            const product = products.find(p => p.id === editingProductId);
            if (product) {
                product.name = name;
                product.category = category;
                product.price = price;
                product.description = description;
                product.emoji = emoji;
                if (imageData) {
                    product.image = imageData;
                }
            }
        } else {
            // Add new product
            const newId = Math.max(...products.map(p => p.id), 0) + 1;
            products.push({
                id: newId,
                name,
                category,
                price,
                description,
                emoji,
                image: imageData
            });
        }

        saveProducts();
        displayProducts();
        closeProductModal();
        alert('Product saved successfully!');
    });
}

// Load orders from localStorage
function loadOrders() {
    const savedOrders = localStorage.getItem('bigbrickguy_orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    displayOrders();
}

// Display orders
function displayOrders() {
    const container = document.getElementById('orders-container');
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-message">No orders yet. Check back soon! 📦</div>';
        return;
    }

    orders.slice().reverse().forEach((order, index) => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        const itemsHTML = order.items.map(item => 
            `<div class="order-item">
                <span>${item.emoji} ${item.name} x${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>`
        ).join('');

        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div class="order-items">
                ${itemsHTML}
            </div>
            <div class="order-total">
                <span>Total</span>
                <span>$${order.total.toFixed(2)}</span>
            </div>
        `;
        container.appendChild(orderCard);
    });
}

// Clear orders
function clearOrders() {
    if (confirm('Are you sure you want to clear all order history?')) {
        orders = [];
        localStorage.removeItem('bigbrickguy_orders');
        displayOrders();
        updateStats();
    }
}

// Update statistics
function updateStats() {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    document.getElementById('stat-products').textContent = totalProducts;
    document.getElementById('stat-orders').textContent = totalOrders;
    document.getElementById('stat-revenue').textContent = '$' + totalRevenue.toFixed(2);
    document.getElementById('stat-average').textContent = '$' + averageOrderValue.toFixed(2);
}

// Switch tabs
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all nav links
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');

    // Add active to clicked link
    event.target.classList.add('active');
}

// Load settings
function loadSettings() {
    const storeName = localStorage.getItem('store_name') || 'Big Brick Guy';
    const storeEmail = localStorage.getItem('store_email') || 'justinmarinco9@gmail.com';
    const storeDescription = localStorage.getItem('store_description') || 'Premium Hand-Made LEGO Minifigures & Custom Designs';

    document.getElementById('store-name').value = storeName;
    document.getElementById('store-email').value = storeEmail;
    document.getElementById('store-description').value = storeDescription;
}

// Save settings
function saveSettings() {
    const storeName = document.getElementById('store-name').value;
    const storeEmail = document.getElementById('store-email').value;
    const storeDescription = document.getElementById('store-description').value;

    localStorage.setItem('store_name', storeName);
    localStorage.setItem('store_email', storeEmail);
    localStorage.setItem('store_description', storeDescription);

    alert('Settings saved successfully!');
}

// Listen for cart checkouts from main store
window.addEventListener('storage', (e) => {
    if (e.key === 'bigbrickguy_order_completed') {
        const newOrder = JSON.parse(e.newValue);
        orders.push(newOrder);
        localStorage.setItem('bigbrickguy_orders', JSON.stringify(orders));
        displayOrders();
        updateStats();
    }
    if (e.key === 'bigbrickguy_products_sync') {
        products = JSON.parse(e.newValue);
        displayProducts();
        updateStats();
    }
});
