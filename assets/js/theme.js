// theme.js

document.addEventListener('DOMContentLoaded', () => {

    // ==============================
    // ⏳ PRELOADER FUNCTIONALITY
    // ==============================
    const loader = document.getElementById('preloader');
    if (loader) loader.classList.add('hidden');

    // ==============================
    // 🌙🌞 THEME TOGGLE FUNCTIONALITY
    // ==============================

    const toggleButton = document.getElementById('themeToggle');
    const isDark = localStorage.getItem('theme') === 'dark';

    // Apply dark or light mode based on state
    const setDarkMode = (isDark) => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggleButton.innerHTML = "<i class='bx bx-sun' aria-hidden='true'></i>";
            toggleButton.setAttribute('aria-pressed', 'true');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            toggleButton.innerHTML = "<i class='bx bx-moon' aria-hidden='true'></i>";
            toggleButton.setAttribute('aria-pressed', 'false');
            localStorage.setItem('theme', 'light');
        }
    };

    // 🔄 Set initial theme on load
    setDarkMode(isDark);

    // 🔘 Toggle theme on button click
    toggleButton.addEventListener('click', () => {
        const currentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setDarkMode(!currentlyDark);
    });

});
