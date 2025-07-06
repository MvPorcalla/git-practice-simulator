import * as state from './state.js';
import { GIT_MESSAGES, GIT_REPO_PATH, GITHUB_URL } from './gitConstants.js';

// git init message
export function gitInitMessage() {
    return GIT_MESSAGES.INIT(GIT_REPO_PATH);
}

// git commit message with random hash
export function gitCommitMessage(commitMessage, files) {
    const randomHash = Math.random().toString(36).substring(2, 9);
    const filesChanged = files.length;
    const insertions = Math.floor(Math.random() * 5) + 1;
    const deletions = Math.floor(Math.random() * 4);

    const fileList = files.map(file => GIT_MESSAGES.FILE_LIST_ITEM(file.name)).join('\n');

    return `${GIT_MESSAGES.COMMIT_HEADER('main', randomHash, commitMessage)}\n\n` +
        `${GIT_MESSAGES.FILE_CHANGE_SUMMARY(filesChanged, insertions, deletions)}\n\n` +
        `${fileList}`;
}

// git push message
export function gitPushMessage() {
    const totalObjects = Math.floor(Math.random() * 5) + 3;
    const compressedObjects = Math.floor(totalObjects / 2) + 1;
    const delta = Math.floor(Math.random() * 3);
    const localHash = Math.random().toString(36).substring(2, 9);
    const remoteHash = Math.random().toString(36).substring(2, 9);
    const bytes = Math.floor(Math.random() * 500) + 200;
    const speed = (Math.random() * 500 + 100).toFixed(2);

    return GIT_MESSAGES.PUSH_MESSAGE(
        totalObjects,
        compressedObjects,
        delta,
        bytes,
        speed,
        localHash,
        remoteHash,
        GITHUB_URL
    );
}

// git status when clean
export function gitStatusClean() {
    return GIT_MESSAGES.STATUS_CLEAN;
}

// git status when files are staged
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

    if (stagedFiles.length === 0 && untrackedFiles.length === 0) {
        statusOutput += 'nothing to commit, working tree clean';
    }

    return statusOutput.trim();
}
