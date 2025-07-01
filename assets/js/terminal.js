// /terminal.js
import { processGitCommand } from './gitSimulator.js';
import { addTerminalInput, displayOutput } from './ui.js';

export function submitCommand(commandElement, command) {
    if (command.trim() === '') return;

    // Handle terminal input
    const input = commandElement.querySelector('input');
    if (input) {
        // 🔥 Split the command to highlight the first word
        const commandParts = input.value.trim().split(' ');
        const firstWord = commandParts.shift(); // remove and store the first word
        const remainingCommand = commandParts.join(' '); // join the rest

        const staticText = document.createElement('span');
        staticText.innerHTML = `<span style="color: #4ade80; font-weight: bold;">${firstWord}</span> ${remainingCommand}`;

        commandElement.replaceChild(staticText, input);
    }

    const output = processGitCommand(command);

    if (output && output.trim() !== '') {
        displayOutput(output);
    } else {
        addTerminalInput();
    }
    // displayOutput(output);
    
}

export function initTerminal() {
    let commandHistory = [];
    let historyIndex = -1;

    // ✅ Initialize terminal input on page load
    addTerminalInput();

    // ✅ History navigation using form input (optional, can be removed if not using form)
    const gitCommand = document.getElementById('gitCommand');
    if (gitCommand) {
        gitCommand.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    gitCommand.value = commandHistory[historyIndex];
                    syncInputs();
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    gitCommand.value = commandHistory[historyIndex];
                    syncInputs();
                } else {
                    gitCommand.value = '';
                    syncInputs();
                }
            }
        });
    }
}

export function syncInputs() {
    const formInput = document.getElementById('gitCommand');
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) terminalInput.value = formInput.value;
}
