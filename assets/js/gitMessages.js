// gitMessages.js
import * as state from './state.js';

// git init message
export function gitInitMessage() {
    return 'Initialized empty Git repository in C:/xampp/htdocs/GitSimulator/.git/';
}

// git commit message with random hash
export function gitCommitMessage(commitMessage, files) {
    const randomHash = Math.random().toString(36).substring(2, 9);
    const filesChanged = files.length;
    const insertions = Math.floor(Math.random() * 5) + 1; // Minimum 1 insertion
    const deletions = Math.floor(Math.random() * 4); // 0-3 deletions
    const fileWord = filesChanged > 1 ? 'files' : 'file';

    const fileList = files.map(file => `  create mode 100644 ${file.name}`).join('\n');

    return `[main (root-commit) ${randomHash}] ${commitMessage}\n\n` +
        `${filesChanged} ${fileWord} changed, ${insertions} insertions(+), ${deletions} deletions(+)\n\n` +
        `${fileList}`;
}


// git push message
export function gitPushMessage() {
    const totalObjects = Math.floor(Math.random() * 5) + 3; // Minimum 3 objects
    const compressedObjects = Math.floor(totalObjects / 2) + 1; // Minimum 1
    const delta = Math.floor(Math.random() * 3); // 0-2 delta
    const localHash = Math.random().toString(36).substring(2, 9);
    const remoteHash = Math.random().toString(36).substring(2, 9);
    const bytes = Math.floor(Math.random() * 500) + 200;
    const speed = (Math.random() * 500 + 100).toFixed(2); // KiB/s

    return `Enumerating objects: ${totalObjects}, done.\n` +
        `Counting objects: 100% (${totalObjects}/${totalObjects}), done.\n` +
        `Delta compression using up to 4 threads\n` +
        `Compressing objects: 100% (${compressedObjects}/${compressedObjects}), done.\n` +
        `Writing objects: 100% (${totalObjects}/${totalObjects}), ${bytes} bytes | ${speed} KiB/s, done.\n` +
        `Total ${totalObjects} (delta ${delta}), reused 0 (delta 0), pack-reused 0\n` +
        `remote: Resolving deltas: 100% (${delta}/${delta}), completed with ${totalObjects} local objects.\n` +
        `To https://github.com/yourusername/GitSimulator.git\n` +
        `   ${localHash}..${remoteHash}  main -> main`;

}

// git status when clean
export function gitStatusClean() {
    return 'On branch main\nnothing to commit, working tree clean';
}

// git status when files are staged
export function gitStatusWithFiles(stagedFiles, untrackedFiles, localCommitsCount) {
    let statusOutput = 'On branch main\n';

    // ✅ Only show remote tracking if remote is linked
    if (state.isRemoteLinked()) {
        if (localCommitsCount > 0) {
            statusOutput += `Your branch is ahead of 'origin/main' by ${localCommitsCount} commit${localCommitsCount > 1 ? 's' : ''}.\n  (use "git push" to publish your local commits)\n\n`;
        } else {
            statusOutput += `Your branch is up to date with 'origin/main'.\n\n`;
        }
    }

    // ✅ Only show this if there are staged files
    if (stagedFiles.length > 0) {
        statusOutput += 'Changes to be committed:\n';
        statusOutput += '  (use "git restore --staged <file>..." to unstage)\n\n';

        statusOutput += stagedFiles.map(file => {
            const status = file.status === 'modified'
                ? `<span style="color: #facc15;">modified:</span>`
                : `<span style="color: #22c55e;">new file:</span>`;

            const fileName = `<span style="color: #38bdf8;">${file.name}</span>`;

            return `\t${status}   ${fileName}`;
        }).join('\n') + '\n\n';
    }

    // ✅ Always show untracked files if they exist
    if (untrackedFiles.length > 0) {
        statusOutput += 'Changes not staged for commit:\n';
        statusOutput += '  (use "git add <file>..." to update what will be committed)\n';
        statusOutput += '  (use "git restore <file>..." to discard changes in working directory)\n\n';

        statusOutput += untrackedFiles.map(file => {
            const status = file.status === 'modified'
                ? `<span style="color: #f87171;">modified:</span>`
                : `<span style="color: #f87171;">new file:</span>`;

            const fileName = `<span style="color: #38bdf8;">${file.name}</span>`;

            return `\t${status}   ${fileName}`;
        }).join('\n') + '\n\n';
    }

    // ✅ Show clean message if nothing staged and no untracked files
    if (stagedFiles.length === 0 && untrackedFiles.length === 0) {
        statusOutput += 'nothing to commit, working tree clean';
    }

    return statusOutput.trim();
}