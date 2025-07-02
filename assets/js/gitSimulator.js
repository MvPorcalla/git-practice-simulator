// gitMessages.js
import * as state from './state.js';
import * as messages from './gitMessages.js';
import { updateStagingAreaUI, updateWorkingDirectoryUI, updateRemoteUI, logMessage } from './ui.js';

export function processGitCommand(command) {
    const args = command.split(' ');

    logMessage(`Command executed: ${command}`);

    if (args[0] === 'git' && args[1] === 'init') {
        if (state.isGitInitialized()) {
            logMessage('Repository reinitialized.');
            return 'Reinitialized existing Git repository.';
        } else {
            state.setGitInitialized(true);
            updateWorkingDirectoryUI(state.workingDirectory, true);
            logMessage('Repository initialized.');
            return messages.gitInitMessage();
        }
    }

    if (!state.isGitInitialized()) {
        logMessage('Error: Tried to execute Git command outside of a repository.');
        return 'fatal: not a git repository (or any of the parent directories): .git';
    }

    if (args[0] === 'git' && args[1] === 'status') {
        logMessage('Displayed status.');
        return getGitStatus();
    }

    if (args[0] === 'git' && args[1] === 'add') {
        if (args[2] === '.') {
            // Extract file names from working directory
            const allFileNames = state.workingDirectory.map(file => file.name);
            return handleGitAdd(allFileNames);
        } else {
            return handleGitAdd(args.slice(2));
        }
    }

    if (args[0] === 'git' && args[1] === 'commit') {
        return handleGitCommit(command);
    }

    if (args[0] === 'git' && args[1] === 'push') {
        return handleGitPush();
    }

    if (args[0] === 'git' && args[1] === 'restore' && args[2] === '--staged') {
        return handleGitRestore(args.slice(3));
    }

    logMessage(`Error: Command not recognized: ${command}`);
    return `Command not recognized: ${command}`;
}

// ✅ Git Status
function getGitStatus() {
    const stagedFiles = state.stagingArea;
    const untrackedFiles = state.workingDirectory.filter(file => !state.isFileInStaging(file.name));

    return messages.gitStatusWithFiles(stagedFiles, untrackedFiles, state.localCommits.length);
}


// ✅ Git Add
function handleGitAdd(files) {
    let addedFiles = [];

    if (files.length === 1 && files[0] === '.') {
        // git add . => Add all unstaged files
        state.workingDirectory.forEach(fileObject => {
            if (!state.isFileInStaging(fileObject.name)) {
                state.addToStaging(fileObject);
                addedFiles.push(fileObject.name);
            }
        });
    } else {
        // git add filename(s)
        files.forEach(file => {
            const fileObject = state.workingDirectory.find(f => f.name === file);

            if (fileObject && !state.isFileInStaging(fileObject.name)) {
                state.addToStaging(fileObject);
                addedFiles.push(fileObject.name);
            }
        });
    }

    if (addedFiles.length > 0) {
        updateStagingAreaUI(state.stagingArea);
        logMessage(`Added files to staging area: ${addedFiles.join(', ')}`);
        // return `📥 Added to staging area: ${addedFiles.join(', ')}`;
        return '';
    } else {
        logMessage('Nothing added to staging area.');
        return 'Nothing added to staging area.';
    }
}

// ✅ Git Commit
function handleGitCommit(command) {
    const messageMatch = command.match(/-m\s+"(.+?)"/);

    if (messageMatch) {
        const commitMessage = messageMatch[1];

        if (state.stagingArea.length > 0) {
            const commitOutput = messages.gitCommitMessage(commitMessage, state.stagingArea);
            state.setLastCommitMessage(commitMessage);
            state.addLocalCommit(commitMessage);
            state.resetStagingArea();
            updateStagingAreaUI(state.stagingArea);
            logMessage(`Commit created: "${commitMessage}"`);
            return commitOutput;
        } else {
            logMessage('Nothing to commit.');
            return 'Nothing to commit.';
        }
    } else {
        logMessage('Error: Commit message missing.');
        return 'Please provide a commit message with -m "message".';
    }
}

// ✅ Git Push
function handleGitPush() {
    if (state.localCommits.length > 0) {
        const pushOutput = messages.gitPushMessage();
        state.pushCommits();
        state.setRemoteLinked(true); // ✅ Mark the remote as linked now
        updateRemoteUI(state.remoteCommits);
        updateWorkingDirectoryUI(state.workingDirectory, false);
        logMessage('Pushed local commits to remote.');
        return pushOutput;
    } else {
        logMessage('Nothing to push.');
        return 'Nothing to push.';
    }
}

function handleGitRestore(files) {
    let removedFiles = [];

    files.forEach(file => {
        if (state.isFileInStaging(file)) {
            // Find index of the file to remove
            const index = state.stagingArea.findIndex(f => f.name === file);
            if (index !== -1) {
                state.stagingArea.splice(index, 1); // ✅ Mutate the array directly
                removedFiles.push(file);
            }
        }
    });

    if (removedFiles.length > 0) {
        updateStagingAreaUI(state.stagingArea);
        logMessage(`Unstaged files: ${removedFiles.join(', ')}`);
        return `Unstaged files: ${removedFiles.join(', ')}`;
    } else {
        logMessage('No matching files found in staging area.');
        return 'No matching files found in staging area.';
    }
}

