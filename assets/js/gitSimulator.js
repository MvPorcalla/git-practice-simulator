// gitSimulator.js
import * as state from './state.js';
import * as messages from './gitMessages.js';
import { updateStagingAreaUI, updateWorkingDirectoryUI, updateRemoteUI, updateRemotePathsUI, logMessage } from './ui.js';
import { ERROR_MESSAGES, LOG_TYPES, SYSTEM_MESSAGES, GITHUB_URL } from './gitConstants.js';
import { gitPushMessage } from './gitMessages.js';
import { escapeHTML, isValidGitUrl } from './utils.js';

import { workingDirectory, addFileToWorkingDir, fileExists } from './state.js';

// Dispatcher map (command -> function)
const gitCommands = {
    init: handleGitInit,
    status: getGitStatus,
    add: handleGitAddWrapper,
    commit: handleGitCommitWrapper,
    push: handleGitPush,
    restore: handleGitRestoreWrapper,
    remote: handleGitRemoteWrapper
};

function listRemotes() {
    const remotes = state.getRemotes();
    const remoteNames = Object.keys(remotes);

    if (remoteNames.length === 0) {
        return 'No remotes configured.';
    }

    let output = '';

    remoteNames.forEach(name => {
        output += `${name}\t${remotes[name]} (fetch)\n`;
        output += `${name}\t${remotes[name]} (push)\n`;
    });

    return output.trim();
}

// ✅ Error logging helper
function returnError(message) {
    logMessage(`[Error] ${message}`, LOG_TYPES.ERROR);
    return message;
}
function logSystem(message) {
    logMessage(`[System] ${message}`, LOG_TYPES.INFO);
}

function validateCommand(args) {
    if (args[0] !== 'git') {
        return returnError(ERROR_MESSAGES.INVALID_COMMAND(escapeHTML(args[0])));
    }

    if (!args[1]) {
        return returnError(ERROR_MESSAGES.NO_SUBCOMMAND);
    }

    if (!gitCommands[args[1]]) {
        return returnError(ERROR_MESSAGES.INVALID_GIT_COMMAND(escapeHTML(args[1])));
    }

    return null; // Means valid
}

export async function processGitCommand(command) {
    const args = command.trim().split(/\s+/);

    logMessage(`[Command] ${escapeHTML(command)}`, LOG_TYPES.COMMAND);

    if (command.trim() === '') {
        return returnError(ERROR_MESSAGES.NO_COMMAND);
    }

    const validationError = validateCommand(args);
    if (validationError) return validationError;

    if (args[1] === 'init') {
        return handleGitInit();
    }

    if (!state.isGitInitialized()) {
        return returnError(ERROR_MESSAGES.NOT_A_REPO);
    }

    if (args[1] === 'push') {
        return await handleGitPush(args);
    }


    return gitCommands[args[1]](args);
}

function handleGitInit() {
    if (state.isGitInitialized()) {
        logSystem(SYSTEM_MESSAGES.REPO_REINITIALIZED);
        return 'Reinitialized existing Git repository.';
    } else {
        state.setGitInitialized(true);
        updateWorkingDirectoryUI(state.workingDirectory, true);
        logSystem(SYSTEM_MESSAGES.REPO_INITIALIZED);
        return messages.gitInitMessage();
    }
}

function handleGitAddWrapper(args) {
    if (!args[2]) {
        return returnError(ERROR_MESSAGES.NOTHING_SPECIFIED);
    }

    if (args[2] === '.') {
        const allFileNames = state.workingDirectory.map(file => file.name);
        return handleGitAdd(allFileNames);
    } else {
        return handleGitAdd(args.slice(2));
    }
}

function handleGitRemoteWrapper(args) {
    if (!args[2]) {
        return 'git remote: missing subcommand. Try "git remote add <name> <url>"';
    }

    if (args[2] === 'add') {
        if (!args[3] || !args[4]) {
            return 'git remote add: missing name or URL.';
        }

        const remoteName = args[3];
        const remoteUrl = args[4];

        if (!isValidGitUrl(remoteUrl)) {
            return returnError('fatal: remote URL is invalid. Please provide a valid Git repository URL.');
        }

        return handleGitRemoteAdd(remoteName, remoteUrl);
    }

    if (args[2] === 'remove') {
        if (!args[3]) {
            return 'git remote remove: missing name.';
        }

        return handleGitRemoteRemove(args[3]);
    }

    if (args[2] === 'rename') {
        if (!args[3] || !args[4]) {
            return 'git remote rename: missing old or new name.';
        }

        return handleGitRemoteRename(args[3], args[4]);
    }

    if (args[2] === '-v') {
        return listRemotes();
    }

    return `git remote: unknown subcommand ${args[2]}`;
}

function handleGitRemoteAdd(name, url) {
    if (state.hasRemote(name)) {
        return `fatal: remote ${name} already exists.`;
    }

    state.addRemote(name, url);
    updateRemotePathsUI(state.getRemotes());

    logSystem(`Remote '${name}' added with URL ${url}`);
    return `Remote '${name}' added with URL ${url}`;
}

