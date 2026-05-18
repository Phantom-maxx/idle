import { appendTerminal } from './terminal.js';

let worker;

export function initializeRuntime() {
    worker = new Worker('../workers/pyWorker.js');

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
        }
    };
}

export function runCode(code) {
    worker.postMessage({
        type: 'run',
        code
    });
}

export function stopExecution() {
    worker.terminate();
    initializeRuntime();
    appendTerminal('Execution stopped.', 'error');
}
