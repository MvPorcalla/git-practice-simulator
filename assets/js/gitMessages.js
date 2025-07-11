// gitMessages.js

import * as state from './state.js';
import { GIT_MESSAGES, GIT_REPO_PATH, GITHUB_URL } from './gitConfig.js';
import { displayOutput, addTerminalInput } from './ui.js';
import { escapeHTML } from './utils.js';

const DEFAULT_SUFFIX = ' done.';

// ==============================
// 🚀 HIGH PRIORITY: MAIN GIT MESSAGES
// ==============================

// git init
export function gitInitMessage() {
    return GIT_MESSAGES.INIT(GIT_REPO_PATH);
}

// git commit (with summary and files)
export function gitCommitMessage(commitMessage, files) {
    const randomHash = Math.random().toString(36).substring(2, 11);
    const filesChanged = files.length;
    const insertions = Math.floor(Math.random() * 5) + 1;
    const deletions = Math.floor(Math.random() * 4);

    const fileList = files.map(file =>
        GIT_MESSAGES.FILE_LIST_ITEM(escapeHTML(file.name))
    ).join('\n');

    return `${GIT_MESSAGES.COMMIT_HEADER('main', randomHash, commitMessage)}\n\n` +
        `${GIT_MESSAGES.FILE_CHANGE_SUMMARY(filesChanged, insertions, deletions)}\n\n` +
        `${fileList}`;
}

// git status (clean state)
export function gitStatusClean() {
    return GIT_MESSAGES.STATUS_CLEAN;
}

// git status (with staged/untracked files)
export function gitStatusWithFiles(stagedFiles, untrackedFiles, localCommitsCount) {
    let statusOutput = 'On branch main\n';

    if (state.isRemoteLinked()) {
        if (localCommitsCount > 0) {
            statusOutput += GIT_MESSAGES.STATUS_AHEAD(localCommitsCount);
        } else {
            statusOutput += `${GIT_MESSAGES.STATUS_UP_TO_DATE}\n\n`;
        }
    }

    if (stagedFiles.length > 0) {
        statusOutput += GIT_MESSAGES.CHANGES_TO_BE_COMMITTED;
        statusOutput += stagedFiles.map(file => {
            const status = file.status === 'modified'
                ? `<span style="color: #facc15;">modified:</span>`
                : `<span style="color: #22c55e;">new file:</span>`;
            const fileName = `<span style="color: #38bdf8;">${file.name}</span>`;
            return `\t${status}   ${fileName}`;
        }).join('\n') + '\n\n';
    }

    if (untrackedFiles.length > 0) {
        statusOutput += GIT_MESSAGES.CHANGES_NOT_STAGED;
        statusOutput += untrackedFiles.map(file => {
            const status = file.status === 'modified'
                ? `<span style="color: #f87171;">modified:</span>`
                : `<span style="color: #f87171;">new file:</span>`;
            const fileName = `<span style="color: #38bdf8;">${file.name}</span>`;
            return `\t${status}   ${fileName}`;
        }).join('\n') + '\n\n';
    }

    if (!stagedFiles.length && !untrackedFiles.length) {
        statusOutput += 'nothing to commit, working tree clean';
    }

    return statusOutput.trim();
}

// git push message simulation
export async function gitPushMessage(
    totalObjects, compressedObjects, delta,
    bytes, speed, localHash, remoteHash, githubUrl
) {
    displayOutput(`Enumerating objects: ${totalObjects}, done.`);
    await simulateLoading('Counting objects: ', totalObjects, DEFAULT_SUFFIX);

    displayOutput('Delta compression using up to 4 threads');
    await simulateLoading('Compressing objects: ', compressedObjects, DEFAULT_SUFFIX);

    await simulateLoading(`Writing objects: `, totalObjects, `, ${bytes} bytes | ${speed} KiB/s, done.`);
    displayOutput(`Total ${totalObjects} (delta ${delta}), reused 0 (delta 0), pack-reused 0`);

    await simulateLoading(`remote: Resolving deltas: `, delta, `, completed with ${totalObjects} local objects.`);

    displayOutput(`To ${githubUrl}\n\n   ${localHash}..${remoteHash}  main -> main`);
    addTerminalInput();
}

// ==============================
// ⏳ PUSH HELPERS (Loading simulation)
// ==============================
async function simulateLoading(prefix, total, suffix = DEFAULT_SUFFIX) {
    return new Promise(async resolve => {
        const container = document.createElement('p');
        container.innerHTML = `${prefix}0% (${total}/${total})`;
        const terminalOutput = document.getElementById('terminalOutput');
        terminalOutput.appendChild(container);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        for (let percent = 0; percent <= 100; percent += 10) {
            await new Promise(r => setTimeout(r, 50));

            const currentCount = Math.floor((percent * total) / 100);
            container.innerHTML = `${prefix}${percent}% (${currentCount}/${total})${percent === 100 ? suffix : ''}`;

            await new Promise(r => setTimeout(r, 20));
            terminalOutput.scrollTo({ top: terminalOutput.scrollHeight, behavior: 'smooth' });
        }

        resolve();
    });
}
