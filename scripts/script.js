document.addEventListener('DOMContentLoaded', () => {
    // Current Time & Date Logic
    const updateDateTime = () => {
        const now = new Date();
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        if (timeElement) {
            timeElement.textContent = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                hour12: false 
            });
        }
        
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('en-US', { 
                month: 'short', 
                day: '2-digit', 
                year: 'numeric' 
            });
        }
    };
    
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Theme Logic
    const themeBtn = document.getElementById('theme-toggle-btn');
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') root.classList.add('light-theme');
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            root.classList.toggle('light-theme');
            localStorage.setItem('theme', root.classList.contains('light-theme') ? 'light' : 'dark');
        });
    }

    // Language Logic
    const updateLanguage = (lang) => {
        if (!window.translations || !window.translations[lang]) return;
        
        // Custom Smooth Fade Transition
        const textElements = document.querySelectorAll('[data-i18n]');
        textElements.forEach(el => el.style.opacity = '0');
        
        setTimeout(() => {
            textElements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (window.translations[lang][key]) el.innerText = window.translations[lang][key];
                el.style.transition = 'opacity 0.4s ease';
                el.style.opacity = '1';
            });
        }, 150);

        document.querySelectorAll('.lang-tab').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        localStorage.setItem('lang', lang);
    };

    document.querySelectorAll('.lang-tab').forEach(btn => {
        btn.addEventListener('click', () => updateLanguage(btn.getAttribute('data-lang')));
    });

    const savedLang = localStorage.getItem('lang') || 'pt';
    updateLanguage(savedLang);
});
