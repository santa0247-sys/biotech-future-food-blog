/* ============================================
   BIOTECH & FUTURE FOOD BLOG - JAVASCRIPT
   ============================================ */

// ===== Dark Mode Toggle =====
class ThemeManager {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') === 'true';
        this.init();
    }

    init() {
        this.applyTheme();
        this.createThemeToggle();
        this.attachEventListeners();
    }

    applyTheme() {
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    createThemeToggle() {
        // Check if toggle already exists
        if (document.querySelector('.theme-toggle')) return;

        const nav = document.querySelector('nav');
        if (!nav) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.innerHTML = this.isDarkMode ? '☀️' : '🌙';
        toggleBtn.title = this.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        
        nav.parentElement.insertBefore(toggleBtn, nav.nextSibling);
        this.toggleBtn = toggleBtn;
    }

    attachEventListeners() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Auto-detect system preference on first load
        if (!localStorage.getItem('darkMode')) {
            this.detectSystemPreference();
        }
    }

    toggle() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('darkMode', this.isDarkMode);
        this.applyTheme();
        this.updateToggleButton();
    }

    updateToggleButton() {
        if (this.toggleBtn) {
            this.toggleBtn.innerHTML = this.isDarkMode ? '☀️' : '🌙';
            this.toggleBtn.title = this.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        }
    }

    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDarkMode = true;
            this.applyTheme();
            this.updateToggleButton();
        }
    }
}

// ===== Smooth Scroll Navigation =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleScroll(e, link));
        });
    }

    handleScroll(e, link) {
        const href = link.getAttribute('href');
        
        // Only handle valid anchor links
        if (href === '#' || href === '') return;

        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// ===== Newsletter Form Handler =====
class NewsletterHandler {
    constructor() {
        this.init();
    }

    init() {
        const forms = document.querySelectorAll('.newsletter-form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        });
    }

    handleSubmit(e, form) {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (!this.isValidEmail(email)) {
            this.showMessage('โปรดใส่อีเมลที่ถูกต้อง', 'error', form);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.showMessage('ขอบคุณที่สมัครสมาชิก! 🎉', 'success', form);
            emailInput.value = '';
        }, 300);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type, form) {
        // Remove existing message
        const existingMsg = form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = `form-message form-message-${type}`;
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            padding: 0.75rem 1rem;
            margin-top: 0.5rem;
            border-radius: 0.5rem;
            font-size: 0.9rem;
            font-weight: 600;
            animation: fadeInUp 0.3s ease-out;
            ${type === 'success' 
                ? 'background: rgba(0, 208, 132, 0.2); color: #00d084; border: 1px solid #00d084;'
                : 'background: rgba(255, 107, 53, 0.2); color: #ff6b35; border: 1px solid #ff6b35;'
            }
        `;

        form.appendChild(msgDiv);

        // Auto-remove after 4 seconds
        setTimeout(() => msgDiv.remove(), 4000);
    }
}

// ===== Lazy Loading for Images =====
class LazyLoadImages {
    constructor() {
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.createObserver();
        } else {
            this.loadAllImages();
        }
    }

    createObserver() {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.onload = () => {
                        img.style.transition = 'opacity 0.3s ease-out';
                        img.style.opacity = '1';
                    };
                    obs.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        document.querySelectorAll('img').forEach(img => observer.observe(img));
    }

    loadAllImages() {
        document.querySelectorAll('img').forEach(img => {
            img.style.opacity = '1';
        });
    }
}

// ===== Article Read Time Calculator =====
class ReadTimeCalculator {
    constructor() {
        this.init();
    }

    init() {
        this.calculateAllArticles();
    }

    calculateAllArticles() {
        document.querySelectorAll('article.blog-article').forEach((article, index) => {
            const textContent = article.querySelector('.article-content p');
            if (textContent) {
                const readTime = this.calculateReadTime(textContent.textContent);
                this.displayReadTime(article, readTime);
            }
        });
    }

    calculateReadTime(text) {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return Math.max(1, minutes);
    }

    displayReadTime(article, minutes) {
        const meta = article.querySelector('.article-meta');
        if (meta) {
            const readTimeSpan = document.createElement('span');
            readTimeSpan.innerHTML = ` | ⏱️ ${minutes} นาที`;
            readTimeSpan.style.marginLeft = '0.5rem';
            meta.appendChild(readTimeSpan);
        }
    }
}

// ===== Search/Filter Functionality =====
class ArticleSearch {
    constructor() {
        this.articles = [];
        this.init();
    }

    init() {
        this.gatherArticles();
        this.createSearchBox();
        this.attachEventListeners();
    }

    gatherArticles() {
        this.articles = Array.from(document.querySelectorAll('article.blog-article')).map(article => ({
            element: article,
            title: article.querySelector('h2')?.textContent.toLowerCase() || '',
            content: article.querySelector('p')?.textContent.toLowerCase() || '',
        }));
    }

    createSearchBox() {
        const articlesSection = document.querySelector('.articles-section');
        if (!articlesSection) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.cssText = `
            margin-bottom: 2rem;
            display: flex;
            gap: 0.5rem;
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'ค้นหาบทความ...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            flex: 1;
            padding: 0.75rem 1rem;
            border: 2px solid var(--primary-color);
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: var(--bg-secondary);
            color: var(--text-primary);
        `;

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'ล้าง';
        clearBtn.className = 'search-clear';
        clearBtn.style.cssText = `
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, var(--secondary-color), var(--secondary-dark));
            color: white;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;

        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(clearBtn);
        articlesSection.insertBefore(searchContainer, articlesSection.firstChild);

        searchInput.addEventListener('input', (e) => this.filterArticles(e.target.value));
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            this.showAllArticles();
        });
    }

    filterArticles(query) {
        const lowerQuery = query.toLowerCase();

        this.articles.forEach(article => {
            const matches = article.title.includes(lowerQuery) || article.content.includes(lowerQuery);
            article.element.style.display = matches ? 'grid' : 'none';
            if (matches) {
                article.element.style.animation = 'fadeInUp 0.3s ease-out';
            }
        });

        const visibleArticles = this.articles.filter(a => a.element.style.display !== 'none').length;
        if (visibleArticles === 0 && query) {
            this.showNoResults();
        } else {
            this.removeNoResults();
        }
    }

    showAllArticles() {
        this.articles.forEach(article => {
            article.element.style.display = 'grid';
        });
        this.removeNoResults();
    }

    showNoResults() {
        this.removeNoResults();
        const articlesSection = document.querySelector('.articles-section');
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.style.cssText = `
            text-align: center;
            padding: 2rem;
            color: var(--text-tertiary);
            font-size: 1.1rem;
        `;
        noResults.innerHTML = '😕 ไม่พบบทความที่ตรงกับการค้นหา';
        articlesSection.appendChild(noResults);
    }

    removeNoResults() {
        const noResults = document.querySelector('.no-results');
        if (noResults) noResults.remove();
    }
}

