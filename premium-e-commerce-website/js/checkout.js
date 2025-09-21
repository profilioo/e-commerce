// Checkout Page JavaScript for Profilioo E-commerce Website

class CheckoutManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('profilioo_cart')) || [];
        this.shippingCost = 0;
        this.taxRate = 0.08; // 8% tax rate
        this.discount = 0;
        this.promoCodes = {
            'WELCOME10': { type: 'percentage', value: 10, minOrder: 50 },
            'SAVE20': { type: 'percentage', value: 20, minOrder: 100 },
            'FREESHIP': { type: 'shipping', value: 0 },
            'FIRST15': { type: 'percentage', value: 15, minOrder: 75 }
        };
        this.init();
    }

    init() {
        this.displayOrderItems();
        this.calculateTotals();
        this.setupEventListeners();
        this.validateCart();
    }

    // Validate that cart is not empty
    validateCart() {
        if (this.cart.length === 0) {
            // Redirect to products page if cart is empty
            window.location.href = 'products.html';
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Shipping method change
        document.querySelectorAll('input[name="shipping"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateShippingCost());
        });

        // Payment method change
        document.querySelectorAll('input[name="payment"]').forEach(radio => {
            radio.addEventListener('change', () => this.togglePaymentDetails());
        });

        // Promo code application
        const applyPromoBtn = document.getElementById('applyPromo');
        if (applyPromoBtn) {
            applyPromoBtn.addEventListener('click', () => this.applyPromoCode());
        }

        // Enter key on promo code input
        const promoInput = document.getElementById('promoCode');
        if (promoInput) {
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyPromoCode();
                }
            });
        }

        // Form validation and submission
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleCheckout(e));
        }

        // Real-time form validation
        this.setupFormValidation();

        // Billing address toggle
        const sameAsShipping = document.getElementById('sameAsShipping');
        if (sameAsShipping) {
            sameAsShipping.addEventListener('change', () => this.toggleBillingAddress());
        }

        // Format card number input
        const cardNumber = document.getElementById('cardNumber');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => this.formatCardNumber(e));
        }

        // Format expiry date input
        const expiry = document.getElementById('expiry');
        if (expiry) {
            expiry.addEventListener('input', (e) => this.formatExpiryDate(e));
        }
    }

    // Display order items in summary
    displayOrderItems() {
        const container = document.getElementById('order-items');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center">Your cart is empty</p>';
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h3 class="font-medium text-gray-800">${item.name}</h3>
                    <div class="flex items-center justify-between mt-1">
                        <span class="text-sm text-gray-600">Qty: ${item.quantity}</span>
                        <span class="font-semibold text-gray-800">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update shipping cost based on selected method
    updateShippingCost() {
        const selectedShipping = document.querySelector('input[name="shipping"]:checked');
        if (!selectedShipping) return;

        switch (selectedShipping.value) {
            case 'standard':
                this.shippingCost = 0;
                break;
            case 'express':
                this.shippingCost = 9.99;
                break;
            case 'overnight':
                this.shippingCost = 24.99;
                break;
        }

        this.calculateTotals();
    }

    // Calculate and display totals
    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * this.taxRate;
        const total = subtotal + this.shippingCost + tax - this.discount;

        // Update display
        const subtotalEl = document.getElementById('subtotal');
        const shippingEl = document.getElementById('shipping-cost');
        const taxEl = document.getElementById('tax');
        const totalEl = document.getElementById('total');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = this.shippingCost === 0 ? 'FREE' : `$${this.shippingCost.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

        // Show/hide discount row
        const discountRow = document.getElementById('discount-row');
        const discountEl = document.getElementById('discount');
        if (this.discount > 0) {
            discountRow?.classList.remove('hidden');
            if (discountEl) discountEl.textContent = `-$${this.discount.toFixed(2)}`;
        } else {
            discountRow?.classList.add('hidden');
        }
    }

    // Apply promo code
    applyPromoCode() {
        const promoInput = document.getElementById('promoCode');
        if (!promoInput) return;

        const code = promoInput.value.trim().toUpperCase();
        const promo = this.promoCodes[code];

        if (!promo) {
            this.showError('Invalid promo code');
            return;
        }

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Check minimum order requirement
        if (promo.minOrder && subtotal < promo.minOrder) {
            this.showError(`Minimum order of $${promo.minOrder} required for this promo code`);
            return;
        }

        // Apply discount
        if (promo.type === 'percentage') {
            this.discount = subtotal * (promo.value / 100);
        } else if (promo.type === 'shipping') {
            this.shippingCost = 0;
            // Update shipping radio button
            const standardShipping = document.querySelector('input[value="standard"]');
            if (standardShipping) standardShipping.checked = true;
        }

        this.calculateTotals();
        this.showSuccess(`Promo code "${code}" applied successfully!`);
        
        // Disable promo input after successful application
        promoInput.disabled = true;
        document.getElementById('applyPromo').disabled = true;
    }

    // Toggle payment method details
    togglePaymentDetails() {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        const cardDetails = document.getElementById('card-details');
        
        if (selectedPayment && cardDetails) {
            if (selectedPayment.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        }
    }

    // Toggle billing address form
    toggleBillingAddress() {
        const sameAsShipping = document.getElementById('sameAsShipping');
        // In a full implementation, you would show/hide billing address fields here
        console.log('Billing same as shipping:', sameAsShipping.checked);
    }

    // Format card number with spaces
    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
        e.target.value = formattedValue.substring(0, 19); // Limit to 16 digits + 3 spaces
    }

    // Format expiry date as MM/YY
    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }

    // Setup real-time form validation
    setupFormValidation() {
        // Email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => this.validateEmail(emailInput));
        }

        // Phone validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => this.validatePhone(phoneInput));
        }

        // Credit card validation
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('blur', () => this.validateCardNumber(cardNumberInput));
        }

        // CVV validation
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('blur', () => this.validateCVV(cvvInput));
        }
    }

    // Validate email format
    validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value);
        this.toggleFieldValidation(input, isValid, 'Please enter a valid email address');
        return isValid;
    }

    // Validate phone format
    validatePhone(input) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        const isValid = phoneRegex.test(input.value);
        this.toggleFieldValidation(input, isValid, 'Please enter a valid phone number');
        return isValid;
    }

    // Validate credit card number using Luhn algorithm
    validateCardNumber(input) {
        const cardNumber = input.value.replace(/\s/g, '');
        const isValid = this.luhnCheck(cardNumber) && cardNumber.length >= 13;
        this.toggleFieldValidation(input, isValid, 'Please enter a valid card number');
        return isValid;
    }

    // Validate CVV
    validateCVV(input) {
        const isValid = /^\d{3,4}$/.test(input.value);
        this.toggleFieldValidation(input, isValid, 'Please enter a valid CVV');
        return isValid;
    }

    // Luhn algorithm for credit card validation
    luhnCheck(cardNumber) {
        let sum = 0;
        let alternate = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (alternate) {
                digit *= 2;
                if (digit > 9) {
                    digit = (digit % 10) + 1;
                }
            }
            
            sum += digit;
            alternate = !alternate;
        }
        
        return sum % 10 === 0;
    }

    // Toggle field validation styling
    toggleFieldValidation(input, isValid, errorMessage) {
        const errorElement = input.parentElement.querySelector('.error-message');
        
        if (isValid) {
            input.classList.remove('border-red-500');
            input.classList.add('border-green-500');
            if (errorElement) errorElement.remove();
        } else {
            input.classList.remove('border-green-500');
            input.classList.add('border-red-500');
            
            if (!errorElement) {
                const error = document.createElement('div');
                error.className = 'error-message text-red-500 text-sm mt-1';
                error.textContent = errorMessage;
                input.parentElement.appendChild(error);
            }
        }
    }

    // Handle form submission
    handleCheckout(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            this.showError('Please fix the errors in the form');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Processing...';
        submitBtn.disabled = true;

        // Simulate payment processing
        setTimeout(() => {
            this.processPayment();
        }, 2000);
    }

    // Validate entire form
    validateForm() {
        const requiredFields = ['email', 'phone', 'firstName', 'lastName', 'address', 'city', 'state', 'zip'];
        let isValid = true;

        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                this.toggleFieldValidation(field, false, 'This field is required');
                isValid = false;
            }
        });

        // Validate payment method specific fields
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if (selectedPayment?.value === 'card') {
            const cardFields = ['cardNumber', 'expiry', 'cvv', 'cardName'];
            cardFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    this.toggleFieldValidation(field, false, 'This field is required');
                    isValid = false;
                }
            });
        }

        return isValid;
    }

    // Process payment (simulation)
    processPayment() {
        // In a real implementation, this would integrate with a payment processor
        const orderData = this.collectOrderData();
        
        // Simulate successful payment
        localStorage.setItem('profilioo_order', JSON.stringify(orderData));
        localStorage.removeItem('profilioo_cart'); // Clear cart
        
        // Redirect to success page
        window.location.href = 'order-success.html';
    }

    // Collect order data
    collectOrderData() {
        const form = document.getElementById('checkout-form');
        const formData = new FormData(form);
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * this.taxRate;
        const total = subtotal + this.shippingCost + tax - this.discount;

        return {
            orderId: this.generateOrderId(),
            items: this.cart,
            customer: {
                email: formData.get('email'),
                phone: formData.get('phone'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName')
            },
            shipping: {
                address: formData.get('address'),
                apartment: formData.get('apartment'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip'),
                method: formData.get('shipping')
            },
            payment: {
                method: formData.get('payment'),
                // Note: Never store actual payment details in localStorage in a real app
            },
            totals: {
                subtotal: subtotal,
                shipping: this.shippingCost,
                tax: tax,
                discount: this.discount,
                total: total
            },
            orderDate: new Date().toISOString()
        };
    }

    // Generate order ID
    generateOrderId() {
        return 'PF-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    // Show success message
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showToast(message, 'error');
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

// Initialize checkout manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutManager = new CheckoutManager();
});