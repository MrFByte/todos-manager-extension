export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    line: number;
    filePath: string;
}

export interface TodoFile {
    name: string;
    path: string;
    tasks: TodoItem[];
}
