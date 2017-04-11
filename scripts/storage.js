const error_not_found = id => ({ error: `Item ${id} not found!` });
const success_save_item = obj => ({ message: `Saved ${Object.keys(obj)}` });

class Storage {

    static saveItem(item) {
        return this.save({ [item.id]: item })
    }

    static save(obj) {
        const local = chrome.storage.local;
        return new Promise((resolve, reject) => {
            local.set(obj, res => {
                const error = chrome.runtime.lastError;
                if (error) reject(error);
                /* maybe return the same object to pipe */
                else resolve(success_save_item(obj));
            })
        })
    }

    static get(key) {
        const local = chrome.storage.local;
        return new Promise((resolve, reject) => {
            local.get(key, res => {
                const error = chrome.runtime.lastError;
                if (error) reject(error);
                if (!res || isEmpty(res)) reject(error_not_found(key))
                else if(!key) resolve(pipeStorageItems(res))
                else resolve(res);
            })
        })
    }
    
    static clear() {
        const local = chrome.storage.local;
        return new Promise((resolve, reject) => {
            local.clear(() => {
                const error = chrome.runtime.lastError;
                if (error) reject(error);
                else resolve();
            })
        })
    }

    static getSize() {
        const local = chrome.storage.local;
        return new Promise((resolve, reject) => {
            local.getBytesInUse(size => {
                const error = chrome.runtime.lastError;
                if (error) reject(error);
                else resolve(size);
            })
        })
    }

}

function isEmpty(obj) {
    return typeof obj === 'object' && Object.getOwnPropertyNames(obj).length === 0;
}

function pipeStorageItems(res) {
    const ids = Object.keys(res);
    return ids.map(id => {
        const savedItem = res[id];
        return new Item(id, savedItem.history)
    })
}
