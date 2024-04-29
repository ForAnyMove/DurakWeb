import { log } from "../logger.js";
import { loadUserData, saveUserData } from "../sdk/sdk.js";

const globalSaveKey = 'saves_020017';

let timeThreshold = 0;
let timeout = false;

function save(key, obj) {
    for (let i = 0; i < savesList.length; i++) {
        const element = savesList[i];
        const keys = Object.keys(element);

        if (keys.length > 0 && keys[0] == key) {
            if (obj === savesList[i][key]) return;
            savesList[i][key] = obj;

            sendToServer();
            return;
        }
    }

    savesList.push({ [key]: obj });

    sendToServer();
}

function load(key, defaultValue) {

    for (let i = 0; i < savesList.length; i++) {
        const element = savesList[i];

        const keys = Object.keys(element);

        if (keys.length > 0 && keys[0] == key) {
            return element[key];
        }
    }

    return defaultValue;
}

function sendToServer() {

    if (timeout) return;

    if (timeThreshold > 0) {
        setTimeout(() => {
            timeThreshold = 0;
            timeout = false;
            sendToServer();
        }, timeThreshold);
        timeout = true;
        return;
    }

    const saveObject = { [globalSaveKey]: savesList };

    log(`Send to server: ${JSON.stringify(saveObject)}`, "saveSystem");

    saveUserData(saveObject);

    timeThreshold = 500;
}

function loadFromServer(data) {
    log('[SS] Try load from server', "saveSystem");
    log(typeof (data), "saveSystem");
    log(data, "saveSystem");

    if (data == {}) {
        savesList = [];
        return;
    }
    if (typeof (data) == 'object') {
        if (data[globalSaveKey] != null) {
            savesList = data[globalSaveKey];
            return;
        }
        savesList = [];
        return;
    }

    const json = JSON.parse(data);
    log(`[SS] receive ${json}`, "saveSystem");

    if (json[globalSaveKey] == null || json[globalSaveKey] == undefined) {
        return;
    }

    log(`[SS] assign ${json[globalSaveKey]}`, "saveSystem");
    savesList = json[globalSaveKey];
}

async function initialize() {
    const serverData = await loadUserData(globalSaveKey);
    loadFromServer(serverData);
}

export { save, load, initialize }