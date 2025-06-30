
// This script hides the preloader once the page has fully loaded

window.addEventListener('load', () => {
    const loader = document.getElementById('preloader');
    if (loader) loader.classList.add('hidden');
});
