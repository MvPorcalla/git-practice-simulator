// state.js

// Git initialization state
let gitInitialized = false;

export function isGitInitialized() {
    return gitInitialized;
}

export function setGitInitialized(value) {
    gitInitialized = value;
}

// Working directory and staging area
export let workingDirectory = [
    { name: 'index.html', status: 'new' },
    { name: 'style.css', status: 'new' },
    { name: 'README.md', status: 'new' }
];

export let stagingArea = [];

// Command history (for terminal navigation)
export let commandHistory = [];
export let historyIndex = -1;

export function updateFileStatus(fileName, status) {
    const file = workingDirectory.find(f => f.name === fileName);
    if (file) file.status = status;
}

export function getFileStatus(fileName) {
    const file = workingDirectory.find(f => f.name === fileName);
    return file ? file.status : null;
}

// Git file management
export function resetStagingArea() {
    stagingArea = [];
}

export function addToStaging(fileObject) {
    stagingArea.push(fileObject);
}

export function isFileInWorkingDir(file) {
    return workingDirectory.includes(file);
}

export function isFileInStaging(fileName) {
    return stagingArea.some(f => f.name === fileName);
}

// ✅ Commit Tracking State
let localCommits = [];     // Commits staged locally
let remoteCommits = [];    // Commits pushed to remote

export function addLocalCommit(commitMessage) {
    localCommits.push(commitMessage);
}

export function pushCommits() {
    remoteCommits.push(...localCommits);  // Move all local commits to remote
    localCommits = [];                    // Clear local commits after push
}

export { localCommits, remoteCommits };

// ✅ Last Commit Message State (Fix)
let lastCommitMessage = '';

export function setLastCommitMessage(message) {
    lastCommitMessage = message;
}

export function getLastCommitMessage() {
    return lastCommitMessage;
}
