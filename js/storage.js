const dbPromise = idb.openDB('PyIDE_DB', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('files')) {
            db.createObjectStore('files');
        }
    }
});

export async function saveFile(name, content) {
    const db = await dbPromise;
    await db.put('files', content, name);
}

export async function loadFile(name) {
    const db = await dbPromise;
    return db.get('files', name);
}

export async function getAllFiles() {
    const db = await dbPromise;
    return db.getAllKeys('files');
}
