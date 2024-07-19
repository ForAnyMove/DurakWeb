let logEnabled = false;

let logModules = [
    {
        sdk: [
            { player: false },
            { sdk: false }
        ]
    },
    { saveSystem: false },
    { achievements: false },
    { levelStarter: false },
    {
        user: [{
            details: false
        }]
    },
    { battleFlow: false },
    { audioManager: true }
]

function log(object, module, submodule) {
    if (!logEnabled) return;


    if ((hasModule(logModules, module) || (submodule != undefined && hasSubModule(logModules, module, submodule))) || module == undefined) {
        logToConsole(object);
        console.log(object)
    }
}

function error(object, module, submodule) {
    if (!logEnabled) return;

    if ((hasModule(logModules, module) || (submodule != undefined && hasSubModule(logModules, module, submodule))) || module == undefined) {
        logToConsole(object, 'error');
        console.error(object)
    }
}

function hasModule(list, module) {
    if (module == undefined) return false;
    for (let i = 0; i < list.length; i++) {
        if (Object.keys(list[i]) == module && list[i][module] == true) return true;
    }

    return false;
}

function hasSubModule(list, module, submodule) {
    if (module == undefined) return false;
    for (let i = 0; i < list.length; i++) {
        if (Object.keys(list[i]) == module && list[i][module] != undefined && hasModule(list[i][module], submodule)) return true;
    }

    return false;
}

export { log, error }