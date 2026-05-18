const terminal = document.getElementById('terminal');

export function clearTerminal() {
    terminal.innerHTML = '';
}

export function appendTerminal(message, type='') {
    const div = document.createElement('div');
    div.textContent = message;

    if (type) {
        div.classList.add(type);
    }

    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
}
