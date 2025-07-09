// state.js

let gitInitialized = false;

export function isGitInitialized() {
    return gitInitialized;
}

export function setGitInitialized(value) {
    gitInitialized = value;
}

// ==============================
// 📂 WORKING DIRECTORY STATE
// ==============================
export let workingDirectory = [
    { name: 'index.html', status: 'new' }
];

export function addFileToWorkingDir(name) {
    if (!workingDirectory.some(file => file.name === name)) {
        workingDirectory.push({ name, status: 'new' });
        return true;
    }
    return false;
}

export function fileExists(name) {
    return workingDirectory.some(f => f.name === name);
}

export function updateFileStatus(fileName, status) {
    const file = workingDirectory.find(f => f.name === fileName);
    if (file) file.status = status;
}

export function getFileStatus(fileName) {
    const file = workingDirectory.find(f => f.name === fileName);
    return file ? file.status : null;
}

export function isFileInWorkingDir(file) {
    return workingDirectory.includes(file);
}

// ==============================
// 📥 STAGING AREA STATE
// ==============================
export let stagingArea = [];

export function resetStagingArea() {
    stagingArea = [];
}

export function addToStaging(fileObject) {
    stagingArea.push(fileObject);
}

export function isFileInStaging(fileName) {
    return stagingArea.some(f => f.name === fileName);
}

// ==============================
// 📝 COMMIT TRACKING STATE
// ==============================
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

// ==============================
// 🌐 REMOTE MANAGEMENT
// ==============================
export let remotes = {}; // key: remote name, value: URL
let remoteLinked = false;

export function addRemote(name, url) {
    remotes[name] = url;
}

export function getRemote(name) {
    return remotes[name] || null;
}

export function hasRemote(name) {
    return remotes.hasOwnProperty(name);
}

export function getRemoteUrl(name) {
    return remotes[name] || null;
}

export function getRemotes() {
    return remotes;
}

export function isRemoteLinked() {
    return remoteLinked;
}

export function setRemoteLinked(value) {
    remoteLinked = value;
}

// ==============================
// 🌿 BRANCH & UPSTREAM TRACKING
// ==============================
let currentBranch = 'main';  // Default local branch

const branchUpstreams = {
    main: null // Format: { remote: string, remoteBranch: string }
};

export function getCurrentBranch() {
    return currentBranch;
}

export function setCurrentBranch(branchName) {
    currentBranch = branchName;

    if (!(branchName in branchUpstreams)) {
        branchUpstreams[branchName] = null;
    }
}

export function getUpstreamForBranch(branchName) {
    return branchUpstreams[branchName] || null;
}

export function setUpstreamForBranch(branchName, remoteName, remoteBranch) {
    branchUpstreams[branchName] = { remote: remoteName, remoteBranch };
}

// ==============================
// ⌨️ COMMAND HISTORY STATE
// ==============================
let historyIndex = -1;
export let commandHistory = [];

export function getHistoryIndex() {
    return historyIndex;
}

export function setHistoryIndex(index) {
    historyIndex = index;
}

// ==============================
// 🏷️ LAST COMMIT MESSAGE
// ==============================
let lastCommitMessage = '';

export function setLastCommitMessage(message) {
    lastCommitMessage = message;
}

export function getLastCommitMessage() {
    return lastCommitMessage;
}