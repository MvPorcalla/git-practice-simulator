// gitMessages.js

// git init message
export function gitInitMessage() {
    return 'Initialized empty Git repository in C:/xampp/htdocs/GitSimulator/.git/';
}

// git commit message with random hash
export function gitCommitMessage(commitMessage, files) {
    const randomHash = Math.random().toString(36).substring(2, 9);
    return `[main (root-commit) ${randomHash}] ${commitMessage}\n 1 file changed, 0 insertions(+), 0 deletions(+)\n create mode 100644 ${files.join(', ')}`;
}

// git push message
export function gitPushMessage() {
    return `Enumerating objects: 3, done.\nCounting objects: 100% (3/3), done.\nDelta compression using up to 4 threads\nCompressing objects: 100% (2/2), done.\nWriting objects: 100% (3/3), done.\nTotal 3 (delta 0), reused 0 (delta 0), pack-reused 0\nTo origin/main\n * [new branch]      main -> main`;
}

// git status when clean
export function gitStatusClean() {
    return 'On branch main\nnothing to commit, working tree clean';
}

// git status when files are staged
export function gitStatusWithFiles(stagedFiles) {
    return `On branch main\n\nNo commits yet\n\nChanges to be committed:\n  (use "git rm --cached <file>..." to unstage)\n\t${stagedFiles.map(file => `new file:   ${file}`).join('\n\t')}`;
}
