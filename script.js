function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[1]) : null;
}

function getSolarTheme() {
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
}

function getStoredMode() {
    const cookieMode = getCookie('theme-mode');
    if (cookieMode === 'light' || cookieMode === 'dark' || cookieMode === 'system') {
        return cookieMode;
    }
    const localMode = localStorage.getItem('theme-mode');
    if (localMode === 'light' || localMode === 'dark' || localMode === 'system') {
        return localMode;
    }
    return 'light';
}

function resolveTheme(mode) {
    if (mode === 'system') {
        return getSolarTheme();
    }
    return mode;
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

function updateToggleUI(mode, effectiveTheme, animate) {
    const label = document.querySelector('.theme-toggle-label');
    const button = document.querySelector('.theme-toggle');
    if (label) {
        if (animate) {
            label.style.opacity = '0';
            label.style.transform = 'translateY(1px)';
            setTimeout(() => {
                label.textContent = mode;
                label.style.opacity = '1';
                label.style.transform = 'translateY(0)';
            }, 80);
        } else {
            label.textContent = mode;
            label.style.opacity = '1';
            label.style.transform = 'translateY(0)';
        }
    }
    if (button) {
        button.setAttribute('aria-label', `Theme mode: ${mode} (currently ${effectiveTheme})`);
    }
}

function applyMode(mode, animate) {
    const effectiveTheme = resolveTheme(mode);
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.documentElement.setAttribute('data-theme-mode', mode);
    setCookie('theme-mode', mode, 365);
    localStorage.setItem('theme-mode', mode);
    updateSelectionStyles(effectiveTheme);
    updateToggleUI(mode, effectiveTheme, animate);
}

const initialMode = getStoredMode();
const initialTheme = resolveTheme(initialMode);
document.documentElement.setAttribute('data-theme', initialTheme);
document.documentElement.setAttribute('data-theme-mode', initialMode);
updateSelectionStyles(initialTheme);

function init() {
    const currentMode = getStoredMode();
    applyMode(currentMode, false);

    const button = document.querySelector('.theme-toggle');
    button?.addEventListener('click', () => {
        const activeMode = getStoredMode();
        const nextMode = activeMode === 'light' ? 'dark' : (activeMode === 'dark' ? 'system' : 'light');
        applyMode(nextMode, true);
    });

    setInterval(() => {
        if (getStoredMode() === 'system') {
            applyMode('system', false);
        }
    }, 60000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
