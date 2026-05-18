import {
    getAllFiles,
    loadFile,
    saveFile,
    deleteFile
} from './storage.js';

import { editor } from './editor.js';

const sidebar = document.getElementById('sidebar');

let activeFile = null;

export async function renderSidebar() {

    const files = await getAllFiles();

    sidebar.innerHTML = '';

    files.forEach(file => {

        const wrapper = document.createElement('div');

        wrapper.className = 'file-row';

        const div = document.createElement('div');

        div.className = 'file-item';

        if (activeFile === file) {
            div.style.background = '#2d72ff33';
        }

        div.textContent = file;

        div.onclick = async () => {

            if (window.unsavedChanges) {

                const shouldSave = confirm(
                    'Save current file before switching?'
                );

                if (shouldSave) {
                    await window.saveCurrentFile();
                }
            }

            activeFile = file;

            window.currentFile = file;

            window.unsavedChanges = false;

            const content = await loadFile(file);

            editor.setValue(content || '');

            renderSidebar();
        };

        const menuBtn = document.createElement('button');

        menuBtn.className = 'file-menu-btn';

        menuBtn.textContent = '⋮';

        menuBtn.onclick = (e) => {

            e.stopPropagation();

            showMiniMenu(e, file);
        };

        wrapper.appendChild(div);

        wrapper.appendChild(menuBtn);

        sidebar.appendChild(wrapper);
    });
}

function showMiniMenu(event, file) {

    removeExistingMenus();

    const menu = document.createElement('div');

    menu.className = 'mini-menu';

    const copy = document.createElement('div');

    copy.className = 'mini-menu-item';

    copy.textContent = 'Duplicate';

    copy.onclick = async () => {

        const content = await loadFile(file);

        const newName = prompt(
            'Duplicate file name'
        );

        if (!newName) return;

        await saveFile(newName, content);

        renderSidebar();
    };

    const del = document.createElement('div');

    del.className = 'mini-menu-item';

    del.textContent = 'Delete';

    del.onclick = async () => {

        const sure = confirm(
            `Delete ${file}?`
        );

        if (!sure) return;

        await deleteFile(file);

        if (window.currentFile === file) {

            window.currentFile = null;

            editor.setValue('');
        }

        renderSidebar();
    };

    menu.appendChild(copy);

    menu.appendChild(del);

    document.body.appendChild(menu);

    menu.style.left = event.pageX + 'px';

    menu.style.top = event.pageY + 'px';

    setTimeout(() => {

        window.addEventListener(
            'click',
            removeExistingMenus,
            { once: true }
        );

    }, 10);
}

function removeExistingMenus() {

    document
        .querySelectorAll('.mini-menu')
        .forEach(m => m.remove());
}
