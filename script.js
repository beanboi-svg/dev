function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateSelectionStyles(theme) {
    let styleTag = document.getElementById('selection-theme');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'selection-theme';
        document.head.appendChild(styleTag);
    }

    if (theme === 'dark') {
        styleTag.textContent = `
            ::selection {
                background-color: rgba(96, 67, 51, 0.99) !important;
                color: #F0F0EA !important;
            }
            *::selection {
                background-color: rgba(96, 67, 51, 0.99) !important;
                color: #F0F0EA !important;
            }
        `;
    } else {
        styleTag.textContent = `
            ::selection {
                background-color: #F0DCCB !important;
                color: #252620 !important;
            }
            *::selection {
                background-color: #F0DCCB !important;
                color: #252620 !important;
            }
        `;
    }
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateSelectionStyles(theme);
}

applyTheme(getInitialTheme());

function setupToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || getInitialTheme();
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToggle);
} else {
    setupToggle();
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});
