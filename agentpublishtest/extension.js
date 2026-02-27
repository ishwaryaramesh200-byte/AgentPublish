const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

let chatPanel = null;
let outputChannel = null;

// Function to load all installed agents (from .github/agents and node_modules)
function loadInstalledAgents(extensionPath) {
    const agents = [];

    // Load local agents from .github/agents/
    const localAgentsPath = path.join(extensionPath, '.github', 'agents');
    if (fs.existsSync(localAgentsPath)) {
        const files = fs.readdirSync(localAgentsPath);
        files.forEach(file => {
            if (file.endsWith('.agent.md')) {
                const agentName = file.replace('.agent.md', '');
                const agentPath = path.join(localAgentsPath, file);
                const content = fs.readFileSync(agentPath, 'utf-8');
                agents.push({
                    label: `$(robot) ${agentName}`,
                    description: 'Local Agent',
                    detail: 'From .github/agents/',
                    path: agentPath,
                    content: content,
                    type: 'local'
                });
            }
        });
    }

    // Load npm installed agents - check workspace node_modules
    try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            workspaceFolders.forEach(folder => {
                const nodeModulesPath = path.join(folder.uri.fsPath, 'node_modules');
                if (fs.existsSync(nodeModulesPath)) {
                    const modules = fs.readdirSync(nodeModulesPath);
                    modules.forEach(module => {
                        // Check if module contains agents
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
                                            label: `$(package) ${agentName}`,
                                            description: `npm: ${module}`,
                                            detail: 'From node_modules',
                                            path: agentFilePath,
                                            content: content,
                                            type: 'npm'
                                        });
                                    }
                                });
                            } catch (err) {
                                console.log(`Error reading agent from ${module}:`, err.message);
                            }
                        }
                    });
                }
            });
        }
    } catch (err) {
        console.log("Error loading npm agents:", err.message);
    }

    return agents;
}

function activate(context) {

    outputChannel = vscode.window.createOutputChannel('AgentPublishTest');

    // Read agent instructions from .github/agents/SampleAgent.agent.md
    const agentPath = path.join(context.extensionPath, '.github', 'agents', 'SampleAgent.agent.md');

    let agentInstructions = "";

    try {
        agentInstructions = fs.readFileSync(agentPath, 'utf-8');
        console.log("Loaded Agent Instructions:");
        console.log(agentInstructions);
    } catch (err) {
        console.log("Agent instruction file not found at:", agentPath);
    }

    // Helper function to process agent requests
    function processAgentRequest(input) {
        if (input.toLowerCase() === "hii" || input.toLowerCase() === "hi") {
            return "Hii Ishwarya!";
        }
        if (input.toLowerCase().includes("show instructions")) {
            return "Agent Instructions:\n" + agentInstructions;
        }
        return "Your request: " + input + "\n(Following agent instructions from .github/agents/SampleAgent.agent.md)";
    }

    // 1. QuickPick Dropdown UI (like Copilot dropdown)
    const selectAgent = vscode.commands.registerCommand('my-agent.selectAgent', async function () {
        // Load all available agents (local + npm installed)
        const availableAgents = loadInstalledAgents(context.extensionPath);

        outputChannel.appendLine(`[DEBUG] Found ${availableAgents.length} agents: ${availableAgents.map(a => a.label).join(', ')}`);
        outputChannel.show(true);

        if (availableAgents.length === 0) {
            vscode.window.showWarningMessage('No agents found! Install agentpublishtest via npm.');
            outputChannel.appendLine('[DEBUG] No agents found!');
            return;
        }

        const selected = await vscode.window.showQuickPick(availableAgents, {
            placeHolder: 'Select an agent to run (local + npm installed)',
            matchOnDescription: true,
            matchOnDetail: true
        });

        if (!selected) return;

        const input = await vscode.window.showInputBox({
            prompt: `Type your message to ${selected.label}`,
            placeHolder: "Enter your request..."
        });

        if (input) {
            const response = processAgentRequest(input);
            vscode.window.showInformationMessage(`[${selected.label}] ${response}`);
        }
    });

    // 2. Chat Panel with Webview
    const openChatPanel = vscode.commands.registerCommand('my-agent.openChatPanel', function () {
        if (chatPanel) {
            chatPanel.reveal(vscode.ViewColumn.One);
        } else {
            chatPanel = vscode.window.createWebviewPanel(
                'agentChat',
                'Agent Chat',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            chatPanel.webview.html = getChatHtml();

            chatPanel.webview.onDidReceiveMessage(
                message => {
                    if (message.command === 'sendMessage') {
                        const response = processAgentRequest(message.text);
                        chatPanel.webview.postMessage({ command: 'receiveMessage', text: response });
                    }
                },
                undefined,
                context.subscriptions
            );

            chatPanel.onDidDispose(
                () => {
                    chatPanel = null;
                },
                null,
                context.subscriptions
            );
        }
    });

    // 3. Command Palette Integration
    const runFromPalette = vscode.commands.registerCommand('my-agent.runFromPalette', async function () {
        const input = await vscode.window.showInputBox({
            prompt: "Type your request (e.g., 'Hii')",
            placeHolder: "Enter command for agent..."
        });

        if (input) {
            const response = processAgentRequest(input);
            vscode.window.showInformationMessage(response);
        }
    });

    context.subscriptions.push(selectAgent, openChatPanel, runFromPalette);
}

function getChatHtml() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Agent Chat</title>
        <style>
            body {
                font-family: var(--vscode-font-family);
                padding: 10px;
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
            }
            #chat-container {
                display: flex;
                flex-direction: column;
                height: 90vh;
            }
            #messages {
                flex: 1;
                overflow-y: auto;
                border: 1px solid var(--vscode-panel-border);
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 4px;
            }
            .message {
                margin: 8px 0;
                padding: 8px;
                border-radius: 4px;
            }
            .user-message {
                background-color: var(--vscode-input-background);
                text-align: right;
            }
            .agent-message {
                background-color: var(--vscode-editor-inactiveSelectionBackground);
            }
            #input-container {
                display: flex;
                gap: 8px;
            }
            #message-input {
                flex: 1;
                padding: 8px;
                background: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                border: 1px solid var(--vscode-input-border);
                border-radius: 4px;
            }
            button {
                padding: 8px 16px;
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            button:hover {
                background: var(--vscode-button-hoverBackground);
            }
        </style>
    </head>
    <body>
        <div id="chat-container">
            <h2>🤖 Agent Chat Panel</h2>
            <div id="messages"></div>
            <div id="input-container">
                <input type="text" id="message-input" placeholder="Type 'Hii' or your message..." />
                <button onclick="sendMessage()">Send</button>
            </div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            const messagesDiv = document.getElementById('messages');
            const input = document.getElementById('message-input');

            function sendMessage() {
                const text = input.value.trim();
                if (!text) return;

                // Display user message
                messagesDiv.innerHTML += '<div class="message user-message">You: ' + text + '</div>';
                input.value = '';
                messagesDiv.scrollTop = messagesDiv.scrollHeight;

                // Send to extension
                vscode.postMessage({ command: 'sendMessage', text: text });
            }

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'receiveMessage') {
                    messagesDiv.innerHTML += '<div class="message agent-message">Agent: ' + message.text + '</div>';
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }
            });
        </script>
    </body>
    </html>`;
}

function deactivate() {
    if (chatPanel) {
        chatPanel.dispose();
    }
}

module.exports = {
    activate,
    deactivate
};