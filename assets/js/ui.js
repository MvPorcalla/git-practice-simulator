// ui.js
const terminalOutput = document.getElementById('terminalOutput');
const stagingList = document.getElementById('stagingArea');

export function displayCommand(command) {
    const line = document.createElement('p');
    line.innerHTML = `<span class="text-primary">PS C:\\xampp\\htdocs\\GitSimulator&gt;</span> ${command}`;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    // ✅ Log the command to the system log
    logMessage(`> ${command}`, 'command');
}


export function displayOutput(message) {
    const lines = message.split('\n');

    lines.forEach(line => {
        const output = document.createElement('p');
        output.textContent = line;
        terminalOutput.appendChild(output);

        // ✅ Log each output line to the system log
        logMessage(line, 'output');
    });

    // Always show prompt after output
    const prompt = document.createElement('p');
    prompt.innerHTML = `PS C:\\xampp\\htdocs\\GitSimulator&gt;`;
    terminalOutput.appendChild(prompt);

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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

    // Style based on type
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

