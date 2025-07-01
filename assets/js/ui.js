// ui.js
const terminalOutput = document.getElementById('terminalOutput');
const stagingList = document.getElementById('stagingArea');

export function displayCommand(command) {
    const line = document.createElement('p');
    // line.innerHTML = `PS C:\\xampp\\htdocs\\GitSimulator&gt; ${command}`;
    line.innerHTML = `<span class="text-primary">PS C:\\xampp\\htdocs\\GitSimulator&gt;</span> ${command}`;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

export function displayOutput(message) {
    const output = document.createElement('p');
    output.textContent = message;
    terminalOutput.appendChild(output);
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
