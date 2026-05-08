import * as vscode from 'vscode';
import { TodoService } from './todoService';
import { TodoFile, TodoItem } from './types';

export class TodoTreeProvider implements vscode.TreeDataProvider<TodoTreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<TodoTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    constructor(private todoService: TodoService) {
        this.todoService.onDidChangeTodos(() => this.refresh());
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TodoTreeItem): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: TodoTreeItem): Promise<TodoTreeItem[]> {
        if (!element) {
            const files = await this.todoService.getTodoFiles();
            return files.map(file => new FileTreeItem(file));
        }

        if (element instanceof FileTreeItem) {
            const tasks = element.file.tasks;
            // Bonus: Sort tasks (incomplete first)
            const sortedTasks = [...tasks].sort((a, b) => {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
            });
            return sortedTasks.map(task => new TaskTreeItem(task));
        }

        return [];
    }
}

export type TodoTreeItem = FileTreeItem | TaskTreeItem;

export class FileTreeItem extends vscode.TreeItem {
    constructor(public readonly file: TodoFile) {
        super(file.name.replace('-todo.md', ''), vscode.TreeItemCollapsibleState.Expanded);
        this.tooltip = file.path;
        this.contextValue = 'todoFile';
        this.iconPath = new vscode.ThemeIcon('file-text');
    }
}

export class TaskTreeItem extends vscode.TreeItem {
    constructor(public readonly task: TodoItem) {
        const label = task.completed ? TaskTreeItem.strikeThrough(task.text) : task.text;
        super(label, vscode.TreeItemCollapsibleState.None);
        
        this.tooltip = task.text;
        this.contextValue = 'todoItem';
        
        // Custom icons
        this.iconPath = task.completed 
            ? new vscode.ThemeIcon('pass-filled', new vscode.ThemeColor('testing.iconPassed'))
            : new vscode.ThemeIcon('circle-outline');

        // Command to toggle on click
        this.command = {
            command: 'todo.toggleTask',
            title: 'Toggle Task',
            arguments: [this.task]
        };
    }

    private static strikeThrough(text: string): string {
        return text.split('').map(char => char + '\u0336').join('');
    }
}
