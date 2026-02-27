#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src);
        entries.forEach(entry => {
            copyRecursive(path.join(src, entry), path.join(dest, entry));
        });
    } else {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
    }
}

function runInstall(targetRoot = process.cwd()) {
    const pkgRoot = path.resolve(__dirname, '..');

    const foldersToCopy = ['.github', 'Generator_Patterns', 'Created_Generators'];
    const filesToCopy = ['README.md'];

    console.log(`[GeneratorAgent] Installing to: ${targetRoot}`);
    console.log(`[GeneratorAgent] Package root: ${pkgRoot}`);

    foldersToCopy.forEach(folder => {
        const src = path.join(pkgRoot, folder);
        const dest = path.join(targetRoot, folder);
        console.log(`[GeneratorAgent] Copying ${src} to ${dest}`);
        copyRecursive(src, dest);
    });

    filesToCopy.forEach(file => {
        const src = path.join(pkgRoot, file);
        const dest = path.join(targetRoot, file);
        if (fs.existsSync(src)) {
            console.log(`[GeneratorAgent] Copying file ${src} to ${dest}`);
            fs.copyFileSync(src, dest);
        }
    });

    // Delete the entire generator-agent package from node_modules after copying
    try {
        const nodeModulesPath = path.join(targetRoot, 'node_modules', 'generator-agent');
        console.log(`[GeneratorAgent] Attempting to remove: ${nodeModulesPath}`);
        if (fs.existsSync(nodeModulesPath)) {
            console.log(`[GeneratorAgent] Found generator-agent in node_modules, removing...`);
            fs.rmSync(nodeModulesPath, { recursive: true, force: true });
            console.log(`[GeneratorAgent] Successfully removed generator-agent from node_modules`);
        } else {
            console.log(`[GeneratorAgent] generator-agent not found in node_modules`);
        }
    } catch (err) {
        console.log(`[GeneratorAgent] Error removing package: ${err.message}`);
    }

    // eslint-disable-next-line no-console
    console.log('GeneratorAgent: Copied .github, Generator_Patterns, and Created_Generators to project root. Package removed from node_modules.');
}

if (require.main === module) {
    runInstall();
}

module.exports = { runInstall };
