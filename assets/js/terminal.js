// terminal.js
import { processGitCommand } from './gitSimulator.js';
import { displayCommand } from './ui.js';

export function initTerminal() {
    const gitForm = document.getElementById('gitForm');
    const gitCommand = document.getElementById('gitCommand');
    let commandHistory = [];
    let historyIndex = -1;

    gitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const command = gitCommand.value.trim();
        if (command) {
            displayCommand(command);
            processGitCommand(command);
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            gitCommand.value = '';
        }
    });

    gitCommand.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                gitCommand.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                gitCommand.value = commandHistory[historyIndex];
            } else {
                gitCommand.value = '';
            }
        }
    });
}
