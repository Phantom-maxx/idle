let pyodide = null;

async function initialize() {
    importScripts(
        'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js'
    );

    pyodide = await loadPyodide();

    self.postMessage({
        type: 'ready'
    });
}

initialize();

self.onmessage = async (event) => {
    const data = event.data;

    if (data.type === 'run') {
        try {
            let output = '';

            pyodide.setStdout({
                batched: (msg) => {
                    output += msg + '\n';
                }
            });

            pyodide.setStderr({
                batched: (msg) => {
                    output += msg + '\n';
                }
            });

            await pyodide.runPythonAsync(data.code);

            self.postMessage({
                type: 'result',
                output
            });

        } catch (err) {
            self.postMessage({
                type: 'error',
                error: err.message
            });
        }
    }
};
