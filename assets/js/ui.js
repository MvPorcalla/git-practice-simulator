// ui.js
import { submitCommand, handleTerminalInput  } from './terminal.js';

const terminalOutput = document.getElementById('terminalOutput');
const stagingList = document.getElementById('stagingArea');
const terminalLog = document.getElementById('terminalLog');
const workingDirList = document.getElementById('workingDir');

terminalOutput.addEventListener('click', () => {
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) terminalInput.focus();
});

// ✅ Display terminal output with line-by-line rendering
export function displayOutput(message) {
    const lines = message.split('\n');

    lines.forEach(line => {
        if (line.trim() === '') return;

        const output = document.createElement('p');
        output.innerHTML = line; // ✅ This renders colored HTML
        terminalOutput.appendChild(output);

        logMessage(line, 'output');
    });

    addTerminalInput();
}

// ✅ Create terminal input with arrow key history navigation
export function addTerminalInput() {
    const existingInput = document.getElementById('terminalInput');
    if (existingInput) return;

    const terminalInputContainer = document.createElement('div');
    terminalInputContainer.classList.add('d-flex', 'align-items-center');

    const prompt = document.createElement('span');
    prompt.innerHTML = `PS C:\\xampp\\htdocs\\GitSimulator&gt;&nbsp;`;

    const terminalInput = document.createElement('div');
    terminalInput.id = 'terminalInput';
    terminalInput.className = 'bg-dark text-white border-0 flex-grow-1';
    terminalInput.style.outline = 'none';
    terminalInput.style.fontFamily = 'monospace';
    terminalInput.style.cursor = 'default';
    terminalInput.tabIndex = 0; // Makes div focusable

    terminalInput.innerHTML = `<span id="inputContent"></span><span class="cursor">|</span>`;
    console.log('Adding custom terminal input handler');
    handleTerminalInput(terminalInput);

    terminalInputContainer.appendChild(prompt);
    terminalInputContainer.appendChild(terminalInput);
    terminalOutput.appendChild(terminalInputContainer);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    terminalInput.focus();
}

// ✅ Update working directory UI
export function updateWorkingDirectoryUI(workingDirectory) {
    workingDirList.innerHTML = '';

    if (workingDirectory.length === 0) {
        workingDirList.innerHTML = '<li class="list-group-item p-2 text-muted">Empty</li>';
    } else {
        workingDirectory.forEach(file => {
            const li = document.createElement('li');
            li.className = 'list-group-item p-2';
            li.textContent = file.name;
            workingDirList.appendChild(li);
        });
    }
}

// ✅ Update staging area UI
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

// ✅ Update remote repository UI
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

// ✅ Terminal log system
export function logMessage(message, type = 'info') {
    const log = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString();

    if (type === 'command') {
        log.innerHTML = `<span class="text-primary">[${timestamp}]</span> <strong>${message}</strong>`;
    } else if (type === 'output') {
        log.innerHTML = `<span class="text-info">[${timestamp}]</span> ${message}`;
    } else {
        log.innerHTML = `<span class="text-secondary">[${timestamp}]</span> ${message}`;
    }

    terminalLog.appendChild(log);
    terminalLog.scrollTop = terminalLog.scrollHeight;
}
