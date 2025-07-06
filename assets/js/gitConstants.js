// gitConstants.js
import { escapeHTML } from './utils.js';

export const TERMINAL_PATH = 'PS C:\\xampp\\htdocs\\GitSimulator&gt;&nbsp;';

export const GIT_REPO_PATH = 'C:/xampp/htdocs/GitSimulator/.git/';
export const GITHUB_URL = 'https://github.com/yourusername/GitSimulator.git';

export const LOG_TYPES = {
    COMMAND: 'command',
    OUTPUT: 'output',
    ERROR: 'error',
    INFO: 'info'
};

export const ERROR_MESSAGES = {
    NO_COMMAND: 'Please enter a command.',
    INVALID_COMMAND: cmd => `'${escapeHTML(cmd)}' is not recognized as an internal or external command, operable program or batch file.`,
    NO_SUBCOMMAND: `git: no subcommand provided. See 'git --help'.`,
    INVALID_GIT_COMMAND: cmd => `git: '${escapeHTML(cmd)}' is not a git command. See 'git --help'.`,
    NOT_A_REPO: 'fatal: not a git repository (or any of the parent directories): .git',
    NOTHING_SPECIFIED: 'Nothing specified, nothing added.',
    PATHSPEC_ERROR: files => `fatal: pathspec '${escapeHTML(files)}' did not match any files`,
    NOTHING_TO_COMMIT: 'Nothing to commit, working tree clean.',
    PLEASE_PROVIDE_COMMIT_MESSAGE: 'Please provide a commit message with -m "message".',
    UNKNOWN_RESTORE_OPTION: option => `git restore: unknown option ${escapeHTML(option)}. Use 'git restore --staged <file>'`,
    NO_MATCHING_FILES: 'No matching files found in staging area.',
    NOTHING_TO_PUSH: 'Nothing to push.'
};

export const SYSTEM_MESSAGES = {
    REPO_REINITIALIZED: 'Repository reinitialized.',
    REPO_INITIALIZED: 'Repository initialized.',
    ADDED_TO_STAGING: files => `Added files to staging area: ${escapeHTML(files)}`,
    NOTHING_ADDED_TO_STAGING: 'Nothing added to staging area.',
    COMMIT_CREATED: message => `Commit created: "${escapeHTML(message)}"`,
    PUSHED_TO_REMOTE: 'Pushed local commits to remote.',
    UNSTAGED_FILES: files => `Unstaged files: ${escapeHTML(files)}`
};

export const GIT_MESSAGES = {
    INIT: repoPath => `Initialized empty Git repository in ${repoPath}`,
    COMMIT_HEADER: (branch, hash, message) => `[${branch} (root-commit) ${hash}] ${message}`,
    FILE_CHANGE_SUMMARY: (filesChanged, insertions, deletions) => 
        `${filesChanged} ${filesChanged > 1 ? 'files' : 'file'} changed, ${insertions} insertions(+), ${deletions} deletions(+)`,
    FILE_LIST_ITEM: fileName => `  create mode 100644 ${fileName}`,

    PUSH_MESSAGE: (totalObjects, compressedObjects, delta, bytes, speed, localHash, remoteHash, githubUrl) => 
        `Enumerating objects: ${totalObjects}, done.\n` +
        `Counting objects: 100% (${totalObjects}/${totalObjects}), done.\n` +
        `Delta compression using up to 4 threads\n` +
        `Compressing objects: 100% (${compressedObjects}/${compressedObjects}), done.\n` +
        `Writing objects: 100% (${totalObjects}/${totalObjects}), ${bytes} bytes | ${speed} KiB/s, done.\n` +
        `Total ${totalObjects} (delta ${delta}), reused 0 (delta 0), pack-reused 0\n` +
        `remote: Resolving deltas: 100% (${delta}/${delta}), completed with ${totalObjects} local objects.\n` +
        `To ${(githubUrl)}\n` +
        `   ${(localHash)}..${(remoteHash)}  main -> main`,

    STATUS_CLEAN: 'On branch main\nnothing to commit, working tree clean',
    STATUS_UP_TO_DATE: "Your branch is up to date with 'origin/main'.",
    STATUS_AHEAD: commits => `Your branch is ahead of 'origin/main' by ${commits} commit${commits > 1 ? 's' : ''}.\n  (use "git push" to publish your local commits)\n\n`,
    CHANGES_TO_BE_COMMITTED: 'Changes to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\n',
    CHANGES_NOT_STAGED: 'Changes not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)\n\n',
};
