---
title: SourceTree and Git Setup
description: Complete guide to setting up SourceTree and Git for your Astro Modular blog
category: Optional Software
order: 2
version: 1.0.0
lastModified: 2024-01-15
image: "[[sourcetree.png]]"
imageAlt: SourceTree logo with a blue background.
hideCoverImage: false
hideTOC: false
draft: false
featured: false
aliases:
  - sourcetree-and-git
---
This comprehensive guide will walk you through setting up SourceTree and Git for your Astro Modular blog, enabling seamless version control and deployment workflows.

## Prerequisites

Before starting, ensure you have:
- A GitHub account
- Your Astro Modular blog project ready
- Basic understanding of version control concepts

## Step 1: Install Git

### Windows
1. Download Git from [git-scm.com](https://git-scm.com/download/win)
2. Run the installer with default settings
3. Verify installation: Open Command Prompt and run `git --version`

### macOS
1. Install Xcode Command Line Tools: `xcode-select --install`
2. Or download from [git-scm.com](https://git-scm.com/download/mac)
3. Verify installation: Open Terminal and run `git --version`

### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install git

# CentOS/RHEL
sudo yum install git

# Verify installation
git --version
```

## Step 2: Configure Git

Set up your Git identity:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Optional: Set up SSH keys for GitHub
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your.email@example.com"`
2. Add to SSH agent: `ssh-add ~/.ssh/id_ed25519`
3. Copy public key: `cat ~/.ssh/id_ed25519.pub`
4. Add to GitHub: Settings → SSH and GPG keys → New SSH key

## Step 3: Install SourceTree

### Download and Install
1. Visit [sourcetreeapp.com](https://www.sourcetreeapp.com/)
2. Download the free version
3. Install with default settings
4. Sign in with your Atlassian account (free)

### First Launch Setup
1. Choose "I don't have a repository yet"
2. Connect your GitHub account
3. Authorize SourceTree to access your repositories

## Step 4: Initialize Your Blog Repository

### Option A: Create New Repository on GitHub
1. Go to GitHub.com → New Repository
2. Name it `your-blog-name`
3. Make it public or private
4. Don't initialize with README (we'll do this locally)

### Option B: Use Existing Repository
If you already have a repository, skip to Step 5.

## Step 5: Clone Repository in SourceTree

1. Open SourceTree
2. Click "Clone" button
3. Enter your repository URL:
   - HTTPS: `https://github.com/username/your-blog-name.git`
   - SSH: `git@github.com:username/your-blog-name.git`
4. Choose local folder for your project
5. Click "Clone"

## Step 6: Set Up Your Astro Blog

### Copy Your Blog Files
1. Copy all your Astro Modular files into the cloned repository folder
2. Ensure you have:
   - `src/` directory with your content
   - `package.json` and `pnpm-lock.yaml`
   - `astro.config.mjs`
   - All other necessary files

### Initial Commit
1. In SourceTree, you'll see all your files listed as "Unstaged files"
2. Click "Stage All" to add all files to staging
3. Write a commit message: "Initial blog setup"
4. Click "Commit"
5. Click "Push" to upload to GitHub

## Step 7: Configure Deployment

### For Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub account
3. Select your blog repository
4. Build settings:
   - Build command: `pnpm run build`
   - Publish directory: `dist`
5. Deploy!

### For Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework preset: Astro
4. Deploy!

## Step 8: Daily Workflow with SourceTree

### Making Changes
1. Edit your blog content in Obsidian or your editor
2. Open SourceTree
3. Review changes in the "Working Directory" tab
4. Stage specific files or "Stage All"
5. Write descriptive commit message
6. Click "Commit"
7. Click "Push" to sync with GitHub

### Best Practices
- **Commit frequently**: Small, focused commits are better
- **Write clear messages**: "Add new blog post about X" not "Update files"
- **Pull before pushing**: Always pull latest changes first
- **Use branches**: Create feature branches for major changes

## Step 9: Advanced Git Workflows

### Creating Branches
1. In SourceTree, click "Branch" → "New Branch"
2. Name it descriptively: `feature/new-theme` or `fix/typo-correction`
3. Make your changes
4. Commit and push the branch
5. Create Pull Request on GitHub

### Merging Changes
1. Switch to main branch
2. Pull latest changes
3. Merge your feature branch
4. Delete the feature branch

### Resolving Conflicts
1. SourceTree will show conflict markers
2. Edit files to resolve conflicts
3. Stage resolved files
4. Commit the resolution

## Step 10: Backup and Recovery

### Regular Backups
- Your code is automatically backed up on GitHub
- Consider additional backups of your content
- Use Git's built-in history for recovery

### Recovering from Mistakes
- **Undo last commit**: Right-click commit → "Reset current branch to this commit"
- **Revert changes**: Right-click file → "Discard changes"
- **View history**: Click on any commit to see what changed

## Troubleshooting Common Issues

### Authentication Problems
- **HTTPS**: Use Personal Access Token instead of password
- **SSH**: Ensure SSH key is added to GitHub account

### Merge Conflicts
- Don't panic! Conflicts are normal
- Read the conflict markers carefully
- When in doubt, ask for help

### Large Files
- Git isn't designed for large binary files
- Use Git LFS for images and videos
- Or store assets externally (CDN, etc.)

### Repository Size
- Use `.gitignore` to exclude unnecessary files
- Clean up history if repository becomes too large

## Integration with Obsidian

### Git Integration in Obsidian
1. Install "Obsidian Git" plugin
2. Configure auto-commit settings
3. Your Obsidian vault changes will be automatically committed

### Workflow
1. Write in Obsidian
2. Obsidian Git auto-commits changes
3. SourceTree pulls and pushes to GitHub
4. Netlify/Vercel auto-deploys

## Next Steps

Once you have Git and SourceTree set up:

1. **Explore SourceTree features**: Learn about stashing, cherry-picking, and rebasing
2. **Set up CI/CD**: Automate your deployment pipeline
3. **Collaborate**: Invite others to contribute to your blog
4. **Backup strategies**: Implement additional backup solutions

## Getting Help

- **SourceTree Documentation**: [confluence.atlassian.com](https://confluence.atlassian.com/sourcetreekb)
- **Git Documentation**: [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub Help**: [docs.github.com](https://docs.github.com)

Remember: Git and SourceTree are powerful tools that will make managing your blog much easier. Take time to learn the basics, and don't hesitate to experiment in a test repository first!
