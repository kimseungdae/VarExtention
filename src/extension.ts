import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

interface VariableDoc {
    [key: string]: string;
}

interface UsageLocation {
    file: string;
    line: number;
    column: number;
    text: string;
}

class VariableHoverProvider implements vscode.HoverProvider {
    private varDocs: VariableDoc = {};
    private docFilePath: string = '';

    constructor() {
        this.loadVariableDocs();
        this.watchDocFile();
    }

    private loadVariableDocs(): void {
        try {
            const config = vscode.workspace.getConfiguration('varExtension');
            const docPath = config.get<string>('docPath', 'info_doc/var-doc.json');
            
            if (vscode.workspace.workspaceFolders) {
                this.docFilePath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, docPath);
                
                if (fs.existsSync(this.docFilePath)) {
                    const content = fs.readFileSync(this.docFilePath, 'utf8');
                    this.varDocs = JSON.parse(content);
                    console.log('Variable documentation loaded:', Object.keys(this.varDocs).length, 'variables');
                } else {
                    console.log('Variable documentation file not found:', this.docFilePath);
                }
            }
        } catch (error) {
            console.error('Error loading variable documentation:', error);
            vscode.window.showWarningMessage('Failed to load variable documentation file. Please check the file format.');
        }
    }

    private watchDocFile(): void {
        if (this.docFilePath && fs.existsSync(this.docFilePath)) {
            const watcher = fs.watchFile(this.docFilePath, () => {
                this.loadVariableDocs();
                vscode.window.showInformationMessage('Variable documentation reloaded');
            });
        }
    }

    async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | undefined> {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return;
        }

        const word = document.getText(range);
        if (!word) {
            return;
        }

        const config = vscode.workspace.getConfiguration('varExtension');
        const enableWorkspaceSearch = config.get<boolean>('enableWorkspaceSearch', true);

        let hoverContent = new vscode.MarkdownString();
        hoverContent.isTrusted = true;

        // Check if variable documentation exists
        if (this.varDocs[word]) {
            // Variable description
            hoverContent.appendMarkdown(`### 📝 ${word}\n`);
            hoverContent.appendMarkdown(`${this.varDocs[word]}\n\n`);

            // Workspace usage search
            if (enableWorkspaceSearch) {
                try {
                    const usageLocations = await this.findVariableUsage(word);
                    if (usageLocations.length > 0) {
                        hoverContent.appendMarkdown(`### 📍 사용 위치 (${usageLocations.length}개)\n`);
                        
                        const maxResults = config.get<number>('maxSearchResults', 50);
                        const limitedResults = usageLocations.slice(0, maxResults);
                        
                        for (const usage of limitedResults) {
                            const relativePath = vscode.workspace.asRelativePath(usage.file);
                            const uri = vscode.Uri.file(usage.file);
                            const location = new vscode.Location(uri, new vscode.Position(usage.line - 1, usage.column));
                            
                            hoverContent.appendMarkdown(
                                `- [${relativePath}:${usage.line}](${uri.toString()}#${usage.line}) - \`${usage.text.trim()}\`\n`
                            );
                        }
                        
                        if (usageLocations.length > maxResults) {
                            hoverContent.appendMarkdown(`\n*... ${usageLocations.length - maxResults}개 더 있음*\n`);
                        }
                    } else {
                        hoverContent.appendMarkdown(`### 📍 사용 위치\n현재 워크스페이스에서 사용된 위치를 찾을 수 없습니다.\n`);
                    }
                } catch (error) {
                    console.error('Error searching for variable usage:', error);
                    hoverContent.appendMarkdown(`### 📍 사용 위치\n검색 중 오류가 발생했습니다.\n`);
                }
            }
        } else {
            // Show input box for new variable documentation
            this.showInputBoxForVariable(word);
            hoverContent.appendMarkdown(`### 📝 ${word}\n`);
            hoverContent.appendMarkdown(`*문서가 없습니다. 설명을 입력해주세요.*\n\n`);
        }

        return new vscode.Hover(hoverContent, range);
    }

    private async findVariableUsage(variableName: string): Promise<UsageLocation[]> {
        const usageLocations: UsageLocation[] = [];

        if (!vscode.workspace.workspaceFolders) {
            return usageLocations;
        }

        try {
            // Find files to search
            const files = await vscode.workspace.findFiles(
                '**/*.{ts,js,vue,tsx,jsx}',
                '**/node_modules/**'
            );

            for (const file of files) {
                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    const text = document.getText();
                    const lines = text.split('\n');

                    // Search for variable usage in each line
                    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                        const line = lines[lineIndex];
                        const regex = new RegExp(`\\b${escapeRegExp(variableName)}\\b`, 'g');
                        let match;

                        while ((match = regex.exec(line)) !== null) {
                            usageLocations.push({
                                file: file.fsPath,
                                line: lineIndex + 1,
                                column: match.index,
                                text: line
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Error reading file ${file.fsPath}:`, error);
                }
            }
        } catch (error) {
            console.error('Error finding files:', error);
        }

        return usageLocations;
    }

    private async showInputBoxForVariable(variableName: string): Promise<void> {
        const inputBox = vscode.window.createInputBox();
        inputBox.title = `변수 "${variableName}" 설명 입력`;
        inputBox.placeholder = '변수에 대한 설명을 입력해주세요...';
        inputBox.prompt = `"${variableName}" 변수의 설명을 입력하세요`;

        inputBox.onDidAccept(async () => {
            const description = inputBox.value.trim();
            if (description) {
                await this.updateVariableDoc(variableName, description);
                inputBox.hide();
                vscode.window.showInformationMessage(`변수 "${variableName}" 설명이 저장되었습니다.`);
            }
        });

        inputBox.onDidHide(() => {
            inputBox.dispose();
        });

        inputBox.show();
    }

    private async updateVariableDoc(variableName: string, description: string): Promise<void> {
        try {
            this.varDocs[variableName] = description;

            if (!fs.existsSync(path.dirname(this.docFilePath))) {
                fs.mkdirSync(path.dirname(this.docFilePath), { recursive: true });
            }

            const updatedContent = JSON.stringify(this.varDocs, null, 2);
            fs.writeFileSync(this.docFilePath, updatedContent, 'utf8');
            
            console.log(`Variable documentation updated for: ${variableName}`);
        } catch (error) {
            console.error('Error updating variable documentation:', error);
            vscode.window.showErrorMessage('변수 설명 저장 중 오류가 발생했습니다.');
        }
    }
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Variable Documentation Extension is now active!');

    const hoverProvider = new VariableHoverProvider();

    // Register hover provider for supported languages
    const supportedLanguages = ['typescript', 'javascript', 'vue'];
    
    for (const language of supportedLanguages) {
        const disposable = vscode.languages.registerHoverProvider(
            { scheme: 'file', language: language },
            hoverProvider
        );
        context.subscriptions.push(disposable);
    }

    // Register command to reload documentation
    const reloadCommand = vscode.commands.registerCommand('varExtension.reloadDocs', () => {
        const newProvider = new VariableHoverProvider();
        vscode.window.showInformationMessage('Variable documentation reloaded!');
    });
    context.subscriptions.push(reloadCommand);

    // Show activation message
    vscode.window.showInformationMessage('Variable Documentation Extension activated!');
}

export function deactivate() {
    console.log('Variable Documentation Extension is now deactivated!');
}