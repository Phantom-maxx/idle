import { appendTerminal } from './terminal.js';

let worker = null;

function createWorker() {

    if (worker) {
        worker.terminate();
    }

    worker = new Worker(
        new URL('../workers/pyWorker.js', import.meta.url),
        { type: 'classic' }
    );

    worker.onmessage = (event) => {

        const data = event.data;

        switch (data.type) {

            case 'ready':
                appendTerminal('Python Runtime Ready', 'success');
                break;

            case 'result':
                appendTerminal(data.output || 'Execution Complete');
                break;

            case 'error':
                appendTerminal(data.error, 'error');
                break;

            case 'installed':

                appendTerminal(
                    `Installed: ${data.package}`,
                    'success'
                );

                break;
        }
    };

    worker.onerror = (err) => {
        appendTerminal(
            'Worker Crash: ' + err.message,
            'error'
        );
    };
}

export function installLibrary(packageName) {

    worker.postMessage({
        type: 'install',
        package: packageName
    });
}

export function initializeRuntime() {
    createWorker();
}

export function runCode(code) {

    if (!worker) {
        createWorker();
    }

    worker.postMessage({
        type: 'run',
        code
    });
}

export function stopExecution() {

    if (worker) {
        worker.terminate();
    }

    appendTerminal(
        'Execution Stopped',
        'error'
    );

    createWorker();
}
