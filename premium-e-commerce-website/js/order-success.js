// Order Success Page JavaScript for Profilioo E-commerce Website

class OrderSuccessManager {
    constructor() {
        this.orderData = null;
        this.init();
    }

    init() {
        this.loadOrderData();
        this.displayOrderDetails();
        this.setupEventListeners();
        this.loadRecommendations();
    }

    // Load order data from localStorage
    loadOrderData() {
        const savedOrder = localStorage.getItem('profilioo_order');
        if (savedOrder) {
            this.orderData = JSON.parse(savedOrder);
        } else {
            // If no order data, redirect to home
            window.location.href = '/';
        }
    }

    // Display order details on the page
    displayOrderDetails() {
        if (!this.orderData) return;

        // Order Information
        this.updateElement('order-number', this.orderData.orderId);
        this.updateElement('order-date', this.formatDate(this.orderData.orderDate));
        this.updateElement('payment-method', this.formatPaymentMethod(this.orderData.payment.method));
        this.updateElement('shipping-method', this.formatShippingMethod(this.orderData.shipping.method));
        this.updateElement('estimated-delivery', this.calculateDeliveryDate(this.orderData.shipping.method));

        // Shipping Address
        this.displayShippingAddress();

        // Order Items
        this.displayOrderItems();

        // Order Summary
        this.displayOrderSummary();
    }

    // Update element text content safely
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // Display shipping address
    displayShippingAddress() {
        const addressContainer = document.getElementById('shipping-address');
        if (!addressContainer || !this.orderData.shipping) return;

        const shipping = this.orderData.shipping;
        const customer = this.orderData.customer;

        addressContainer.innerHTML = `
            <div class="space-y-1">
                <div class="font-semibold">${customer.firstName} ${customer.lastName}</div>
                <div>${shipping.address}</div>
                ${shipping.apartment ? `<div>${shipping.apartment}</div>` : ''}
                <div>${shipping.city}, ${shipping.state} ${shipping.zip}</div>
            </div>
        `;
    }

    // Display order items
    displayOrderItems() {
        const itemsContainer = document.getElementById('order-items-list');
        if (!itemsContainer || !this.orderData.items) return;

        itemsContainer.innerHTML = this.orderData.items.map(item => `
            <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800">${item.name}</h3>
                    <p class="text-gray-600">Quantity: ${item.quantity}</p>
                    <p class="text-sm text-gray-500">Price: $${item.price.toFixed(2)} each</p>
                </div>
                <div class="text-right">
                    <p class="text-lg font-semibold text-gray-800">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            </div>
        `).join('');
    }

