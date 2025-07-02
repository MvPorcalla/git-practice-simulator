// state.js

let historyIndex = -1;

let remoteLinked = false;

export function isRemoteLinked() {
    return remoteLinked;
}

export function setRemoteLinked(value) {
    remoteLinked = value;
}


export function getHistoryIndex() {
    return historyIndex;
}

export function setHistoryIndex(index) {
    historyIndex = index;
}

// ✅ Command history
export let commandHistory = [];

// ✅ Git initialization state
let gitInitialized = false;

export function isGitInitialized() {
    return gitInitialized;
}

export function setGitInitialized(value) {
    gitInitialized = value;
}

// ✅ Working directory and staging area
export let workingDirectory = [
    { name: 'index.html', status: 'new' },
    { name: 'style.css', status: 'new' },
    { name: 'script.js', status: 'new' },
    { name: 'README.md', status: 'new' }
];

export let stagingArea = [];

export function updateFileStatus(fileName, status) {
    const file = workingDirectory.find(f => f.name === fileName);
    if (file) file.status = status;
}

export function getFileStatus(fileName) {
    const file = workingDirectory.find(f => f.name === fileName);
    return file ? file.status : null;
}

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

// ✅ Commit tracking state
let localCommits = [];
let remoteCommits = [];

export function addLocalCommit(commitMessage) {
    localCommits.push(commitMessage);
}

export function pushCommits() {
    remoteCommits.push(...localCommits);
    localCommits = [];
}

export { localCommits, remoteCommits };

// ✅ Last commit message
let lastCommitMessage = '';

export function setLastCommitMessage(message) {
    lastCommitMessage = message;
}

export function getLastCommitMessage() {
    return lastCommitMessage;
}
