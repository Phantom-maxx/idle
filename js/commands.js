export function initializeCommands({
    run,
    save,
    create
}) {
    const palette = document.getElementById('commandPalette');
    const input = document.getElementById('commandInput');

    const commands = {
        'run code': run,
        'save file': save,
        'new file': create
    };

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            palette.classList.remove('hidden');
            input.focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.toLowerCase();

            if (commands[cmd]) {
                commands[cmd]();
            }

            input.value = '';
            palette.classList.add('hidden');
        }
    });
}
