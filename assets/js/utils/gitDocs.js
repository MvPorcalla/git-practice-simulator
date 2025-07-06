//gitDocs.js
const commands = {
    init: {
        title: 'git init',
        description: 'Initializes a new Git repository in your current directory. Creates a hidden .git folder to track changes.',
        example: 'git init'
    },
    status: {
        title: 'git status',
        description: 'Displays the state of the working directory and staging area. Shows which changes have been staged, which haven’t, and which files aren’t being tracked by Git.',
        example: 'git status'
    },
    add: {
        title: 'git add',
        description: 'Stages files, preparing them for commit. You can add specific files or use git add . to stage all changes.',
        example: 'git add .'
    },
    commit: {
        title: 'git commit',
        description: 'Saves the staged changes to the repository. Each commit should have a meaningful message describing the changes.',
        example: 'git commit -m "Initial commit"'
    },
    push: {
        title: 'git push',
        description: 'Uploads your local repository content to a remote repository. It’s typically used to share your work with others.',
        example: 'git push origin main'
    },
    restore: {
        title: 'git restore',
        description: 'Restores your working directory files to their previous state, discarding uncommitted changes.',
        example: 'git restore filename'
    },
    remote: {
        title: 'git remote',
        description: `The 'git remote' command manages the set of repositories ("remotes") whose branches you track. Common subcommands include:
        <ul>
            <li><strong>git remote add</strong> - Adds a new remote repository.</li>
            <li><strong>git remote remove</strong> - Removes a remote repository from your local configuration.</li>
            <li><strong>git remote rename</strong> - Renames an existing remote.</li>
            <li><strong>git remote -v</strong> - Displays the URLs of the remotes linked to your project.</li>
        </ul>`,
        example: `
            <ul>
                <li><code>git remote add origin https://github.com/user/repo.git</code></li>
                <li><code>git remote remove origin</code></li>
                <li><code>git remote rename origin upstream</code></li>
                <li><code>git remote -v</code></li>
            </ul>`
    },

    pull: {
        title: 'git pull',
        description: 'Fetches and merges changes from the remote repository to your local working directory.',
        example: 'git pull origin main'
    },
    fetch: {
        title: 'git fetch',
        description: 'Downloads changes from the remote repository but does not merge them into your working directory.',
        example: 'git fetch origin'
    },
    branch: {
        title: 'git branch',
        description: 'Lists all branches in your repository. You can also create, rename, and delete branches using this command.',
        example: 'git branch -a'
    },
    checkout: {
        title: 'git checkout',
        description: 'Switches to another branch or restores files in the working directory.',
        example: 'git checkout branch-name'
    },
    merge: {
        title: 'git merge',
        description: 'Combines changes from one branch into another.',
        example: 'git merge branch-name'
    },
    clone: {
        title: 'git clone',
        description: 'Creates a copy of a remote repository on your local machine.',
        example: 'git clone https://github.com/user/repo.git'
    },
    help: {
        title: 'git --help',
        description: 'Displays Git documentation and available commands for assistance.',
        example: 'git --help'
    }
};

const sidebarLinks = document.querySelectorAll('.sidebar a');

function showCommand(commandKey, event = null) {
    const content = commands[commandKey];
    document.getElementById('commandContent').innerHTML = `
        <h2>${content.title}</h2>
        <p><strong>Description:</strong> ${content.description}</p>
        <p><strong>Example:</strong> ${content.example}</p>
    `;

    if (event) {
        event.preventDefault();
        sidebarLinks.forEach(link => link.classList.remove('active'));
        event.target.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const firstLink = sidebarLinks[0];
    showCommand('init');
    firstLink.classList.add('active');
});

