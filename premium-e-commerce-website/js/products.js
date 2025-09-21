// Products Page JavaScript for Profilioo E-commerce Website

class ProductsManager {
    constructor() {
        this.allProducts = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid';
        this.filters = {
            categories: ['all'],
            priceRange: 'all',
            rating: 'all',
            search: ''
        };
        this.sortBy = 'featured';
        this.init();
    }

    init() {
        this.loadAllProducts();
        this.setupEventListeners();
        this.parseURLParams();
    }

    // Load extended product catalog
    loadAllProducts() {
        // Extended product catalog with more variety
        this.allProducts = [
            {
                id: 1,
                name: "Premium Wireless Headphones",
                price: 199.99,
                originalPrice: 249.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
                rating: 4.8,
                reviews: 128,
                badge: "sale",
                description: "High-quality wireless headphones with active noise cancellation and 30-hour battery life.",
                features: ["Active Noise Cancellation", "30h Battery", "Quick Charge", "Premium Sound"]
            },
            {
                id: 2,
                name: "Stylish Cotton T-Shirt",
                price: 29.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
                rating: 4.5,
                reviews: 85,
                badge: "new",
                description: "Comfortable and stylish 100% organic cotton t-shirt for everyday wear.",
                features: ["100% Organic Cotton", "Soft Fabric", "Machine Washable", "Available in 8 Colors"]
            },
            {
                id: 3,
                name: "Modern Coffee Table",
                price: 349.99,
                category: "home",
                image: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop",
                rating: 4.7,
                reviews: 42,
                description: "Elegant solid wood coffee table with minimalist design, perfect for modern living rooms.",
                features: ["Solid Wood", "Modern Design", "Easy Assembly", "Scratch Resistant"]
            },
            {
                id: 4,
                name: "Smartphone Case",
                price: 24.99,
                originalPrice: 34.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop",
                rating: 4.3,
                reviews: 156,
                badge: "sale",
                description: "Durable protection for your smartphone with military-grade drop protection.",
                features: ["Military Grade Protection", "Wireless Charging Compatible", "Precise Cutouts", "Lifetime Warranty"]
            },
            {
                id: 5,
                name: "Designer Sunglasses",
                price: 89.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
                rating: 4.6,
                reviews: 73,
                description: "Premium polarized sunglasses with UV400 protection and titanium frame.",
                features: ["UV400 Protection", "Polarized Lenses", "Titanium Frame", "Designer Style"]
            },
            {
                id: 6,
                name: "Scented Candle Set",
                price: 39.99,
                category: "home",
                image: "https://images.unsplash.com/photo-1602874801577-91ed9bdb0716?w=400&h=400&fit=crop",
                rating: 4.9,
                reviews: 98,
                badge: "new",
                description: "Set of 3 luxury scented candles made with natural soy wax and essential oils.",
                features: ["Natural Soy Wax", "Essential Oils", "45h Burn Time Each", "Reusable Glass Jars"]
            },
            {
                id: 7,
                name: "Fitness Tracker Watch",
                price: 159.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop",
                rating: 4.4,
                reviews: 211,
                description: "Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.",
                features: ["Heart Rate Monitor", "GPS Tracking", "7-Day Battery", "Water Resistant"]
            },
            {
                id: 8,
                name: "Leather Backpack",
                price: 129.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
                rating: 4.7,
                reviews: 64,
                description: "Handcrafted genuine leather backpack with laptop compartment and premium hardware.",
                features: ["Genuine Leather", "Laptop Compartment", "Premium Hardware", "Lifetime Warranty"]
            },
            {
                id: 9,
                name: "Wireless Charging Pad",
                price: 45.99,
                originalPrice: 59.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1609592428387-a3c9e0ed9f52?w=400&h=400&fit=crop",
                rating: 4.2,
                reviews: 89,
                badge: "sale",
                description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
                features: ["Fast Charging", "Universal Compatibility", "LED Indicator", "Overheating Protection"]
            },
            {
                id: 10,
                name: "Denim Jacket",
                price: 79.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=400&fit=crop",
                rating: 4.5,
                reviews: 67,
                description: "Classic denim jacket made from premium cotton denim with vintage wash finish.",
                features: ["Premium Denim", "Vintage Wash", "Classic Fit", "Metal Buttons"]
            },
            {
                id: 11,
                name: "Decorative Plant Pot Set",
                price: 54.99,
                category: "home",
                image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop",
                rating: 4.8,
                reviews: 34,
                badge: "new",
                description: "Set of 3 modern ceramic plant pots with drainage holes and saucers.",
                features: ["Ceramic Material", "Drainage Holes", "Includes Saucers", "Modern Design"]
            },
            {
                id: 12,
                name: "Bluetooth Speaker",
                price: 89.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
                rating: 4.6,
                reviews: 145,
                description: "Portable Bluetooth speaker with 360° sound, waterproof design, and 12h battery.",
                features: ["360° Sound", "Waterproof IPX7", "12h Battery", "Voice Assistant"]
            },
            {
                id: 13,
                name: "Running Shoes",
                price: 119.99,
                originalPrice: 149.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
                rating: 4.7,
                reviews: 198,
                badge: "sale",
                description: "Lightweight running shoes with responsive cushioning and breathable mesh upper.",
                features: ["Responsive Cushioning", "Breathable Mesh", "Lightweight", "All-Day Comfort"]
            },
            {
                id: 14,
                name: "Table Lamp",
                price: 69.99,
                category: "home",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                rating: 4.4,
                reviews: 56,
                description: "Modern LED table lamp with adjustable brightness and USB charging port.",
                features: ["LED Technology", "Adjustable Brightness", "USB Charging Port", "Modern Design"]
            },
            {
                id: 15,
                name: "Gaming Mouse",
                price: 59.99,
                category: "electronics",
                image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
                rating: 4.5,
                reviews: 134,
                badge: "new",
                description: "High-precision gaming mouse with RGB lighting and programmable buttons.",
                features: ["High Precision Sensor", "RGB Lighting", "Programmable Buttons", "Ergonomic Design"]
            },
            {
                id: 16,
                name: "Wool Sweater",
                price: 89.99,
                category: "fashion",
                image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
                rating: 4.6,
                reviews: 78,
                description: "Cozy wool sweater made from premium merino wool with classic crew neck design.",
                features: ["Merino Wool", "Crew Neck", "Machine Washable", "Anti-Pilling"]
            }
        ];

        this.filteredProducts = [...this.allProducts];
        this.displayProducts();
        this.updateResultsCount();
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter event listeners
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        document.querySelectorAll('.price-filter').forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        document.querySelectorAll('.rating-filter').forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        // Search functionality
        const searchInput = document.getElementById('product-search');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', window.app.debounce((e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300));
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.filters.search = searchInput.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.sortProducts();
                this.displayProducts();
            });
        }

        // View toggle
        const gridView = document.getElementById('grid-view');
        const listView = document.getElementById('list-view');

        if (gridView) {
            gridView.addEventListener('click', () => {
                this.currentView = 'grid';
                this.updateViewButtons();
                this.displayProducts();
            });
        }

        if (listView) {
            listView.addEventListener('click', () => {
                this.currentView = 'list';
                this.updateViewButtons();
                this.displayProducts();
            });
        }

        // Clear filters
        const clearFilters = document.getElementById('clear-filters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearAllFilters());
        }

        // Load more
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreProducts());
        }
    }

    // Parse URL parameters
    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Handle search parameter
        const searchParam = urlParams.get('search');
        if (searchParam) {
            this.filters.search = searchParam.toLowerCase();
            const searchInput = document.getElementById('product-search');
            if (searchInput) {
                searchInput.value = searchParam;
            }
        }

        // Handle category parameter
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            this.filters.categories = [categoryParam];
            const categoryFilter = document.querySelector(`input[value="${categoryParam}"]`);
            if (categoryFilter) {
                categoryFilter.checked = true;
                document.querySelector('input[value="all"]').checked = false;
            }
        }

        this.applyFilters();
    }

    // Apply all filters
    applyFilters() {
        this.filteredProducts = this.allProducts.filter(product => {
            return this.matchesCategory(product) &&
                   this.matchesPrice(product) &&
                   this.matchesRating(product) &&
                   this.matchesSearch(product);
        });

        this.sortProducts();
        this.currentPage = 1;
        this.displayProducts();
        this.updateResultsCount();
        this.toggleNoResults();
    }

    // Category filter matching
    matchesCategory(product) {
        const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(input => input.value);
        
        return selectedCategories.includes('all') || selectedCategories.includes(product.category);
    }

    // Price filter matching
    matchesPrice(product) {
        const selectedPrice = document.querySelector('.price-filter:checked')?.value;
        
        if (!selectedPrice || selectedPrice === 'all') return true;
        
        const price = product.price;
        
        switch (selectedPrice) {
            case '0-50':
                return price < 50;
            case '50-100':
                return price >= 50 && price < 100;
            case '100-200':
                return price >= 100 && price < 200;
            case '200+':
                return price >= 200;
            default:
                return true;
        }
    }

    // Rating filter matching
    matchesRating(product) {
        const selectedRating = document.querySelector('.rating-filter:checked')?.value;
        
        if (!selectedRating || selectedRating === 'all') return true;
        
        const rating = product.rating;
        
        switch (selectedRating) {
            case '4+':
                return rating >= 4.0;
            case '4.5+':
                return rating >= 4.5;
            default:
                return true;
        }
    }

    // Search filter matching
    matchesSearch(product) {
        if (!this.filters.search) return true;
        
        const searchTerms = this.filters.search.toLowerCase();
        return product.name.toLowerCase().includes(searchTerms) ||
               product.description.toLowerCase().includes(searchTerms) ||
               product.category.toLowerCase().includes(searchTerms);
    }

    // Sort products
    sortProducts() {
        switch (this.sortBy) {
            case 'name-asc':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            default: // featured
                // Keep original order for featured
                break;
        }
    }

    // Display products
    displayProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (this.currentView === 'grid') {
            container.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6';
            container.innerHTML = productsToShow.map(product => this.createGridProductCard(product)).join('');
        } else {
            container.className = 'space-y-6';
            container.innerHTML = productsToShow.map(product => this.createListProductCard(product)).join('');
        }

        this.updateLoadMoreButton();
    }

    // Create grid view product card
    createGridProductCard(product) {
        const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;
        const discount = hasOriginalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        return `
            <div class="product-card group cursor-pointer" data-product-id="${product.id}">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge}</div>` : ''}
                    ${discount > 0 ? `<div class="product-badge sale" style="top: 3rem;">-${discount}%</div>` : ''}
                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button class="bg-white text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-100 transition" onclick="window.app.quickView(${product.id})">
                            <i class="fas fa-eye mr-1"></i> Quick View
                        </button>
                        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onclick="window.app.addToCart(${product.id})">
                            <i class="fas fa-cart-plus mr-1"></i> Add to Cart
                        </button>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2 line-clamp-2">${product.name}</h3>
                    <div class="flex items-center mb-2">
                        <div class="flex text-yellow-400 text-sm mr-2">
                            ${window.app.generateStars(product.rating)}
                        </div>
                        <span class="text-gray-500 text-sm">(${product.reviews})</span>
                    </div>
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${product.description}</p>
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

    // Create list view product card
    createListProductCard(product) {
        const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;
        const discount = hasOriginalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
        
        return `
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="relative md:w-48 flex-shrink-0">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-lg">
                        ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge}</div>` : ''}
                        ${discount > 0 ? `<div class="product-badge sale" style="top: 3rem;">-${discount}%</div>` : ''}
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-xl font-semibold">${product.name}</h3>
                            <span class="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">${product.category}</span>
                        </div>
                        <div class="flex items-center mb-3">
                            <div class="flex text-yellow-400 text-sm mr-2">
                                ${window.app.generateStars(product.rating)}
                            </div>
                            <span class="text-gray-500 text-sm">(${product.reviews} reviews)</span>
                        </div>
                        <p class="text-gray-600 mb-4">${product.description}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${product.features ? product.features.map(feature => 
                                `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">${feature}</span>`
                            ).join('') : ''}
                        </div>
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="text-2xl font-bold text-blue-600">$${product.price}</span>
                                ${hasOriginalPrice ? `<span class="text-gray-500 line-through ml-2">$${product.originalPrice}</span>` : ''}
                            </div>
                            <div class="flex gap-2">
                                <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition" onclick="window.app.quickView(${product.id})">
                                    <i class="fas fa-eye mr-1"></i> Quick View
                                </button>
                                <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onclick="window.app.addToCart(${product.id})">
                                    <i class="fas fa-cart-plus mr-1"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update view buttons
    updateViewButtons() {
        const gridBtn = document.getElementById('grid-view');
        const listBtn = document.getElementById('list-view');

        if (this.currentView === 'grid') {
            gridBtn?.classList.add('bg-blue-600', 'text-white');
            gridBtn?.classList.remove('bg-gray-100', 'text-gray-600');
            listBtn?.classList.add('bg-gray-100', 'text-gray-600');
            listBtn?.classList.remove('bg-blue-600', 'text-white');
        } else {
            listBtn?.classList.add('bg-blue-600', 'text-white');
            listBtn?.classList.remove('bg-gray-100', 'text-gray-600');
            gridBtn?.classList.add('bg-gray-100', 'text-gray-600');
            gridBtn?.classList.remove('bg-blue-600', 'text-white');
        }
    }

    // Update results count
    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            const showing = Math.min(this.currentPage * this.productsPerPage, this.filteredProducts.length);
            countElement.textContent = `${showing} of ${this.filteredProducts.length}`;
        }
    }

    // Toggle no results message
    toggleNoResults() {
        const noResults = document.getElementById('no-results');
        const container = document.getElementById('products-container');
        const loadMore = document.getElementById('load-more');

        if (this.filteredProducts.length === 0) {
            noResults?.classList.remove('hidden');
            container?.classList.add('hidden');
            loadMore?.classList.add('hidden');
        } else {
            noResults?.classList.add('hidden');
            container?.classList.remove('hidden');
            loadMore?.classList.remove('hidden');
        }
    }

    // Update load more button
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            const hasMore = this.currentPage * this.productsPerPage < this.filteredProducts.length;
            loadMoreBtn.style.display = hasMore ? 'block' : 'none';
        }
    }

    // Load more products
    loadMoreProducts() {
        this.currentPage++;
        this.displayProducts();
        this.updateResultsCount();
    }

    // Clear all filters
    clearAllFilters() {
        // Reset category filters
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.checked = filter.value === 'all';
        });

        // Reset price filters
        document.querySelectorAll('.price-filter').forEach(filter => {
            filter.checked = filter.value === 'all';
        });

        // Reset rating filters
        document.querySelectorAll('.rating-filter').forEach(filter => {
            filter.checked = filter.value === 'all';
        });

        // Reset search
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.value = '';
        }

        // Reset sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = 'featured';
        }

        this.filters = {
            categories: ['all'],
            priceRange: 'all',
            rating: 'all',
            search: ''
        };
        this.sortBy = 'featured';
        this.applyFilters();
    }
}

// Initialize products manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to be initialized
    if (window.app) {
        window.productsManager = new ProductsManager();
        // Update main app products with extended catalog
        window.app.products = window.productsManager.allProducts;
    } else {
        // If main app not ready, wait and try again
        setTimeout(() => {
            window.productsManager = new ProductsManager();
            if (window.app) {
                window.app.products = window.productsManager.allProducts;
            }
        }, 100);
    }
});