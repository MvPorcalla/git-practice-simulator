// gitMessages.js

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

    const fileList = files.map(file => `create mode 100644 ${file}`).join('\n');

    return `[main (root-commit) ${randomHash}] ${commitMessage}\n` +
        `${filesChanged} ${fileWord} changed, ${insertions} insertions(+), ${deletions} deletions(+)\n` +
        `${fileList}`;
}

// git push message
export function gitPushMessage() {
    const totalObjects = Math.floor(Math.random() * 5) + 3; // Minimum 3 objects
    const compressedObjects = Math.floor(totalObjects / 2) + 1; // Minimum 1
    const delta = Math.floor(Math.random() * 3); // 0-2 delta
    const localHash = Math.random().toString(36).substring(2, 9);
    const remoteHash = Math.random().toString(36).substring(2, 9);

    return `Enumerating objects: ${totalObjects}, done.\n` +
        `Counting objects: 100% (${totalObjects}/${totalObjects}), done.\n` +
        `Delta compression using up to 4 threads\n` +
        `Compressing objects: 100% (${compressedObjects}/${compressedObjects}), done.\n` +
        `Writing objects: 100% (${totalObjects}/${totalObjects}), done.\n` +
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
export function gitStatusWithFiles(stagedFiles) {
    return `On branch main\n\nNo commits yet\n\nChanges to be committed:\n  (use "git rm --cached <file>..." to unstage)\n\t` +
        stagedFiles.map(file => `new file:   ${file}`).join('\n\t');
}
