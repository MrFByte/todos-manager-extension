import * as vscode from 'vscode';
import { TodoService } from './todoService';
import { TodoTreeProvider, TaskTreeItem, TodoTreeItem } from './todoTreeProvider';
import { TodoItem } from './types';

export function activate(context: vscode.ExtensionContext) {
    const todoService = new TodoService();
    const todoTreeProvider = new TodoTreeProvider(todoService);

    // Register Tree View
    vscode.window.registerTreeDataProvider('todo-tree-view', todoTreeProvider);

    // Command: Create Todo List
    context.subscriptions.push(
        vscode.commands.registerCommand('todo.createList', async () => {
            await todoService.createTodoList();
        })
    );

    // Command: Add Task
    context.subscriptions.push(
        vscode.commands.registerCommand('todo.addTask', async (item?: TodoTreeItem) => {
            let filePath: string | undefined;

            if (item && 'file' in item) {
                filePath = item.file.path;
            } else {
                // If no file selected, pick the latest one
                const files = await todoService.getTodoFiles();
                if (files.length > 0) {
                    filePath = files[0].path;
                } else {
                    await todoService.createTodoList();
                    const newFiles = await todoService.getTodoFiles();
                    filePath = newFiles[0]?.path;
                }
            }

            if (filePath) {
                await todoService.addTask(filePath);
            }
        })
    );

    // Command: Toggle Task
    context.subscriptions.push(
        vscode.commands.registerCommand('todo.toggleTask', async (task: TodoItem | TaskTreeItem) => {
            const taskData = task instanceof TaskTreeItem ? task.task : task;
            await todoService.toggleTask(taskData);
        })
    );

    // Command: Delete Task
    context.subscriptions.push(
        vscode.commands.registerCommand('todo.deleteTask', async (node: TaskTreeItem) => {
            const confirm = await vscode.window.showWarningMessage(
                `Delete task "${node.task.text}"?`,
                { modal: true },
                'Delete'
            );
            if (confirm === 'Delete') {
                await todoService.deleteTask(node.task);
            }
        })
    );

    // Command: Edit Task
    context.subscriptions.push(
        vscode.commands.registerCommand('todo.editTask', async (node: TaskTreeItem) => {
            await todoService.editTask(node.task);
        })
    );

    // Command: Refresh
    context.subscriptions.push(
        vscode.commands.registerCommand('todo.refresh', () => {
            todoTreeProvider.refresh();
        })
    );
}

export function deactivate() {}
