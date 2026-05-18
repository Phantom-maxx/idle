import { getAllFiles, loadFile } from './storage.js';
import { editor } from './editor.js';

const sidebar = document.getElementById('sidebar');

export async function renderSidebar() {
    const files = await getAllFiles();
    sidebar.innerHTML = '';

    files.forEach(file => {
        const div = document.createElement('div');

        div.className = 'file-item';
        div.textContent = file;

        div.onclick = async () => {
            const content = await loadFile(file);
            editor.setValue(content || '');
        };

        sidebar.appendChild(div);
    });
}
