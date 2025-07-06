// gitSimulator.js
import * as state from './state.js';
import * as messages from './gitMessages.js';
import { updateStagingAreaUI, updateWorkingDirectoryUI, updateRemoteUI, logMessage } from './ui.js';
import { ERROR_MESSAGES, LOG_TYPES, SYSTEM_MESSAGES } from './gitConstants.js';

// Dispatcher map (command -> function)
const gitCommands = {
    init: handleGitInit,
    status: getGitStatus,
    add: handleGitAddWrapper,
    commit: handleGitCommitWrapper,
    push: handleGitPush,
    restore: handleGitRestoreWrapper
};

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
        return returnError(ERROR_MESSAGES.INVALID_COMMAND(args[0]));
    }

    if (!args[1]) {
        return returnError(ERROR_MESSAGES.NO_SUBCOMMAND);
    }

    if (!gitCommands[args[1]]) {
        return returnError(ERROR_MESSAGES.INVALID_GIT_COMMAND(args[1]));
    }

    return null; // Means valid
}

export function processGitCommand(command) {
    const args = command.trim().split(/\s+/);

    logMessage(`[Command] ${command}`, LOG_TYPES.COMMAND);

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

function handleGitCommitWrapper(args) {
    return handleGitCommit(args.join(' '));
}

function handleGitRestoreWrapper(args) {
    if (args[2] === '--staged') {
        return handleGitRestore(args.slice(3));
    } else {
        return returnError(ERROR_MESSAGES.UNKNOWN_RESTORE_OPTION(args.slice(2).join(' ')));
    }
}

function getGitStatus() {
    const stagedFiles = state.stagingArea;
    const untrackedFiles = state.workingDirectory.filter(file => !state.isFileInStaging(file.name));
    return messages.gitStatusWithFiles(stagedFiles, untrackedFiles, state.localCommits.length);
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
        return returnError(ERROR_MESSAGES.PATHSPEC_ERROR(notFoundFiles.join(', ')));
    }

    if (addedFiles.length > 0) {
        updateStagingAreaUI(state.stagingArea);
        logSystem(SYSTEM_MESSAGES.ADDED_TO_STAGING(addedFiles.join(', ')));
        return '';
    } else {
        logSystem(SYSTEM_MESSAGES.NOTHING_ADDED_TO_STAGING);
        return SYSTEM_MESSAGES.NOTHING_ADDED_TO_STAGING;

    }
}

function handleGitCommit(command) {
    const messageMatch = command.match(/-m\s+["'](.+?)["']/);

    if (messageMatch) {
        const commitMessage = messageMatch[1];

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

function handleGitPush() {
    if (state.localCommits.length > 0) {
        const pushOutput = messages.gitPushMessage();
        state.pushCommits();
        state.setRemoteLinked(true);
        updateRemoteUI(state.remoteCommits);
        updateWorkingDirectoryUI(state.workingDirectory, false);
        logSystem(SYSTEM_MESSAGES.PUSHED_TO_REMOTE);
        return pushOutput;
    } else {
        return returnError(ERROR_MESSAGES.NOTHING_TO_PUSH);
    }
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
        logSystem(SYSTEM_MESSAGES.UNSTAGED_FILES(removedFiles.join(', ')));
        return '';
    } else {
        return returnError(ERROR_MESSAGES.NO_MATCHING_FILES);
    }
}
