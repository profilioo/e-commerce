// Profilioo E-commerce Website JavaScript
// Modern JavaScript with ES6+ features

class ProfiliooEcommerce {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('profilioo_cart')) || [];
        this.products = [];
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.updateCartUI();
        this.initializeAnimations();
    }

    // Setup all event listeners
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Cart sidebar toggle
        const cartBtn = document.getElementById('cart-btn');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCartBtn = document.getElementById('close-cart');

        if (cartBtn && cartSidebar) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.remove('translate-x-full');
            });
        }

        if (closeCartBtn && cartSidebar) {
            closeCartBtn.addEventListener('click', () => {
                cartSidebar.classList.add('translate-x-full');
            });
        }

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (cartSidebar && !cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
                cartSidebar.classList.add('translate-x-full');
            }
        });

        // Newsletter subscription
        const newsletterForm = document.querySelector('section input[type="email"]');
        const subscribeBtn = newsletterForm?.nextElementSibling;
        
        if (subscribeBtn) {
            subscribeBtn.addEventListener('click', () => {
                const email = newsletterForm.value;
                if (this.validateEmail(email)) {
                    this.showToast('Successfully subscribed to newsletter!', 'success');
                    newsletterForm.value = '';
                } else {
                    this.showToast('Please enter a valid email address', 'error');
                }
            });
        }

        // Search functionality
        const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Search"]');
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(input.value);
                }
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Load sample products
    loadProducts() {
        this.products = [
            {
                id: 1,
                name: "Premium Wireless Headphones",
                price: 199.99,
                originalPrice: 249.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
                rating: 4.8,
                reviews: 128,
                badge: "sale",
                description: "High-quality wireless headphones with noise cancellation"
            },
            {
                id: 2,
                name: "Stylish Cotton T-Shirt",
                price: 29.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
                rating: 4.5,
                reviews: 85,
                badge: "new",
                description: "Comfortable and stylish cotton t-shirt for everyday wear"
            },
            {
                id: 3,
                name: "Modern Coffee Table",
                price: 349.99,
                category: "home",
                image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=300&fit=crop",
                rating: 4.7,
                reviews: 42,
                description: "Elegant wooden coffee table perfect for modern living rooms"
            },
            {
                id: 4,
                name: "Smartphone Case",
                price: 24.99,
                originalPrice: 34.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop",
                rating: 4.3,
                reviews: 156,
                badge: "sale",
                description: "Durable protection for your smartphone with style"
            },
            {
                id: 5,
                name: "Designer Sunglasses",
                price: 89.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop",
                rating: 4.6,
                reviews: 73,
                description: "Trendy sunglasses with UV protection and premium materials"
            },
            {
                id: 6,
                name: "Scented Candle Set",
                price: 39.99,
                category: "home",
                image: "https://images.unsplash.com/photo-1602874801577-91ed9bdb0716?w=300&h=300&fit=crop",
                rating: 4.9,
                reviews: 98,
                badge: "new",
                description: "Set of luxury scented candles for a relaxing atmosphere"
            },
            {
                id: 7,
                name: "Fitness Tracker Watch",
                price: 159.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop",
                rating: 4.4,
                reviews: 211,
                description: "Advanced fitness tracking with heart rate monitoring"
            },
            {
                id: 8,
                name: "Leather Backpack",
                price: 129.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
                rating: 4.7,
                reviews: 64,
                description: "Premium leather backpack for work and travel"
            }
        ];

        this.displayFeaturedProducts();
    }

    // Display featured products on homepage
    displayFeaturedProducts() {
        const featuredContainer = document.getElementById('featured-products');
        if (!featuredContainer) return;

        const featuredProducts = this.products.slice(0, 4);
        featuredContainer.innerHTML = featuredProducts.map(product => this.createProductCard(product)).join('');
    }

    // Create product card HTML
    createProductCard(product) {
        const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;
        const discount = hasOriginalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        return `
            <div class="product-card group" data-product-id="${product.id}">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge}</div>` : ''}
                    ${discount > 0 ? `<div class="product-badge sale" style="top: 3rem;">-${discount}%</div>` : ''}
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button class="bg-white text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-100 transition" onclick="app.quickView(${product.id})">
                            <i class="fas fa-eye mr-1"></i> Quick View
                        </button>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onclick="app.addToCart(${product.id})">
                            <i class="fas fa-cart-plus mr-1"></i> Add to Cart
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2 line-clamp-2">${product.name}</h3>
                    <div class="flex items-center mb-2">
                        <div class="flex text-yellow-400 text-sm mr-2">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="text-gray-500 text-sm">(${product.reviews})</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div>
                            <span class="text-2xl font-bold text-blue-600">$${product.price}</span>
                            ${hasOriginalPrice ? `<span class="text-gray-500 line-through ml-2">$${product.originalPrice}</span>` : ''}
                        </div>
                        <span class="text-xs text-gray-500 capitalize">${product.category}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Generate star rating HTML
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    // Add product to cart
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showToast(`${product.name} added to cart!`, 'success');
    }

    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
        this.showToast('Item removed from cart', 'success');
    }

    // Update cart quantity
    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    // Update cart UI
    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="flex items-center space-x-3 p-3 border rounded-lg">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                        <div class="flex-1">
                            <h4 class="font-medium text-sm">${item.name}</h4>
                            <p class="text-blue-600 font-semibold">$${item.price}</p>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button class="w-6 h-6 bg-gray-200 rounded text-sm" onclick="app.updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="w-8 text-center text-sm">${item.quantity}</span>
                            <button class="w-6 h-6 bg-gray-200 rounded text-sm" onclick="app.updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="text-red-500 hover:text-red-700" onclick="app.removeFromCart(${item.id})">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>
                `).join('');
            }
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('profilioo_cart', JSON.stringify(this.cart));
    }

    // Quick view product
    quickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Create modal for quick view
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">${product.name}</h2>
                    <button class="text-gray-500 hover:text-gray-700 text-2xl" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    <img src="${product.image}" alt="${product.name}" class="w-full rounded-lg">
                    <div>
                        <div class="flex items-center mb-3">
                            <div class="flex text-yellow-400 mr-2">
                                ${this.generateStars(product.rating)}
                            </div>
                            <span class="text-gray-500">(${product.reviews} reviews)</span>
                        </div>
                        <p class="text-gray-600 mb-4">${product.description}</p>
                        <div class="flex items-center mb-6">
                            <span class="text-3xl font-bold text-blue-600">$${product.price}</span>
                            ${product.originalPrice && product.originalPrice > product.price ? 
                                `<span class="text-gray-500 line-through ml-3">$${product.originalPrice}</span>` : ''}
                        </div>
                        <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition" 
                                onclick="app.addToCart(${product.id}); this.parentElement.parentElement.parentElement.parentElement.remove();">
                            <i class="fas fa-cart-plus mr-2"></i>Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Handle search
    handleSearch(query) {
        if (!query.trim()) return;
        
        // Redirect to products page with search query
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${this.getToastIcon(type)} mr-3"></i>
                <span>${message}</span>
                <button class="ml-4 text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Get toast icon based on type
    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Initialize animations on scroll
    initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.card, .product-card, section > div').forEach(el => {
            observer.observe(el);
        });
    }

    // Utility function to format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Utility function to debounce function calls
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Handle lazy loading of images
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Handle form submissions
    handleFormSubmission(form, callback) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            callback(formData);
        });
    }

    // Initialize PWA features
    initPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ProfiliooEcommerce();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, save any pending data
        if (window.app) {
            window.app.saveCart();
        }
    }
});

// Handle before page unload
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.saveCart();
    }
});

// Expose useful functions globally
window.ProfiliooUtils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },
    
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};