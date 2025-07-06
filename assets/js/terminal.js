import * as state from './state.js';
import { processGitCommand } from './gitSimulator.js';
import { addTerminalInput, displayOutput, updateWorkingDirectoryUI } from './ui.js';

let inputString = '';
let cursorPosition = 0;

export function handleTerminalInput(terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        e.preventDefault();

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            // Insert character at cursor
            inputString = inputString.slice(0, cursorPosition) + e.key + inputString.slice(cursorPosition);
            cursorPosition++;
        } else if (e.key === 'Backspace') {
            if (cursorPosition > 0) {
                inputString = inputString.slice(0, cursorPosition - 1) + inputString.slice(cursorPosition);
                cursorPosition--;
            }
        } else if (e.key === 'ArrowLeft') {
            if (cursorPosition > 0) cursorPosition--;
        } else if (e.key === 'ArrowRight') {
            if (cursorPosition < inputString.length) cursorPosition++;
        } else if (e.key === 'Enter') {
            submitCommand(terminalInput.parentElement, inputString);
            inputString = '';
            cursorPosition = 0;
            return;
        } else if (e.key === 'ArrowUp') {
            if (state.getHistoryIndex() > 0) {
                state.setHistoryIndex(state.getHistoryIndex() - 1);
                inputString = state.commandHistory[state.getHistoryIndex()];
                cursorPosition = inputString.length;
            }
        } else if (e.key === 'ArrowDown') {
            if (state.getHistoryIndex() < state.commandHistory.length - 1) {
                state.setHistoryIndex(state.getHistoryIndex() + 1);
                inputString = state.commandHistory[state.getHistoryIndex()];
                cursorPosition = inputString.length;
            } else {
                state.setHistoryIndex(state.commandHistory.length);
                inputString = '';
                cursorPosition = 0;
            }
        }

        updateTerminalInputDisplay(terminalInput);
    });
}

function updateTerminalInputDisplay(terminalInput) {
    const beforeCursor = inputString.slice(0, cursorPosition);
    const afterCursor = inputString.slice(cursorPosition);

    terminalInput.innerHTML = `<span id="inputContent">${beforeCursor}</span><span class="cursor">|</span><span>${afterCursor}</span>`;
    placeCursor(terminalInput);
}

function placeCursor(terminalInput) {
    const cursor = terminalInput.querySelector('.cursor');
    if (cursor) cursor.scrollIntoView({ block: 'nearest' });
}

export async function submitCommand(commandElement, command) {
    if (command.trim() === '') return;

    state.commandHistory.push(command);
    state.setHistoryIndex(state.commandHistory.length);

    const staticText = document.createElement('span');
    const commandParts = command.trim().split(' ');
    const firstWord = commandParts.shift();
    const remainingCommand = commandParts.join(' ');

    staticText.innerHTML = `<span style="color: #4ade80; font-weight: bold;">${firstWord}</span> ${remainingCommand}`;
    commandElement.replaceChild(staticText, commandElement.querySelector('#terminalInput'));

    const output = await processGitCommand(command);

    // 🚩 Don't add terminal input yet. Let processGitCommand decide.

    if (output && output.trim() !== '') {
        displayOutput(output);
        addTerminalInput(); // ✅ Only add terminal input if there is output
    } else if (command.trim().split(' ')[1] !== 'push') {
        // ✅ If it's not 'git push', add terminal input immediately
        addTerminalInput();
    }
}


export function initTerminal() {
    updateWorkingDirectoryUI(state.workingDirectory);
    addTerminalInput();
}

// No longer needed
export function syncInputs() {}
