let pyodide = null;
let ready = false;

async function initialize() {

    importScripts(
        'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js'
    );

    pyodide = await loadPyodide();

    await pyodide.loadPackage('micropip');

    ready = true;

    self.postMessage({
        type: 'ready'
    });
}

initialize();

self.onmessage = async (event) => {

    const data = event.data;

    if (!ready) {

        self.postMessage({
            type: 'error',
            error: 'Runtime still loading...'
        });

        return;
    }

    if (data.type === 'install') {

        const micropip = pyodide.pyimport('micropip');

        await micropip.install(data.package);

        self.postMessage({
            type: 'installed',
            package: data.package
        });

        return;
    }

    if (data.type === 'run') {

        try {

            let output = '';

            pyodide.setStdout({
                batched: (msg) => {
                    output += msg + '\\n';
                }
            });

            pyodide.setStderr({
                batched: (msg) => {
                    output += msg + '\\n';
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
                error: err.toString()
            });
        }
    }
};