    // Display order summary
    displayOrderSummary() {
        if (!this.orderData.totals) return;

        const totals = this.orderData.totals;

        this.updateElement('summary-subtotal', `$${totals.subtotal.toFixed(2)}`);
        this.updateElement('summary-shipping', totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`);
        this.updateElement('summary-tax', `$${totals.tax.toFixed(2)}`);
        this.updateElement('summary-total', `$${totals.total.toFixed(2)}`);

        // Show discount if applicable
        if (totals.discount > 0) {
            const discountRow = document.getElementById('summary-discount-row');
            const discountElement = document.getElementById('summary-discount');
            if (discountRow && discountElement) {
                discountRow.classList.remove('hidden');
                discountElement.textContent = `-$${totals.discount.toFixed(2)}`;
            }
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Track order button
        const trackButton = document.getElementById('track-order');
        if (trackButton) {
            trackButton.addEventListener('click', () => this.trackOrder());
        }

        // Download receipt button
        const downloadButton = document.getElementById('download-receipt');
        if (downloadButton) {
            downloadButton.addEventListener('click', () => this.downloadReceipt());
        }
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Format payment method for display
    formatPaymentMethod(method) {
        const methods = {
            'card': 'Credit/Debit Card',
            'paypal': 'PayPal'
        };
        return methods[method] || method;
    }

    // Format shipping method for display
    formatShippingMethod(method) {
        const methods = {
            'standard': 'Standard Shipping (5-7 business days)',
            'express': 'Express Shipping (2-3 business days)',
            'overnight': 'Overnight Shipping (Next business day)'
        };
        return methods[method] || method;
    }

    // Calculate estimated delivery date
    calculateDeliveryDate(shippingMethod) {
        const now = new Date();
        let deliveryDays;

        switch (shippingMethod) {
            case 'standard':
                deliveryDays = 7;
                break;
            case 'express':
                deliveryDays = 3;
                break;
            case 'overnight':
                deliveryDays = 1;
                break;
            default:
                deliveryDays = 7;
        }

        // Add business days (skip weekends)
        let businessDaysAdded = 0;
        const deliveryDate = new Date(now);

        while (businessDaysAdded < deliveryDays) {
            deliveryDate.setDate(deliveryDate.getDate() + 1);
            
            // Skip weekends (Saturday = 6, Sunday = 0)
            if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
                businessDaysAdded++;
            }
        }

        return deliveryDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Track order functionality
    trackOrder() {
        // In a real implementation, this would redirect to a tracking page
        // or open a modal with tracking information
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                <div class="text-center">
                    <div class="mb-4">
                        <i class="fas fa-shipping-fast text-4xl text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Order Tracking</h3>
                    <div class="bg-gray-50 rounded-lg p-4 mb-6">
                        <p class="text-sm text-gray-600 mb-2">Order Number:</p>
                        <p class="font-bold text-gray-800">${this.orderData.orderId}</p>
                    </div>
                    <div class="space-y-3 text-left mb-6">
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                            <span class="text-sm">Order Confirmed</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                            <span class="text-sm">Processing</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                            <span class="text-sm text-gray-500">Shipped</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                            <span class="text-sm text-gray-500">Delivered</span>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 mb-6">
                        Your order is currently being processed. You'll receive an email with tracking information once it ships.
                    </p>
                    <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Download receipt functionality
    downloadReceipt() {
        // Create a simple text receipt
        const receipt = this.generateReceiptText();
        
        // Create and trigger download
        const blob = new Blob([receipt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `profilioo-receipt-${this.orderData.orderId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);

        // Show success message
        this.showToast('Receipt downloaded successfully!', 'success');
    }

    // Generate receipt text
    generateReceiptText() {
        const order = this.orderData;
        const date = new Date(order.orderDate).toLocaleString();

        let receipt = `PROFILIOO - ORDER RECEIPT\n`;
        receipt += `================================\n\n`;
        receipt += `Order Number: ${order.orderId}\n`;
        receipt += `Order Date: ${date}\n`;
        receipt += `Customer: ${order.customer.firstName} ${order.customer.lastName}\n`;
        receipt += `Email: ${order.customer.email}\n\n`;
        
        receipt += `SHIPPING ADDRESS:\n`;
        receipt += `${order.customer.firstName} ${order.customer.lastName}\n`;
        receipt += `${order.shipping.address}\n`;
        if (order.shipping.apartment) {
            receipt += `${order.shipping.apartment}\n`;
        }
        receipt += `${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}\n\n`;
        
        receipt += `ITEMS ORDERED:\n`;
        receipt += `--------------------------------\n`;
        order.items.forEach(item => {
            receipt += `${item.name}\n`;
            receipt += `  Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}\n\n`;
        });
        
        receipt += `ORDER SUMMARY:\n`;
        receipt += `--------------------------------\n`;
        receipt += `Subtotal: $${order.totals.subtotal.toFixed(2)}\n`;
        receipt += `Shipping: ${order.totals.shipping === 0 ? 'FREE' : '$' + order.totals.shipping.toFixed(2)}\n`;
        receipt += `Tax: $${order.totals.tax.toFixed(2)}\n`;
        if (order.totals.discount > 0) {
            receipt += `Discount: -$${order.totals.discount.toFixed(2)}\n`;
        }
        receipt += `--------------------------------\n`;
        receipt += `TOTAL: $${order.totals.total.toFixed(2)}\n\n`;
        
        receipt += `Payment Method: ${this.formatPaymentMethod(order.payment.method)}\n`;
        receipt += `Shipping Method: ${this.formatShippingMethod(order.shipping.method)}\n\n`;
        
        receipt += `Thank you for shopping with Profilioo!\n`;
        receipt += `Visit us at: https://profilioo.com\n`;

        return receipt;
    }

    // Load product recommendations
    loadRecommendations() {
        // Simple recommendation logic - could be enhanced with real recommendation engine
        const recommendations = [
            {
                id: 101,
                name: "Premium Phone Case",
                price: 34.99,
                image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop",
                rating: 4.5
            },
            {
                id: 102,
                name: "Wireless Earbuds",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop",
                rating: 4.7
            },
            {
                id: 103,
                name: "Portable Charger",
                price: 29.99,
                image: "https://images.unsplash.com/photo-1609592428387-a3c9e0ed9f52?w=300&h=300&fit=crop",
                rating: 4.3
            }
        ];

        const container = document.getElementById('recommended-products');
        if (!container) return;

        container.innerHTML = recommendations.map(product => `
            <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer" onclick="window.location.href='products.html'">
                <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="font-semibold text-gray-800 mb-2">${product.name}</h3>
                    <div class="flex items-center justify-between">
                        <span class="text-lg font-bold text-blue-600">$${product.price}</span>
                        <div class="flex items-center">
                            <div class="flex text-yellow-400 text-sm mr-1">
                                ${this.generateStars(product.rating)}
                            </div>
                            <span class="text-gray-500 text-sm">${product.rating}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Generate stars for rating (reuse from main app)
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

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border-l-4 ${
            type === 'success' ? 'border-green-500' : 
            type === 'error' ? 'border-red-500' : 'border-blue-500'
        } transform translate-x-96 transition-transform`;
        
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${
                    type === 'success' ? 'check-circle text-green-500' :
                    type === 'error' ? 'exclamation-circle text-red-500' : 'info-circle text-blue-500'
                } mr-3"></i>
                <span class="text-gray-800">${message}</span>
                <button class="ml-4 text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.remove('translate-x-96'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.add('translate-x-96');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
}

// Initialize order success manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.orderSuccessManager = new OrderSuccessManager();
});