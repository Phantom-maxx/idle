import { initializeEditor, editor } from './editor.js';
import { clearTerminal, appendTerminal } from './terminal.js';
import { initializeRuntime, runCode, stopExecution } from './runtime.js';
import { saveFile } from './storage.js';
import { renderSidebar } from './sidebar.js';
import { initializeCommands } from './commands.js';

initializeEditor();
initializeRuntime();
renderSidebar();

const runBtn = document.getElementById('runBtn');
const stopBtn = document.getElementById('stopBtn');
const saveBtn = document.getElementById('saveBtn');
const newBtn = document.getElementById('newBtn');

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
