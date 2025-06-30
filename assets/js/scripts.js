// script.js

// toggle dark mode
document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("themeToggle");

    const setDarkMode = (isDark) => {
    if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
        toggleButton.innerHTML = "<i class='bx bx-sun' aria-hidden='true'></i>";
        toggleButton.setAttribute("aria-pressed", "true");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
        toggleButton.innerHTML = "<i class='bx bx-moon' aria-hidden='true'></i>";
        toggleButton.setAttribute("aria-pressed", "false");
        localStorage.setItem("theme", "light");
    }
    };

    // Initialize button state
    const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";
    setDarkMode(isDark);

    // Toggle on click
    toggleButton.addEventListener("click", () => {
    const currentlyDark =
        document.documentElement.getAttribute("data-theme") === "dark";
    setDarkMode(!currentlyDark);
    });
});


// This script hides the preloader once the page has fully loaded
window.addEventListener('load', () => {
    const loader = document.getElementById('preloader');
    if (loader) loader.classList.add('hidden');
});