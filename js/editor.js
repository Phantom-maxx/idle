export let editor;

export function initializeEditor() {
    editor = CodeMirror.fromTextArea(
        document.getElementById('editor'),
        {
            mode: 'python',
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            autofocus: true
        }
    );

    editor.setValue(`print("Welcome to PyIDE")`);
}
