import { initializeEditor, editor } from './editor.js';
import { clearTerminal, appendTerminal } from './terminal.js';
import { initializeRuntime, runCode, stopExecution } from './runtime.js';
import { saveFile } from './storage.js';
import { renderSidebar } from './sidebar.js';
import { initializeCommands } from './commands.js';
import { saveInstalledLib, getInstalledLibs } from './storage.js';
import { installLibrary } from './runtime.js';

initializeEditor();
initializeRuntime();
renderSidebar();

const runBtn = document.getElementById('runBtn');
const stopBtn = document.getElementById('stopBtn');
const saveBtn = document.getElementById('saveBtn');
const newBtn = document.getElementById('newBtn');
const libsBtn = document.getElementById('libsBtn');

const libsModal = document.getElementById('libsModal');
const installLibBtn = document.getElementById('installLibBtn');
const libInput = document.getElementById('libInput');
const installedLibs = document.getElementById('installedLibs');
const networkStatus = document.getElementById('networkStatus');

runBtn.onclick = async () => {

    clearTerminal();

    appendTerminal(
        'Running Python...',
        'success'
    );

    runCode(
        editor.getValue()
    );
};

stopBtn.onclick = () => {
    stopExecution();
};

saveBtn.onclick = async () => {
    const name = prompt('File name');

    if (!name) {
        return;
    }

    await saveFile(name, editor.getValue());

    appendTerminal('File saved', 'success');
    renderSidebar();
};

newBtn.onclick = () => {
    editor.setValue('');
};

initializeCommands({
    run: () => runBtn.click(),
    save: () => saveBtn.click(),
    create: () => newBtn.click()
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}

function updateNetworkStatus() {

    if (navigator.onLine) {

        networkStatus.innerHTML = '● Online';

        networkStatus.style.color = '#72ff72';

    } else {

        networkStatus.innerHTML = '● Offline';

        networkStatus.style.color = '#ff5c5c';
    }
}

window.addEventListener('online', updateNetworkStatus);

window.addEventListener('offline', updateNetworkStatus);

updateNetworkStatus();

libsBtn.onclick = async () => {

    libsModal.classList.remove('hidden');

    renderInstalledLibs();
};

libsModal.onclick = (e) => {

    if (e.target === libsModal) {

        libsModal.classList.add('hidden');
    }
};

installLibBtn.onclick = async () => {

    const lib = libInput.value.trim();

    if (!lib) {
        return;
    }

    appendTerminal(
        `Installing ${lib}...`,
        'success'
    );

    installLibrary(lib);

    await saveInstalledLib(lib);

    libInput.value = '';

    renderInstalledLibs();
};

async function renderInstalledLibs() {

    const libs = await getInstalledLibs();

    installedLibs.innerHTML = '';

    libs.forEach(lib => {

        const div = document.createElement('div');

        div.className = 'lib-item';

        div.textContent = lib;

        installedLibs.appendChild(div);
    });
}
