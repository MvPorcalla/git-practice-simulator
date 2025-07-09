// ui.js
import { submitCommand, handleTerminalInput } from './terminal.js';
import { LOG_TYPES, TERMINAL_PATH } from './gitConfig.js';
import { workingDirectory, isGitInitialized } from './state.js';
import { escapeHTML } from './utils.js';

// ==============================
// 📄 DOM ELEMENT REFERENCES
// ==============================
const terminalOutput = document.getElementById('terminalOutput');
const stagingList = document.getElementById('stagingArea');
const terminalLog = document.getElementById('terminalLog');
const workingDirList = document.getElementById('workingDir');
const remotePathsList = document.getElementById('remotePaths');

// ==============================
// 🖥️ TERMINAL INTERACTION
// ==============================

// Focus terminal input when terminal is clicked
terminalOutput.addEventListener('click', () => {
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) terminalInput.focus();
});

// Display terminal output messages (supports multi-line)
export function displayOutput(message) {
    const lines = message.split('\n');
    lines.forEach(line => {
        if (line.trim() === '') return;
        const output = document.createElement('p');
        output.innerHTML = line;
        terminalOutput.appendChild(output);
    });
}

// Add custom terminal input UI and handle keyboard input
export function addTerminalInput() {
    const existingInput = document.getElementById('terminalInput');
    if (existingInput) return;

    const terminalInputContainer = document.createElement('div');
    terminalInputContainer.classList.add('d-flex', 'align-items-center');

    const prompt = document.createElement('span');
    prompt.innerHTML = TERMINAL_PATH;

    const terminalInput = document.createElement('div');
    terminalInput.id = 'terminalInput';
    terminalInput.className = 'border-0 flex-grow-1';
    terminalInput.style.outline = 'none';
    terminalInput.style.fontFamily = 'monospace';
    terminalInput.style.cursor = 'default';
    terminalInput.tabIndex = 0;

    terminalInput.innerHTML = `<span id="inputContent"></span><span class="cursor">|</span>`;
    console.log('Adding custom terminal input handler');
    handleTerminalInput(terminalInput);

    terminalInputContainer.appendChild(prompt);
    terminalInputContainer.appendChild(terminalInput);
    terminalOutput.appendChild(terminalInputContainer);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    terminalInput.focus();
}

// ==============================
// 📁 FILE AREA DISPLAY (UI LISTS)
// ==============================

// Show list of files in working directory
export function updateWorkingDirectoryUI(files = [], applyTrackedStyle = true) {
    const ul = document.getElementById('workingDir');
    ul.innerHTML = '';

    if (!files.length) {
        ul.innerHTML = `<li class="list-group-item p-2 text-muted">Empty</li>`;
        return;
    }

    files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item p-1';
        li.textContent = file.name;

        if (applyTrackedStyle && isGitInitialized()) {
            li.classList.add('git-tracked');
        }

        ul.appendChild(li);
    });
}

// Show list of staged files
export function updateStagingAreaUI(stagingArea) {
    stagingList.innerHTML = '';
    console.log('Updating staging area with:', stagingArea);

    if (stagingArea.length === 0) {
        stagingList.innerHTML = '<li class="list-group-item p-2 text-muted">Empty</li>';
    } else {
        stagingArea.forEach(file => {
            const li = document.createElement('li');
            li.className = 'list-group-item p-2';
            li.textContent = file.name;
            stagingList.appendChild(li);
        });
    }
}

// Show list of remote names and their URLs
export function updateRemotePathsUI(remotes) {
    remotePathsList.innerHTML = '';
    const remoteNames = Object.keys(remotes);

    if (remoteNames.length === 0) {
        remotePathsList.innerHTML = '<li class="list-group-item p-2 text-muted">No remotes</li>';
    } else {
        remoteNames.forEach(name => {
            const url = remotes[name];
            const li = document.createElement('li');
            li.className = 'list-group-item p-2';
            li.textContent = `${name} → ${url}`;
            remotePathsList.appendChild(li);
        });
    }
}

// Show list of commits pushed to the remote repo
export function updateRemoteUI(remoteCommits) {
    const remoteList = document.getElementById('remoteRepo');
    remoteList.innerHTML = '';

    if (remoteCommits.length === 0) {
        remoteList.innerHTML = '<li class="list-group-item p-2 text-muted">No commits pushed yet</li>';
    } else {
        remoteCommits.forEach(commit => {
            const li = document.createElement('li');
            li.className = 'list-group-item p-2';
            li.textContent = commit;
            remoteList.appendChild(li);
        });
    }
}

// ==============================
// 📋 TERMINAL LOG SYSTEM
// ==============================

// Map log types to bootstrap colors
const typeToColorMap = {
    [LOG_TYPES.COMMAND]: 'text-primary',
    [LOG_TYPES.OUTPUT]: 'text-info',
    [LOG_TYPES.ERROR]: 'text-danger',
    [LOG_TYPES.INFO]: 'text-success'
};

// Log messages with timestamps and color coding
export function logMessage(message, type = 'info') {
    const log = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString();
    const color = typeToColorMap[type] || 'text-secondary';

    log.innerHTML = `<span class="${color}">[${timestamp}]</span> ${escapeHTML(message)}`;
    terminalLog.appendChild(log);
    terminalLog.scrollTop = terminalLog.scrollHeight;
}