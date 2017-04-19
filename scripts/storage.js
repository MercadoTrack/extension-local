const error_not_found = id => ({ status: 404, error: `Item ${id} not found!` });
const success_save_item = obj => ({ status: 200, message: `Saved ${Object.keys(obj)}` });

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
                if(!key) {
                    if(isEmpty(res)) return console.log('Brand new storage');
                    else resolve(pipeStorageItems(res))
                } else if (!res || isEmpty(res)) reject(error_not_found(key))
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
                else resolve(pipeBytesToSize(size));
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
        const data = res[id];
        return new Item(data);
    })
}

/* send to utils */
function pipeBytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};
