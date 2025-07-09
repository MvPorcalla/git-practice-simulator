// utils.js

// ==============================
// 🧰 Utility Functions
// ==============================

// Escape special HTML characters to prevent XSS
export function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag]));
}

// Validate GitHub repository URL format
export function isValidGitUrl(url) {
    const gitUrlPattern = /^(https:\/\/|git@)github\.com[\/:](.+)\.git$/;
    return gitUrlPattern.test(url);
}