function handleGitRemoteRemove(name) {
    if (!state.hasRemote(name)) {
        return returnError(`fatal: No such remote: '${name}'`);
    }

    delete state.remotes[name];
    updateRemotePathsUI(state.getRemotes());

    logSystem(`Remote '${name}' removed.`);
    return `Remote '${name}' removed.`;
}

function handleGitRemoteRename(oldName, newName) {
    if (!state.hasRemote(oldName)) {
        return returnError(`fatal: No such remote: '${oldName}'`);
    }

    if (state.hasRemote(newName)) {
        return returnError(`fatal: Remote '${newName}' already exists.`);
    }

    state.remotes[newName] = state.remotes[oldName];
    delete state.remotes[oldName];

    updateRemotePathsUI(state.getRemotes());

    logSystem(`Remote '${oldName}' renamed to '${newName}'.`);
    return `Remote '${oldName}' renamed to '${newName}'.`;
}


function handleGitCommitWrapper(args) {
    return handleGitCommit(args.join(' '));
}

function handleGitRestoreWrapper(args) {
    if (args[2] === '--staged') {
        return handleGitRestore(args.slice(3));
    } else {
        return returnError(ERROR_MESSAGES.UNKNOWN_RESTORE_OPTION(escapeHTML(args.slice(2).join(' '))));
    }
}


function getGitStatus() {
    const stagedFiles = state.stagingArea;
    const untrackedFiles = state.workingDirectory.filter(file => !state.isFileInStaging(file.name));
    let status = '';

    if (state.isRemoteLinked()) {
        const remotes = state.getRemotes();
        const remoteNames = Object.keys(remotes);

        if (state.localCommits.length > 0) {
            status += `Your branch is ahead of 'origin/main' by ${state.localCommits.length} commit${state.localCommits.length > 1 ? 's' : ''}.\n  (use "git push" to publish your local commits)\n\n`;
        } else {
            status += `Your branch is up to date with 'origin/main'.\n\n`;
        }

        // ✅ Show all active remotes
        remoteNames.forEach(name => {
            const url = remotes[name];
            status += `Remote ${name}: ${url}\n`;
        });

        status += '\n';
    }

    status += messages.gitStatusWithFiles(stagedFiles, untrackedFiles, state.localCommits.length);

    return status.trim();
}

function handleGitAdd(files) {
    let addedFiles = [];
    let notFoundFiles = [];

    files.forEach(file => {
        const fileObject = state.workingDirectory.find(f => f.name === file);

        if (fileObject && !state.isFileInStaging(fileObject.name)) {
            state.addToStaging(fileObject);
            addedFiles.push(fileObject.name);
        } else if (!fileObject) {
            notFoundFiles.push(file);
        }
    });

    if (notFoundFiles.length > 0) {
        return returnError(ERROR_MESSAGES.PATHSPEC_ERROR(escapeHTML(notFoundFiles.join(', '))));
    }

    if (addedFiles.length > 0) {
        updateStagingAreaUI(state.stagingArea);
        logSystem(SYSTEM_MESSAGES.ADDED_TO_STAGING(escapeHTML(addedFiles.join(', '))));
        return '';
    } else {
        logSystem(SYSTEM_MESSAGES.NOTHING_ADDED_TO_STAGING);
        return SYSTEM_MESSAGES.NOTHING_ADDED_TO_STAGING;
    }
}

