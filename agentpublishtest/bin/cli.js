#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { runInstall } = require('./install');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Function to load agents from workspace
function loadAgents() {
    const agents = [];
    const cwd = process.cwd();
    const nodeModulesPath = path.join(cwd, 'node_modules');

    if (!fs.existsSync(nodeModulesPath)) {
        return agents;
    }

    try {
        const modules = fs.readdirSync(nodeModulesPath);
        
        modules.forEach(module => {
            const agentPath = path.join(nodeModulesPath, module, '.github', 'agents');
            
            if (fs.existsSync(agentPath)) {
                try {
                    const files = fs.readdirSync(agentPath);
                    files.forEach(file => {
                        if (file.endsWith('.agent.md')) {
                            const agentName = file.replace('.agent.md', '');
                            const agentFilePath = path.join(agentPath, file);
                            const content = fs.readFileSync(agentFilePath, 'utf-8');
                            
                            agents.push({
                                name: agentName,
                                module: module,
                                path: agentFilePath,
                                content: content
                            });
                        }
                    });
                } catch (err) {
                    // Silent fail for unreadable modules
                }
            }
        });
    } catch (err) {
        log('Error reading node_modules', 'yellow');
    }

    return agents;
}

// Display agent list
function displayAgents(agents) {
    if (agents.length === 0) {
        log('\n⚠️  No agents found!', 'yellow');
        log('Install agents using: npm install agentpublishtest', 'cyan');
        return;
    }

    log('\n' + '='.repeat(60), 'cyan');
    log('🤖 INSTALLED AGENTS', 'bright');
    log('='.repeat(60), 'cyan');

    agents.forEach((agent, index) => {
        log(`\n${index + 1}. ${agent.name}`, 'green');
        log(`   📦 Package: ${agent.module}`, 'magenta');
        log(`   📁 Path: ${agent.path}`, 'magenta');
        
        // Parse agent description from markdown
        const descMatch = agent.content.match(/description:\s*'([^']+)'/);
        if (descMatch) {
            log(`   📝 ${descMatch[1]}`, 'cyan');
        }
    });

    log('\n' + '='.repeat(60), 'cyan');
    log(`Total: ${agents.length} agent(s) found\n`, 'bright');
}

// Main function
function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (command === '--help' || command === '-h') {
        log('\nAgent Publisher CLI\n', 'bright');
        log('Usage: agentpublish [command]\n', 'cyan');
        log('Commands:', 'green');
        log('  list           List all installed agents (default)');
        log('  init           Copy .github and Generator_Patterns to project root');
        log('  --version      Show version');
        log('  --help         Show this help message\n');
        return;
    }

    if (command === '--version' || command === '-v') {
        const packageJson = require('../package.json');
        log(`agentpublish v${packageJson.version}\n`);
        return;
    }

    if (command === 'init') {
        runInstall(process.cwd());
        log('✅ Copied files to project root.', 'green');
        return;
    }

    // Default: list agents
    const agents = loadAgents();
    displayAgents(agents);
}

main();
