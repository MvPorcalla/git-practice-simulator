import * as state from './state.js';
import * as messages from './gitMessages.js';
import { displayOutput, updateStagingAreaUI, updateRemoteUI, logMessage } from './ui.js';

export function processGitCommand(command) {
    const args = command.split(' ');

    // Always log the user's entered command
    logMessage(`Command executed: ${command}`);

    if (args[0] === 'git' && args[1] === 'init') {
        if (state.isGitInitialized()) {
            displayOutput('Reinitialized existing Git repository.');
            logMessage('Repository reinitialized.');
        } else {
            state.setGitInitialized(true);
            displayOutput(messages.gitInitMessage());
            logMessage('Repository initialized.');
        }
        return;
    }

    if (!state.isGitInitialized()) {
        displayOutput('fatal: not a git repository (or any of the parent directories): .git');
        logMessage('Error: Tried to execute Git command outside of a repository.');
        return;
    }

    if (args[0] === 'git' && args[1] === 'status') {
        displayGitStatus();
        logMessage('Displayed status.');
        return;
    }

    if (args[0] === 'git' && args[1] === 'add') {
        if (args[2] === '.') {
            handleGitAdd(state.workingDirectory);
        } else {
            handleGitAdd(args.slice(2));
        }
        return;
    }

    if (args[0] === 'git' && args[1] === 'commit') {
        handleGitCommit(command);
        return;
    }

    if (args[0] === 'git' && args[1] === 'push') {
        handleGitPush();
        return;
    }

    displayOutput(`Command not recognized: ${command}`);
    logMessage(`Error: Command not recognized: ${command}`);
}

// ✅ Git Status
function displayGitStatus() {
    if (state.stagingArea.length === 0) {
        displayOutput(messages.gitStatusClean());
    } else {
        displayOutput(messages.gitStatusWithFiles(state.stagingArea));
    }
}

// ✅ Git Add
function handleGitAdd(files) {
    let addedFiles = [];

    files.forEach(file => {
        if (state.isFileInWorkingDir(file) && !state.isFileInStaging(file)) {
            state.addToStaging(file);
            addedFiles.push(file);
        }
    });

    if (addedFiles.length > 0) {
        updateStagingAreaUI(state.stagingArea);
        logMessage(`Added files to staging area: ${addedFiles.join(', ')}`);
    } else {
        displayOutput('Nothing added to staging area.');
        logMessage('Nothing added to staging area.');
    }
}

// ✅ Git Commit
function handleGitCommit(command) {
    const messageMatch = command.match(/-m\s+"(.+?)"/);

    if (messageMatch) {
        const commitMessage = messageMatch[1];

        if (state.stagingArea.length > 0) {
            displayOutput(messages.gitCommitMessage(commitMessage, state.stagingArea));
            state.setLastCommitMessage(commitMessage);
            state.addLocalCommit(commitMessage);
            state.resetStagingArea();
            updateStagingAreaUI(state.stagingArea);
            logMessage(`Commit created: "${commitMessage}"`);
        } else {
            displayOutput('Nothing to commit.');
            logMessage('Nothing to commit.');
        }
    } else {
        displayOutput('Please provide a commit message with -m "message".');
        logMessage('Error: Commit message missing.');
    }
}

// ✅ Git Push
function handleGitPush() {
    if (state.localCommits.length > 0) {
        displayOutput(messages.gitPushMessage());
        state.pushCommits();
        updateRemoteUI(state.remoteCommits);
        logMessage('Pushed local commits to remote.');
    } else {
        displayOutput('Nothing to push.');
        logMessage('Nothing to push.');
    }
}
