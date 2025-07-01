// ui.js
import { submitCommand } from './terminal.js';

const terminalOutput = document.getElementById('terminalOutput');
const stagingList = document.getElementById('stagingArea');

export function displayOutput(message) {
    const lines = message.split('\n');

    lines.forEach(line => {
        if (line.trim() === '') return;
        const output = document.createElement('p');
        output.textContent = line;
        terminalOutput.appendChild(output);
        logMessage(line, 'output');
    });

    addTerminalInput();
}

export function addTerminalInput() {
    const existingInput = document.getElementById('terminalInput');
    if (existingInput) return;

    const terminalInputContainer = document.createElement('div');
    terminalInputContainer.classList.add('d-flex', 'align-items-center');

    const prompt = document.createElement('span');
    prompt.innerHTML = `PS C:\\xampp\\htdocs\\GitSimulator&gt;&nbsp;`;

    const terminalInput = document.createElement('input');
    terminalInput.type = 'text';
    terminalInput.id = 'terminalInput';
    terminalInput.className = 'bg-dark text-white border-0 flex-grow-1';
    terminalInput.style.outline = 'none';
    terminalInput.style.fontFamily = 'monospace';

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitCommand(terminalInputContainer, terminalInput.value);
        }
    });

    terminalInputContainer.appendChild(prompt);
    terminalInputContainer.appendChild(terminalInput);
    terminalOutput.appendChild(terminalInputContainer);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    terminalInput.focus();
}

export function updateStagingAreaUI(stagingArea) {
    stagingList.innerHTML = '';

    if (stagingArea.length === 0) {
        stagingList.innerHTML = '<li class="list-group-item p-2 text-muted">Empty</li>';
    } else {
        stagingArea.forEach(file => {
            const li = document.createElement('li');
            li.className = 'list-group-item p-2';
            li.textContent = file;
            stagingList.appendChild(li);
        });
    }
}

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

const terminalLog = document.getElementById('terminalLog');

export function logMessage(message, type = 'info') {
    const log = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString();

    if (type === 'command') {
        log.innerHTML = `<span class="text-primary">[${timestamp}]</span> <strong>${message}</strong>`;
    } else if (type === 'output') {
        log.innerHTML = `<span class="text-secondary">[${timestamp}]</span> ${message}`;
    } else {
        log.innerHTML = `<span class="text-muted">[${timestamp}]</span> ${message}`;
    }

    terminalLog.appendChild(log);
    terminalLog.scrollTop = terminalLog.scrollHeight;
}
