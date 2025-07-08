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

let currentBranch = 'main';  // default local branch

// Track upstream for each local branch as an object: { [branchName]: { remote: string, remoteBranch: string } }
const branchUpstreams = {
  main: null, // e.g. { remote: 'origin', remoteBranch: 'main' }
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

export let remotes = {}; // key: remote name, value: url

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
// export let workingDirectory = [
//     { name: 'index.html', status: 'new' },
//     { name: 'style.css', status: 'new' },
//     { name: 'script.js', status: 'new' },
//     { name: 'README.md', status: 'new' }
// ];

export let workingDirectory = [
    { name: 'index.html', status: 'new' },

];

export function addFileToWorkingDir(name) {
  if (!workingDirectory.some(file => file.name === name)) {
    workingDirectory.push({ name, status: 'new' });
    return true;
  }
  return false; // File already exists
}

export function fileExists(name) {
  return workingDirectory.some(f => f.name === name);
}


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
