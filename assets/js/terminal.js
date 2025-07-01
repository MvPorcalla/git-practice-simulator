// terminal.js
import * as state from './state.js';
import { processGitCommand } from './gitSimulator.js';
import { addTerminalInput, displayOutput, updateWorkingDirectoryUI } from './ui.js';

export function submitCommand(commandElement, command) {
    if (command.trim() === '') return;

    // Save command to history
    state.commandHistory.push(command);
    state.setHistoryIndex(state.commandHistory.length); // ✅ FIXED

    // Handle terminal input
    const input = commandElement.querySelector('input');
    if (input) {
        const commandParts = input.value.trim().split(' ');
        const firstWord = commandParts.shift();
        const remainingCommand = commandParts.join(' ');

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
}

export function initTerminal() {
    updateWorkingDirectoryUI(state.workingDirectory);
    addTerminalInput();
}

export function handleArrowKeys(inputElement) {
    inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            if (state.getHistoryIndex() > 0) {
                state.setHistoryIndex(state.getHistoryIndex() - 1);
                inputElement.value = state.commandHistory[state.getHistoryIndex()];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (state.getHistoryIndex() < state.commandHistory.length - 1) {
                state.setHistoryIndex(state.getHistoryIndex() + 1);
                inputElement.value = state.commandHistory[state.getHistoryIndex()];
            } else {
                state.setHistoryIndex(state.commandHistory.length);
                inputElement.value = '';
            }
            e.preventDefault();
        }
    });
}

export function syncInputs() {
    const formInput = document.getElementById('gitCommand');
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) terminalInput.value = formInput.value;
}
