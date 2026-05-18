import { getAllFiles, loadFile } from './storage.js';
import { editor } from './editor.js';

const sidebar = document.getElementById('sidebar');

let activeFile = null;

export async function renderSidebar() {

    const files = await getAllFiles();

    sidebar.innerHTML = '';

    files.forEach(file => {

        const div = document.createElement('div');

        div.className = 'file-item';

        if (activeFile === file) {
            div.style.background = '#2d72ff33';
        }

        div.textContent = file;

        div.onclick = async () => {

            activeFile = file;

            const content = await loadFile(file);

            editor.setValue(content || '');

            renderSidebar();
        };

        sidebar.appendChild(div);
    });
}
