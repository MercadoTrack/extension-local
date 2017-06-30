/* global chrome */

import Utils from './utils/utils'
import Item from './item.model'

const errorNotFound = id => ({ status: 404, error: `Item ${id} not found!` });
const successSaveItem = obj => ({ status: 200, message: `Saved ${Object.keys(obj)}` });

export default {

    saveItem(item) {
        return this.save({ [item.id]: item })
    },

    deleteItem(item) {
        const local = chrome.storage.local;
        return new Promise(resolve => local.remove(item.id, resolve))
    },

    save(obj) {
        const local = chrome.storage.local;
        return new Promise((resolve, reject) => {
            local.set(obj, () => {
                const error = chrome.runtime.lastError;
                if (error) reject(error);
                /* maybe return the same object to pipe */
                else resolve(successSaveItem(obj));
            })
        })
    },

    get(key) {
        const local = chrome.storage.local;
        return new Promise((resolve, reject) => {
            local.get(key, res => {
                const error = chrome.runtime.lastError;
                if (error) reject(error);
                if (!key) {
                    if (Utils.isEmpty(res)) reject('Brand new storage');
                    else resolve(pipeStorageItems(res))
                } else if (!res || Utils.isEmpty(res)) reject(errorNotFound(key))
                else resolve(res);
            })
        })
    },

    clear() {
        const local = chrome.storage.local;
        return new Promise((resolve, reject) => {
            local.clear(() => {
                const error = chrome.runtime.lastError;
                if (error) reject(error);
                else resolve();
            })
        })
    },

    getSize() {
        const local = chrome.storage.local;
        return new Promise((resolve, reject) => {
            local.getBytesInUse(size => {
                const error = chrome.runtime.lastError;
                if (error) reject(error);
                else resolve(Utils.pipeBytesToSize(size));
            })
        })
    }

}

function pipeStorageItems(res) {
    const ids = Object.keys(res);
    return ids.map(id => {
        const data = res[id];
        return new Item(data);
    })
}
