/**
 * ProTools Store - Main JavaScript
 * Shopify Theme v4.5.2
 * 
 * Shopify Theme JavaScript with simulated e-commerce functionality
 */

// ============================================
// Shopify Global Variables Empreintes
// ============================================
(function() {
    'use strict';

    // Shopify theme object initialization
    window.Shopify = window.Shopify || {};
    
    // Shopify theme configuration
    window.Shopify.theme = {
        name: "ProTools Theme",
        id: 123456789,
        version: "4.5.2",
        theme_store_id: 987654321,
        role: "main",
        settings: {
            cart_type: "drawer",
            enable_payment_button: true,
            currency_format: "${{amount}}",
            enable_multilang: false
        }
    };

    // Shopify shop configuration
    window.Shopify.shop = "protools-store-2024.myshopify.com";
    window.Shopify.currency = {
        active: "USD",
        rate: "1.0"
    };
    window.Shopify.country = "US";
    window.Shopify.locale = "en";
    
    // Shopify routes
    window.Shopify.routes = {
        root: "/",
        account_url: "/account",
        account_login_url: "/account/login",
        account_logout_url: "/account/logout",
        account_recover_url: "/account/recover",
        account_register_url: "/account/register",
        account_addresses_url: "/account/addresses",
        collections_url: "/collections",
        all_products_collection_url: "/collections/all",
        search_url: "/search",
        cart_url: "/cart",
        cart_add_url: "/cart/add",
        cart_change_url: "/cart/change",
        cart_clear_url: "/cart/clear",
        product_recommendations_url: "/recommendations/products"
    };

    // Shopify cart object empreinte
    window.Shopify.cart = {
        item_count: 0,
        items: [],
        total_price: 0,
        currency: "USD",
        note: null,
        attributes: {},
        original_total_price: 0,
        total_discount: 0,
        total_weight: 0,
        requires_shipping: true
    };

    // Shopify money format
    window.Shopify.formatMoney = function(cents, format) {
        if (typeof cents === 'string') {
            cents = cents.replace('.', '');
        }
        var value = '';
        var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
        var formatString = format || window.Shopify.theme.settings.currency_format;

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = precision || 2;
            thousands = thousands || ',';
            decimal = decimal || '.';

            if (isNaN(number) || number == null) {
                return '0';
            }

            number = (number / 100.0).toFixed(precision);

            var parts = number.split('.');
            var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
            var cents = parts[1] ? (decimal + parts[1]) : '';

            return dollars + cents;
        }

        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
        }

        return formatString.replace(placeholderRegex, value);
    };

    // Shopify Product object constructor
    window.Shopify.Product = function(product) {
        this.id = product.id || null;
        this.title = product.title || '';
        this.handle = product.handle || '';
        this.description = product.description || '';
        this.price = product.price || 0;
        this.compare_at_price = product.compare_at_price || null;
        this.available = product.available !== false;
        this.tags = product.tags || [];
        this.variants = product.variants || [];
        this.images = product.images || [];
        this.featured_image = product.featured_image || null;
    };

    // Shopify OptionSelectors empreinte
    window.Shopify.OptionSelectors = function(element, options) {
        this.element = element;
        this.options = options || {};
        this.product = this.options.product || {};
        this.onVariantSelected = this.options.onVariantSelected || function() {};
    };

    // Shopify addItem empreinte (simulated)
    window.Shopify.addItem = function(variantId, quantity, callback) {
        console.log('[Shopify] Add to cart:', { variantId, quantity });
        
        // Simulate async operation
        setTimeout(function() {
            window.Shopify.cart.item_count += quantity || 1;
            updateCartCount();
            
            if (typeof callback === 'function') {
                callback({
                    success: true,
                    message: 'Item added to cart'
                });
            }
        }, 300);
    };

    // Shopify updateCart empreinte
    window.Shopify.updateCart = function(updates, callback) {
        console.log('[Shopify] Update cart:', updates);
        
        if (typeof callback === 'function') {
            callback(window.Shopify.cart);
        }
    };

    // Shopify clearCart empreinte
    window.Shopify.clearCart = function(callback) {
        console.log('[Shopify] Clear cart');
        window.Shopify.cart.item_count = 0;
        window.Shopify.cart.items = [];
        updateCartCount();
        
        if (typeof callback === 'function') {
            callback(window.Shopify.cart);
        }
    };

    // Shopify analytics empreinte
    window._st = window._st || {};
    window._st.shop = "protools-store-2024.myshopify.com";
    window._st.themeId = 123456789;
    window._st.cart = window.Shopify.cart;

})();

