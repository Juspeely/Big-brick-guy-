// Sample product data
let products = [];
let cart = [];
let currentFilter = 'all';

// Initialize the store
document.addEventListener('DOMContentLoaded', () => {
    loadProductsFromAdmin();
    loadCart();
    loadSettings();
});

// Load products from admin panel
function loadProductsFromAdmin() {
    const adminProducts = localStorage.getItem('bigbrickguy_products');
    if (adminProducts) {
        products = JSON.parse(adminProducts);
    } else {
        // Default products if none in admin
        products = [
            {
                id: 1,
                name: "Superhero Bundle",
                category: "superhero",
                price: 24.99,
                description: "Custom Batman & Superman minifigures with accessories",
                emoji: "🦸"
            },
            {
                id: 2,
                name: "Dragon Master",
                category: "fantasy",
                price: 19.99,
                description: "Fantasy warrior with dragon armor and sword",
                emoji: "🐉"
            },
            {
                id: 3,
                name: "Ninja Warrior",
                category: "superhero",
                price: 15.99,
                description: "Black belt ninja with authentic weapons",
                emoji: "🥷"
            },
            {
                id: 4,
                name: "Wizard Collection",
                category: "fantasy",
                price: 22.99,
                description: "Powerful wizard with staff and spellbook",
                emoji: "🧙"
            },
            {
                id: 5,
                name: "Custom Pirate",
                category: "custom",
                price: 18.99,
                description: "Unique pirate captain with custom details",
                emoji: "🏴‍☠️"
            },
            {
                id: 6,
                name: "Space Explorer",
                category: "custom",
                price: 21.99,
                description: "Futuristic astronaut with advanced suit",
                emoji: "🧑‍🚀"
            },
            {
                id: 7,
                name: "Medieval Knight",
                category: "fantasy",
                price: 20.99,
                description: "Armored knight with sword and shield",
                emoji: "🛡️"
            },
            {
                id: 8,
                name: "Superhero Pack",
                category: "superhero",
                price: 29.99,
                description: "3-pack of popular superheroes",
                emoji: "🦹"
            }
        ];
    }
    // Render products using the current filter
    loadProducts(currentFilter);
}

// Load and display products
function loadProducts(category) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-description">${product.description}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter and display products
function filterProducts(category) {
    currentFilter = category;
    
    // Update active filter button without relying on an event object
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        // Try to detect the matching button by looking at its onclick attribute or data-category if present
        const onclickAttr = btn.getAttribute('onclick') || '';
        const dataCategory = btn.getAttribute('data-category') || '';
        if (dataCategory === category || onclickAttr.includes(`'${category}'`)) {
            btn.classList.add('active');
        }
    });
    
    loadProducts(category);
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert('Product not found');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Show feedback
    alert(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update quantity
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        updateCartUI();
    }
}

// Update cart UI
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartCount || !cartTotal) return;

    // Update cart count
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart items display
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (!cartSidebar) return;
    cartSidebar.classList.toggle('active');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create order object
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            emoji: item.emoji
        })),
        total: total
    };

    // Save order to localStorage
    let orders = [];
    const savedOrders = localStorage.getItem('bigbrickguy_orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    orders.push(order);
    localStorage.setItem('bigbrickguy_orders', JSON.stringify(orders));

    // Notify admin panel
    localStorage.setItem('bigbrickguy_order_completed', JSON.stringify(order));

    alert(`Thank you for your order!\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}\n\nWe'll contact you soon to finalize your custom order.`);
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('bigbrickguy_cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('bigbrickguy_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
        updateCartUI();
    }
}

// Load settings from admin
function loadSettings() {
    const storeName = localStorage.getItem('store_name') || 'Big Brick Guy';
    const storeDescription = localStorage.getItem('store_description') || 'Premium Hand-Made LEGO Minifigures & Custom Designs';
    
    // Update page title if needed
    document.title = storeName;
}

// Listen for product updates from admin panel
window.addEventListener('storage', (e) => {
    if (e.key === 'bigbrickguy_products_sync' && e.newValue) {
        try {
            const updatedProducts = JSON.parse(e.newValue);
            products = updatedProducts;
            loadProducts(currentFilter);
        } catch (err) {
            // ignore invalid JSON
        }
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
