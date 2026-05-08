<p align="center">
  <img src="resources/todos-icon.png" alt="Todo Manager Logo" width="128" height="128" />
</p>

<h1 align="center">Todos Manager</h1>

<p align="center">
  <strong>A file-based TODO management system for IDEs </strong>
  <br>
  <em>built for humans and AI agents alike</em>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=antigravity.todo-manager">
    <img src="https://img.shields.io/visual-studio-marketplace/v/antigravity.todo-manager?color=blue&label=VS%20Marketplace&logo=visual-studio-code" alt="VS Marketplace Version" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=antigravity.todo-manager">
    <img src="https://img.shields.io/visual-studio-marketplace/d/antigravity.todo-manager?color=green&label=Downloads" alt="Downloads" />
  </a>
  <img src="https://img.shields.io/badge/VS%20Code-%5E1.80.0-blueviolet?logo=visual-studio-code" alt="VS Code Engine" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" />
</p>

---

## ✨ Overview

**Todos Manager** brings a clean, powerful task management sidebar right into your VS Code editor. No external apps, no databases, no cloud syncing required. Your tasks live as simple **Markdown files** inside your project, giving you full control and total transparency.

Whether you're a solo developer keeping track of your own tasks, or an AI-powered workflow where an agent reads and writes tasks autonomously, **Todo Manager** bridges the gap with a zero-friction, file-first design.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| **File-Based Storage** | Tasks are stored in standard `.md` files inside a `.todo/` folder — no hidden databases. |
| **Sidebar Tree View** | Browse all your todo lists and tasks in a clean, collapsible sidebar panel. |
| **Create Todo Lists** | Instantly generate a timestamped todo file with one click or a Command Palette action. |
| **Toggle Completion** | Click any task to mark it done or undone — the markdown file updates automatically. |
| **Edit Tasks Inline** | Rename any task directly from the sidebar with the pencil icon. |
| **Delete Tasks** | Remove tasks with the trash icon — no confirmations, no friction. |
| 🔄 **Live File Sync** | Edit the `.md` files directly? The sidebar refreshes **instantly** to reflect your changes. |
| 🤖 **AI-Agent Friendly** | Built with "Agent-First" design — AI assistants can read/write tasks just like humans. |

---

## 📖 How to Use

### Step 1 — Create a Todo List

Click the **`+`** (Create List) button in the **Todos** sidebar panel, or open the Command Palette (`Ctrl+Shift+P`) and run:

```
Todo: Create Todo List
```

This will:
- Create a `.todo/` folder in your workspace root (if it doesn't exist).
- Generate a new file named `YYYY-MM-DD_HH-mm-todo.md` with a timestamp.

### Step 2 — Add Tasks

- Click the **`+` icon** next to any todo list file in the sidebar to add a new task.
- Tasks are appended to the Markdown file as `- [ ] Your task here`.

### Step 3 — Manage Tasks

| Action | How |
|---|---|
| **Toggle Complete** | Click on the task name |
| **Edit Task** | Click the ✏️ pencil icon on hover |
| **Delete Task** | Click the 🗑️ trash icon on hover |
| **Refresh** | Click the 🔄 refresh button in the panel title |

### Step 4 — Direct File Editing

Open any `.todo/*.md` file in the editor and modify it manually. The sidebar will **automatically refresh** to reflect your changes in real time.

Example task format:
```markdown
- [ ] Implement user authentication
- [x] Set up the database schema
- [ ] Write unit tests for the API
```

---

## 🤖 Built for AI Agents

Todo Manager was designed with **"Agent-First"** principles, making it the perfect bridge between a human developer and an AI coding assistant (like GitHub Copilot, Cursor, or Antigravity).

### Why AI Agents Love This Extension

**1. Standardized Markdown Communication**
All tasks are stored in plain Markdown — the universal language of code documentation. AI agents can read, parse, and write to these files using standard filesystem tools without needing any special APIs.

**2. Instant Context Awareness**
When an AI agent enters a project, it can look at the `.todo/` folder to immediately understand:
- ✅ What has already been completed.
- 🔲 What still needs to be done.
- 📅 The project timeline (via timestamped filenames).

**3. The "Handoff" Pattern**
```
Human → Creates task in UI sidebar
Agent → Reads the .md file → Executes the task → Checks it off
Human → Sees the update visually in the sidebar in real-time
```

**4. Low Token Overhead**
Markdown checklists are extremely token-efficient. An agent simply appends:
```
- [ ] Implement authentication module
```
...and the UI handles the rest.

**5. Deterministic File Naming**
The `YYYY-MM-DD_HH-mm-todo.md` format lets any agent instantly identify the **latest** todo list without complex logic, ensuring it always works on the most current priorities.

---

## 📁 Project Structure

```
your-workspace/
├── .todo/
│   ├── 2026-05-06_14-30-todo.md   ← Auto-generated todo lists
│   └── 2026-05-01_09-00-todo.md
└── ... (your project files)
```

---

## ⌨️ Commands

All commands are accessible via the Command Palette (`Ctrl+Shift+P`):

| Command | Description |
|---|---|
| `Todo: Create Todo List` | Creates a new timestamped todo file |
| `Todo: Add Todo Task` | Adds a task to the selected list |
| `Todo: Toggle Task Complete` | Toggles a task's completion state |
| `Todo: Edit Task` | Edits the text of a task |
| `Todo: Delete Task` | Deletes a task |
| `Todo: Refresh Todos` | Re-scans and refreshes the sidebar |

---

## 🛠️ Requirements

- **VS Code** `^1.80.0`
- **Node.js** (for development only)

---

## 📝 Release Notes

### v1.0.0
- 🎉 Initial release
- Sidebar tree view with collapsible todo lists
- Create, add, toggle, edit, and delete tasks
- Live file-sync with `.todo/*.md` files
- Full AI-agent compatibility

---

## 🚀 Getting Started

### Installing from the Marketplace

1. Open **VS Code**.
2. Go to the **Extensions** panel (`Ctrl+Shift+X`).
3. Search for **"Todo Manager"**.
4. Click **Install**.

### For Developers / Contributors

1. **Prerequisites**: Install [Node.js](https://nodejs.org/) and [VS Code](https://code.visualstudio.com/).
2. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/todo-vs-code-extension.git
   cd todo-vs-code-extension
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run in development mode**:
   - Open the project folder in VS Code.
   - Press `F5` (or go to **Run and Debug → Run Extension**).
   - A new Extension Development Host window will launch with the extension active.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 👨‍💻 Creator

<p>
  <strong>Farhan Mahmood</strong><br/>
  Connect on LinkedIn: <a href="https://www.linkedin.com/in/farhan-mahmood-n/">linkedin.com/in/farhan-mahmood-n</a>
</p>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made for developers who love staying organized.
</p>