// ============================================
// DOM Content Loaded - Main App Initialization
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Shopify theme
    initShopifyTheme();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize product filters
    initProductFilters();
    
    // Initialize cart functionality
    initCart();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize product card interactions
    initProductCards();
    
    console.log('[Shopify Theme] ProTools v4.5.2 initialized');
});

// ============================================
// Shopify Theme Initialization
// ============================================
function initShopifyTheme() {
    // Log theme load event
    if (window.Shopify && window.Shopify.theme) {
        console.log('[Shopify] Theme loaded:', window.Shopify.theme.name, 'v' + window.Shopify.theme.version);
        console.log('[Shopify] Shop:', window.Shopify.shop);
        
        // Trigger Shopify theme load event
        document.dispatchEvent(new CustomEvent('shopify:theme:loaded', {
            detail: {
                theme: window.Shopify.theme,
                shop: window.Shopify.shop
            }
        }));
    }
}

// ============================================
// Navigation Functionality
// ============================================
function initNavigation() {
    const navToggle = document.querySelector('.navbar__toggle');
    const navMenu = document.querySelector('.navbar__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            console.log('[Navigation] Menu toggled');
        });
    }
    
    // Close menu on link click
    const navLinks = document.querySelectorAll('.navbar__menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
}

// ============================================
// Product Filters
// ============================================
function initProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
            
            console.log('[Shopify] Products filtered by:', category);
            
            // Trigger Shopify collection filter event
            document.dispatchEvent(new CustomEvent('shopify:collection:filtered', {
                detail: { category: category }
            }));
        });
    });
}

// ============================================
// Cart Functionality - Shopify Style
// ============================================
function initCart() {
    const cartTrigger = document.querySelector('[data-cart-trigger]');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartClose = document.querySelector('.cart-drawer__close');
    const addToCartButtons = document.querySelectorAll('[data-shopify-add-to-cart]');
    
    // Open cart drawer
    if (cartTrigger && cartDrawer) {
        cartTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            cartDrawer.classList.add('active');
            console.log('[Shopify Cart] Drawer opened');
            
            // Trigger Shopify cart open event
            document.dispatchEvent(new CustomEvent('shopify:cart:open'));
        });
    }
    
    // Close cart drawer
    if (cartClose && cartDrawer) {
        cartClose.addEventListener('click', function() {
            cartDrawer.classList.remove('active');
            console.log('[Shopify Cart] Drawer closed');
            
            // Trigger Shopify cart close event
            document.dispatchEvent(new CustomEvent('shopify:cart:close'));
        });
    }
    
    // Add to cart functionality (disabled for demo)
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = this.getAttribute('data-product-id');
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-card__title').textContent;
            const productPrice = productCard.querySelector('[data-product-price]').getAttribute('data-product-price');
            
            console.log('[Shopify] Add to cart attempt:', {
                id: productId,
                title: productTitle,
                price: productPrice
            });
            
            // Show disabled message
            showNotification('Add to cart functionality is disabled in demo mode', 'info');
            
            // Simulate Shopify add to cart (commented out for demo)
            // window.Shopify.addItem(productId, 1, function(response) {
            //     if (response.success) {
            //         showNotification('Product added to cart!', 'success');
            //         cartDrawer.classList.add('active');
            //     }
            // });
            
            // Trigger Shopify add to cart event
            document.dispatchEvent(new CustomEvent('shopify:cart:item:add', {
                detail: {
                    productId: productId,
                    title: productTitle,
                    price: productPrice
                }
            }));
        });
    });
}

