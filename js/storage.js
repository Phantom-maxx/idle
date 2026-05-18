const dbPromise = idb.openDB('PyIDE_DB', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('files')) {
            db.createObjectStore('files');
        }
    }
});

export async function saveFile(name, content) {

    const db = await dbPromise;

    const existing = await db.get('files', name);

    const created =
        existing?.created || Date.now();

    await db.put(
        'files',
        {
            content,
            created,
            updated: Date.now()
        },
        name
    );
}
export async function deleteFile(name) {

    const db = await dbPromise;

    await db.delete('files', name);
}

export async function loadFile(name) {
    const db = await dbPromise;
    const file = await db.get('files', name);
    return file?.content || '';
}

export async function getAllFiles() {
    const db = await dbPromise;
    return db.getAllKeys('files');
}

export async function saveInstalledLib(lib) {

    const db = await dbPromise;

    let libs = await db.get('files', '__libs__');

    libs = libs || [];

    if (!libs.includes(lib)) {

        libs.push(lib);

        await db.put('files', libs, '__libs__');
    }
}

export async function getInstalledLibs() {

    const db = await dbPromise;

    return await db.get('files', '__libs__') || [];
}

export async function getFileMeta(name) {

    const db = await dbPromise;

    return await db.get('files', name);
}