// ===== Tag Click Handler =====
class TagClickHandler {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', (e) => this.handleTagClick(e, tag));
        });
    }

    handleTagClick(e, tag) {
        e.preventDefault();
        const tagText = tag.textContent.trim();
        const searchInput = document.querySelector('.search-input');
        
        if (searchInput) {
            searchInput.value = tagText;
            searchInput.dispatchEvent(new Event('input'));
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// ===== Scroll to Top Button =====
class ScrollToTop {
    constructor() {
        this.init();
    }

    init() {
        this.createButton();
        window.addEventListener('scroll', () => this.toggleButton());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    createButton() {
        const button = document.createElement('button');
        button.className = 'scroll-to-top';
        button.innerHTML = '↑';
        button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.5rem;
            display: none;
            z-index: 999;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-md);
        `;

        document.body.appendChild(button);
        this.button = button;

        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });
    }

    toggleButton() {
        if (window.scrollY > 300) {
            this.button.style.display = 'flex';
            this.button.style.alignItems = 'center';
            this.button.style.justifyContent = 'center';
        } else {
            this.button.style.display = 'none';
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// ===== Performance Optimization: Debounce =====
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// ===== Initialize All Features =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧬 BioFuture Food Blog - Initializing...');

    // Initialize all features
    new ThemeManager();
    new SmoothScroll();
    new NewsletterHandler();
    new LazyLoadImages();
    new ReadTimeCalculator();
    new ArticleSearch();
    new TagClickHandler();
    new ScrollToTop();

    console.log('✅ All features loaded successfully!');
});

// ===== Dynamic Placeholder Images (Fallback) =====
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="300"%3E%3Crect fill="%23ddd" width="600" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="20"%3EImage Not Available%3C/text%3E%3C/svg%3E';
    }
}, true);

// ===== Add Meta Tags for SEO =====
if (document.querySelector('head')) {
    const head = document.querySelector('head');
    
    // Check if meta tags already exist
    if (!head.querySelector('meta[name="description"]')) {
        const descriptions = [
            { name: 'description', content: 'บล็อกบทความเทคโนโลยีชีวภาพและนวัตกรรมอาหารแห่งอนาคต' },
            { name: 'keywords', content: 'biotech, future food, CRISPR, cultured meat, vertical farming, นวัตกรรม, อาหาร' },
            { name: 'author', content: 'BioFuture Food Blog' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
        ];

        descriptions.forEach(meta => {
            const metaTag = document.createElement('meta');
            metaTag.name = meta.name;
            metaTag.content = meta.content;
            head.appendChild(metaTag);
        });
    }
}

// ===== Analytics Event Tracking (Optional) =====
class AnalyticsTracker {
    constructor() {
        this.init();
    }

    init() {
        // Track article views
        document.querySelectorAll('.blog-article').forEach((article, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.trackEvent('article_view', {
                            article_index: index,
                            title: article.querySelector('h2')?.textContent
                        });
                        observer.unobserve(article);
                    }
                });
            });
            observer.observe(article);
        });

        // Track button clicks
        document.querySelectorAll('.read-more, .subscribe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.trackEvent('button_click', {
                    button_text: btn.textContent,
                    button_class: btn.className
                });
            });
        });
    }

    trackEvent(eventName, eventData) {
        console.log(`📊 Event: ${eventName}`, eventData);
        // Here you would send data to your analytics service
        // e.g., Google Analytics, Mixpanel, etc.
    }
}

// Initialize analytics
new AnalyticsTracker();