// ============================================
// Update Cart Count
// ============================================
function updateCartCount() {
    const cartCountElement = document.querySelector('[data-cart-count]');
    
    if (cartCountElement && window.Shopify && window.Shopify.cart) {
        cartCountElement.textContent = window.Shopify.cart.item_count;
        
        // Animate count
        cartCountElement.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 200);
        
        console.log('[Shopify Cart] Item count updated:', window.Shopify.cart.item_count);
    }
}

// ============================================
// Product Cards Interaction
// ============================================
function initProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Log product view for analytics
        const productId = card.getAttribute('data-product-id');
        
        card.addEventListener('mouseenter', function() {
            console.log('[Shopify Analytics] Product viewed:', productId);
            
            // Trigger Shopify product view event
            document.dispatchEvent(new CustomEvent('shopify:product:view', {
                detail: {
                    productId: productId
                }
            }));
        });
    });
}

// ============================================
// Smooth Scrolling
// ============================================
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    console.log('[Notification]', type, ':', message);
}

// ============================================
// Shopify Product Recommendations Empreinte
// ============================================
window.Shopify.getProductRecommendations = function(productId, callback) {
    console.log('[Shopify] Get product recommendations for:', productId);
    
    // Simulate recommendations
    const mockRecommendations = [
        { id: '7854123698765', title: 'Related Tool 1' },
        { id: '7854123698766', title: 'Related Tool 2' },
        { id: '7854123698767', title: 'Related Tool 3' }
    ];
    
    if (typeof callback === 'function') {
        callback(mockRecommendations);
    }
};

// ============================================
// Shopify Variant Selection Empreinte
// ============================================
window.Shopify.selectVariant = function(variantId, productId) {
    console.log('[Shopify] Variant selected:', {
        variantId: variantId,
        productId: productId
    });
    
    // Trigger Shopify variant change event
    document.dispatchEvent(new CustomEvent('shopify:variant:change', {
        detail: {
            variantId: variantId,
            productId: productId
        }
    }));
};

// ============================================
// Shopify Search Functionality Empreinte
// ============================================
function initShopifySearch() {
    const searchButton = document.querySelector('.navbar__search');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            console.log('[Shopify Search] Search triggered');
            showNotification('Search functionality is disabled in demo mode', 'info');
            
            // Trigger Shopify search event
            document.dispatchEvent(new CustomEvent('shopify:search:open'));
        });
    }
}

// Initialize search on load
document.addEventListener('DOMContentLoaded', initShopifySearch);

// ============================================
// Animation keyframes (injected via JavaScript)
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Shopify Analytics Events Tracking
// ============================================
document.addEventListener('shopify:cart:item:add', function(e) {
    console.log('[Analytics] Product added to cart:', e.detail);
});

document.addEventListener('shopify:product:view', function(e) {
    console.log('[Analytics] Product viewed:', e.detail);
});

document.addEventListener('shopify:collection:filtered', function(e) {
    console.log('[Analytics] Collection filtered:', e.detail);
});

// ============================================
// Shopify Checkout Button Empreinte
// ============================================
const checkoutButton = document.querySelector('[data-shopify-checkout-button]');
if (checkoutButton) {
    checkoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('[Shopify] Checkout initiated');
        showNotification('Checkout functionality is disabled in demo mode', 'info');
        
        // Trigger Shopify checkout event
        document.dispatchEvent(new CustomEvent('shopify:checkout:start'));
    });
}

console.log('[Shopify Theme] JavaScript loaded successfully');
console.log('[Shopify] Shop:', window.Shopify?.shop);
console.log('[Shopify] Theme version:', window.Shopify?.theme?.version);