function handleGitCommit(command) {
    const messageMatch = command.match(/-m\s+["'](.+?)["']/);

    if (messageMatch) {
        const commitMessage = escapeHTML(messageMatch[1]);

        if (state.stagingArea.length > 0) {
            const commitOutput = messages.gitCommitMessage(commitMessage, state.stagingArea);
            state.setLastCommitMessage(commitMessage);
            state.addLocalCommit(commitMessage);
            state.resetStagingArea();
            updateStagingAreaUI(state.stagingArea);
            logSystem(SYSTEM_MESSAGES.COMMIT_CREATED(commitMessage));
            return commitOutput;
        } else {
            return returnError(ERROR_MESSAGES.NOTHING_TO_COMMIT);
        }
    } else {
        return returnError(ERROR_MESSAGES.PLEASE_PROVIDE_COMMIT_MESSAGE);
    }
}

async function handleGitPush(args) {
    const currentBranch = state.getCurrentBranch();
    const upstream = state.getUpstreamForBranch(currentBranch);

    const hasSetUpstreamFlag = args.includes('--set-upstream') || args.includes('-u');

    let remoteName = null;
    let remoteBranch = null;

    // Argument parsing
    if (args.length >= 3) {
        if (args[2] === '--set-upstream' || args[2] === '-u') {
            if (args[3]) {
                remoteName = args[3];
                remoteBranch = args[4] || currentBranch; // Defaults to current branch if not specified
            } else {
                return returnError('fatal: No remote specified after -u.');
            }
        } else {
            remoteName = args[2];
            remoteBranch = args[3] || currentBranch;
        }
    }

    // If no remote specified, default to 'origin' or upstream
    if (!remoteName) {
        if (upstream) {
            remoteName = upstream.remote;
            remoteBranch = upstream.remoteBranch;
        } else {
            remoteName = 'origin';
            remoteBranch = currentBranch;
        }
    }

    // ✅ Validate remote exists
    if (!state.hasRemote(remoteName)) {
        return returnError(`fatal: No configured remote named '${remoteName}'.`);
    }

    // ✅ Validate remote URL exists
    const remoteUrl = state.getRemoteUrl(remoteName);
    if (!remoteUrl) {
        return returnError(`fatal: The remote '${remoteName}' does not have a valid URL configured.`);
    }

    // ✅ Check for first time push (no upstream set yet)
    if (!upstream) {
        if (!hasSetUpstreamFlag) {
            return returnError(
                `fatal: The current branch ${currentBranch} has no upstream branch.\n` +
                `To push the current branch and set the remote as upstream, use\n\n` +
                `    git push --set-upstream ${remoteName} ${remoteBranch}\n`
            );
        }
        // Set upstream tracking
        state.setUpstreamForBranch(currentBranch, remoteName, remoteBranch);
    }

    // ✅ Check if there are commits to push
    if (state.localCommits.length === 0) {
        return returnError('Everything up-to-date');
    }

    // ✅ Simulate push
    const totalObjects = Math.floor(Math.random() * 5) + 3;
    const compressedObjects = Math.floor(totalObjects / 2) + 1;
    const delta = Math.floor(Math.random() * 3);
    const localHash = Math.random().toString(36).substring(2, 9);
    const remoteHash = Math.random().toString(36).substring(2, 9);
    const bytes = Math.floor(Math.random() * 500) + 200;
    const speed = (Math.random() * 500 + 100).toFixed(2);

    await gitPushMessage(totalObjects, compressedObjects, delta, bytes, speed, localHash, remoteHash, remoteUrl);

    state.pushCommits();
    state.setRemoteLinked(true);
    updateRemoteUI(state.remoteCommits);
    updateWorkingDirectoryUI(state.workingDirectory, false);
    logSystem(SYSTEM_MESSAGES.PUSHED_TO_REMOTE);

    return '';
}

function handleGitRestore(files) {
    let removedFiles = [];

    files.forEach(file => {
        if (state.isFileInStaging(file)) {
            const index = state.stagingArea.findIndex(f => f.name === file);
            if (index !== -1) {
                state.stagingArea.splice(index, 1);
                removedFiles.push(file);
            }
        }
    });

    if (removedFiles.length > 0) {
        updateStagingAreaUI(state.stagingArea);
        logSystem(SYSTEM_MESSAGES.UNSTAGED_FILES(escapeHTML(removedFiles.join(', '))));
        return '';
    } else {
        return returnError(ERROR_MESSAGES.NO_MATCHING_FILES);
    }
}


document.getElementById('addFileBtn').addEventListener('click', () => {
    const ul = document.getElementById('workingDir');
    const existingInput = ul.querySelector('.filename-input');

    if (existingInput) return; // Prevent multiple inputs

    // Remove "Empty" placeholder if present
    const placeholder = ul.querySelector('.text-muted');
    if (placeholder) placeholder.remove();

    const li = document.createElement('li');
    li.className = 'list-group-item p-1';

    const input = document.createElement('input');

    input.className = 'form-control filename-input';
        input.placeholder = 'Enter filename...';

        li.appendChild(input);
        ul.appendChild(li);

        // Safe autofocus without warning
        setTimeout(() => input.focus(), 0);


    let hasError = false;

    input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        hasError = false;
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') return trySaveFile();
        if (e.key === 'Escape') return cancelInput();
    });

    const outsideClickHandler = (e) => {
        const isClickInside = li.contains(e.target);
        const fileName = input.value.trim();

        if (isClickInside) return;

        if (!fileName) {
        cancelInput();
        } else if (hasError) {
        input.focus(); // Keep it open
        } else {
        trySaveFile();
        }
    };

    // Add outside click listener after render
    setTimeout(() => document.addEventListener('click', outsideClickHandler), 0);

    function trySaveFile() {
        const fileName = input.value.trim();
        if (!fileName) return;

        if (fileExists(fileName)) {
        input.classList.add('is-invalid');
        hasError = true;
        return;
        }

        addFileToWorkingDir(fileName);
        updateWorkingDirectoryUI(workingDirectory);
        document.removeEventListener('click', outsideClickHandler);
    }

    function cancelInput() {
        li.remove();
        restoreEmptyMessage();
        document.removeEventListener('click', outsideClickHandler);
    }

    function restoreEmptyMessage() {
        if (workingDirectory.length === 0 && ul.querySelectorAll('li').length === 0) {
        ul.innerHTML = `<li class="list-group-item p-2 text-muted">Empty</li>`;
        }
    }
});
