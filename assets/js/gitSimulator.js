// gitSimulator.js
import * as state from './state.js';
import { displayOutput, updateStagingAreaUI, updateRemoteUI } from './ui.js';

export function processGitCommand(command) {
    const args = command.split(' ');

    if (args[0] === 'git' && args[1] === 'init') {
        if (state.isGitInitialized()) {
            displayOutput('Reinitialized existing Git repository.');
        } else {
            state.setGitInitialized(true);
            displayOutput('Initialized empty Git repository.');
        }
        return;
    }

    if (!state.isGitInitialized()) {
        displayOutput('fatal: not a git repository (or any of the parent directories): .git');
        return;
    }

    if (args[0] === 'git' && args[1] === 'status') {
        displayGitStatus();
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
}

// ✅ Git Status
function displayGitStatus() {
    if (state.stagingArea.length === 0) {
        displayOutput('On branch main\nNo changes added to commit.');
    } else {
        displayOutput('Changes to be committed:\n' + state.stagingArea.map(file => `\t${file}`).join('\n'));
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
        displayOutput(`Added ${addedFiles.join(', ')} to staging area.`);
        updateStagingAreaUI(state.stagingArea);
    } else {
        displayOutput('Nothing added to staging area.');
    }
}

// ✅ Git Commit
function handleGitCommit(command) {
    const messageMatch = command.match(/-m\s+"(.+?)"/);

    if (messageMatch) {
        const commitMessage = messageMatch[1];

        if (state.stagingArea.length > 0) {
            displayOutput(`[main (root-commit)] ${commitMessage}\n${state.stagingArea.map(file => `\t${file}`).join('\n')}`);
            state.setLastCommitMessage(commitMessage);
            state.addLocalCommit(commitMessage);
            state.resetStagingArea();
            updateStagingAreaUI(state.stagingArea);
        } else {
            displayOutput('Nothing to commit.');
        }
    } else {
        displayOutput('Please provide a commit message with -m "message".');
    }
    
}

// ✅ Git Push
function handleGitPush() {
    if (state.localCommits.length > 0) {
        displayOutput('Pushed to origin main.');
        state.pushCommits();
        updateRemoteUI(state.remoteCommits);
    } else {
        displayOutput('Nothing to push.');
    }
}
