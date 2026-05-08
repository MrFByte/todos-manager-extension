import * as vscode from 'vscode';
import * as path from 'path';
import { TodoFile, TodoItem } from './types';

export class TodoService {
    private static readonly TODO_FOLDER = '.todo';
    private _onDidChangeTodos = new vscode.EventEmitter<void>();
    readonly onDidChangeTodos = this._onDidChangeTodos.event;

    constructor() {
        this.setupWatcher();
    }

    private setupWatcher() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return;

        const pattern = new vscode.RelativePattern(
            workspaceFolder,
            `${TodoService.TODO_FOLDER}/*.md`
        );
        const watcher = vscode.workspace.createFileSystemWatcher(pattern);

        watcher.onDidChange(() => this._onDidChangeTodos.fire());
        watcher.onDidCreate(() => this._onDidChangeTodos.fire());
        watcher.onDidDelete(() => this._onDidChangeTodos.fire());
    }

    async getTodoFiles(): Promise<TodoFile[]> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return [];

        const todoDirPath = vscode.Uri.joinPath(workspaceFolder.uri, TodoService.TODO_FOLDER);
        
        try {
            const entries = await vscode.workspace.fs.readDirectory(todoDirPath);
            const mdFiles = entries.filter(([name, type]) => 
                type === vscode.FileType.File && name.endsWith('.md')
            );

            const todoFiles: TodoFile[] = [];
            for (const [name] of mdFiles) {
                const filePath = vscode.Uri.joinPath(todoDirPath, name);
                const tasks = await this.parseTasks(filePath);
                todoFiles.push({
                    name,
                    path: filePath.fsPath,
                    tasks
                });
            }

            return todoFiles.sort((a, b) => b.name.localeCompare(a.name));
        } catch (error) {
            return [];
        }
    }

    private async parseTasks(fileUri: vscode.Uri): Promise<TodoItem[]> {
        const content = await vscode.workspace.fs.readFile(fileUri);
        const text = Buffer.from(content).toString('utf8');
        const lines = text.split(/\r?\n/);
        
        const tasks: TodoItem[] = [];
        const taskRegex = /^(\s*)-\s*\[([ xX])] (.*)$/;

        lines.forEach((lineText, index) => {
            const match = lineText.match(taskRegex);
            if (match) {
                tasks.push({
                    id: `${fileUri.fsPath}-${index}`,
                    text: match[3],
                    completed: match[2].toLowerCase() === 'x',
                    line: index,
                    filePath: fileUri.fsPath
                });
            }
        });

        return tasks;
    }

    async createTodoList(): Promise<void> {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return;
        }

        const todoDirPath = vscode.Uri.joinPath(workspaceFolder.uri, TodoService.TODO_FOLDER);
        
        // Ensure directory exists
        try {
            await vscode.workspace.fs.createDirectory(todoDirPath);
        } catch (e) {}

        const now = new Date();
        const timestamp = now.toISOString()
            .replace(/T/, '_')
            .replace(/:/g, '-')
            .split('.')[0]
            .replace(/-(\d\d)$/, '-$1-todo.md');
        
        // Proper formatting: YYYY-MM-DD_HH-mm-todo.md
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const fileName = `${year}-${month}-${day}_${hours}-${minutes}-todo.md`;

        const fileUri = vscode.Uri.joinPath(todoDirPath, fileName);
        
        try {
            await vscode.workspace.fs.stat(fileUri);
            vscode.window.showInformationMessage('Todo list for this minute already exists.');
        } catch {
            const initialContent = Buffer.from('# Todo List\n\n- [ ] My first task\n', 'utf8');
            await vscode.workspace.fs.writeFile(fileUri, initialContent);
            const doc = await vscode.workspace.openTextDocument(fileUri);
            await vscode.window.showTextDocument(doc);
        }
    }

    async addTask(filePath: string): Promise<void> {
        const text = await vscode.window.showInputBox({ prompt: 'Enter task description' });
        if (!text) return;

        const fileUri = vscode.Uri.file(filePath);
        const content = await vscode.workspace.fs.readFile(fileUri);
        const currentText = Buffer.from(content).toString('utf8');
        
        const newContent = currentText.endsWith('\n') 
            ? `${currentText}- [ ] ${text}\n`
            : `${currentText}\n- [ ] ${text}\n`;

        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(newContent, 'utf8'));
    }

    async toggleTask(item: TodoItem): Promise<void> {
        const fileUri = vscode.Uri.file(item.filePath);
        const content = await vscode.workspace.fs.readFile(fileUri);
        const lines = Buffer.from(content).toString('utf8').split(/\r?\n/);
        
        const lineText = lines[item.line];
        const updatedLine = item.completed 
            ? lineText.replace(/\[[xX]]/, '[ ]')
            : lineText.replace(/\[ ]/, '[x]');
        
        lines[item.line] = updatedLine;
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(lines.join('\n'), 'utf8'));
    }

    async deleteTask(item: TodoItem): Promise<void> {
        const fileUri = vscode.Uri.file(item.filePath);
        const content = await vscode.workspace.fs.readFile(fileUri);
        const lines = Buffer.from(content).toString('utf8').split(/\r?\n/);
        
        lines.splice(item.line, 1);
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(lines.join('\n'), 'utf8'));
    }

    async editTask(item: TodoItem): Promise<void> {
        const newText = await vscode.window.showInputBox({ 
            prompt: 'Edit task description',
            value: item.text 
        });
        if (newText === undefined) return;

        const fileUri = vscode.Uri.file(item.filePath);
        const content = await vscode.workspace.fs.readFile(fileUri);
        const lines = Buffer.from(content).toString('utf8').split(/\r?\n/);
        
        const lineText = lines[item.line];
        lines[item.line] = lineText.replace(item.text, newText);
        
        await vscode.workspace.fs.writeFile(fileUri, Buffer.from(lines.join('\n'), 'utf8'));
    }
}
