import { error, log } from "../logger.js";
import { Platform } from "../statics/staticValues.js";

function isLocalHost() {
    let host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
}

async function showRewarded(openCallback, closeCallback, rewardCallback, errorCallback) {
    if (isLocalHost()) {
        error("[showRewarded] local host usage", "sdk", "sdk");

        rewardCallback?.();
        return;
    }

    let localSDK = await getSDK();

    if (localSDK == null) {
        error("[showRewarded] SKD is not defined", "sdk", "sdk");
        return;
    }

    log('[showRewarded] Try start rewarded', "sdk", "sdk");
    localSDK.adv.showRewardedVideo({
        callbacks: {
            onOpen: () => {
                audioManager.pause(1);
                openCallback?.();
            }, onRewarded: () => {
                rewardCallback?.();
            }, onClose: () => {
                audioManager.unpause(1);
                closeCallback?.();
            }, onError: (e) => {
                errorCallback?.();
            }
        }
    });
}

async function showInterstitial(closeCallback, errorCallback) {
    if (isLocalHost()) {
        audioManager.pause(1);
        setTimeout(() => {
            audioManager.unpause(1);
        }, 5000);

        error("[showInterstitial] local host usage", "sdk", "sdk");

        closeCallback?.();
        return;
    }

    let localSDK = await getSDK();

    if (localSDK == null) {
        error("[showInterstitial] SKD is not defined", "sdk", "sdk");
        return;
    }

    const lastTime = localStorage.getItem('inter_delay');
    let canShowInterstitial = true;
    if (lastTime != null) {
        let currentTime = Date.now();

        let difference = currentTime - lastTime;

        let secs = difference / 1000;

        if (secs > 30) {
            localStorage.setItem('inter_delay', currentTime);
            canShowInterstitial = true;
        } else {
            canShowInterstitial = false;
        }
    } else {
        localStorage.setItem('inter_delay', Date.now());
    }

    if (canShowInterstitial) {
        audioManager.pause(1);
        localSDK.adv.showFullscreenAdv({
            callbacks: {
                onClose: function (wasShown) {
                    audioManager.unpause(1);
                    closeCallback?.(wasShown);
                }, onError: function (error) {
                    audioManager.unpause(1);
                    errorCallback?.(error);
                }
            }
        });
    }
}

async function processExit() {
    let localSDK = await getSDK();

    if (localSDK == null || isLocalHost()) {
        error("SKD is undefined or script launched on localhost", "sdk", "sdk");
        return;
    }

    localSDK.dispatchEvent(SDK.EVENTS.EXIT);
}

async function getPlatform() {
    let finalPlatformResult = Platform.Desktop;
    // return Platform.TV; // todo: remove

    function returnDefault() {
        const isTv = /SMART-TV|Tizen|Web0S|NetCast|HbbTV|Opera TV|CE-HTML|TV|Television/i.test(navigator.userAgent);
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isTv) {
            finalPlatformResult = Platform.TV;
        } else if (isMobile) {
            finalPlatformResult = Platform.Mobile
        }

        return finalPlatformResult;
        // return Platform.TV;
    }

    if (isLocalHost()) {
        error("[getPlatform] local host usage", "sdk", "sdk");

        return returnDefault();
    }

    let localSDK = await getSDK();

    if (localSDK == null) {
        error("[getPlatform] SKD is not defined", "sdk", "sdk");

        return returnDefault();
    }

    const mobile = YaGames.deviceInfo.isMobile();
    const tablet = YaGames.deviceInfo.isTablet();
    const tv = /SMART-TV|Tizen|Web0S|NetCast|HbbTV|Opera TV|CE-HTML|TV|Television/i.test(navigator.userAgent) || YaGames.deviceInfo.isTV();

    if (mobile) {
        finalPlatformResult = Platform.Mobile;
    } else if (tablet) {
        finalPlatformResult = Platform.Tablet
    } else if (tv) {
        finalPlatformResult = Platform.TV
    }

    return finalPlatformResult;
}

async function saveUserData(data) {
    try {
        if (isLocalHost()) {
            error("[saveUserData] local host usage", "sdk", "sdk");
            return;
        }

        let localSDK = await getSDK();
        if (localSDK == null) {
            error("[saveUserData] SKD is not defined", "sdk", "sdk");
            return;
        }

        let localPlayer = await getPlayer(localSDK);

        if (localPlayer == null) {
            error("[saveUserData] PLAYER is not defined", "sdk", "player");
            return;
        }

        log("[saveUserData] start saving", 'sdk', 'player');
        await localPlayer.setData(data);
    } catch (err) {
        error(`[saveUserData] catched error ${err}`, 'sdk', 'player');
    }
}

async function loadUserData(key) {
    try {
        if (isLocalHost()) {
            error("[loadUserData] local host usage", "sdk", "sdk");
            return { "saves_020017": [{ "language": "ru" }, { "user_01": { "items": [{ "count": 200, "type": "currency" }], "availableContent": [{ "id": "card_skin_01", "type": "cardSkin" }, { "id": "card_back_skin_01", "type": "cardBack" }, { "id": "background_01", "type": "background" }, { "id": "card_skin_02", "type": "cardSkin" }], "usedContent": [{ "id": "card_skin_01", "type": "cardSkin" }, { "id": "card_back_skin_01", "type": "cardBack" }, { "id": "background_01", "type": "background" }], "achievements": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] } }, { "game_statistics": { "draw": { "byEntityMode": [{ "count": 0, "entityMode": "Self" }, { "count": 0, "entityMode": "Pair" }], "byGameMode": [{ "count": 0, "gameMode": "DurakDefault" }, { "count": 0, "gameMode": "DurakTransfare" }], "overall": 0 }, "gameCount": { "byEntityMode": [{ "count": 0, "entityMode": "Self" }, { "count": 0, "entityMode": "Pair" }], "byGameMode": [{ "count": 0, "gameMode": "DurakDefault" }, { "count": 0, "gameMode": "DurakTransfare" }], "overall": 0 }, "ingameDayCount": 0, "loseCount": { "byEntityMode": [{ "count": 0, "entityMode": "Self" }, { "count": 0, "entityMode": "Pair" }], "byGameMode": [{ "count": 0, "gameMode": "DurakDefault" }, { "count": 0, "gameMode": "DurakTransfare" }], "overall": 0 }, "lostWithAces": 0, "maxCurrencyCollected": 200, "throwedCards": 0, "transfaredCards": 0, "winCount": { "byEntityMode": [{ "count": 0, "entityMode": "Self" }, { "count": 0, "entityMode": "Pair" }], "byGameMode": [{ "count": 0, "gameMode": "DurakDefault" }, { "count": 0, "gameMode": "DurakTransfare" }], "overall": 0 }, "winInARow": { "byEntityMode": [{ "count": 0, "entityMode": "Self" }, { "count": 0, "entityMode": "Pair" }], "byGameMode": [{ "count": 0, "gameMode": "DurakDefault" }, { "count": 0, "gameMode": "DurakTransfare" }], "overall": 0 } } }, { "day_counter": { "lastDay": 1, "time": 1718978356899 } }, { "user_avatar": 0 }, { "sound": true }, { "music": true }, { "daily_rewards": { "completion": [true, false, false, false, false, false] } }, { "tutorial-offer": true }, { "user_status_01": [true, false, false, false, false, false, false, false] }] };
        }

        let localSDK = await getSDK();
        if (localSDK == null) {
            error("[loadUserData] SKD is not defined", "sdk", "sdk");
            return {};
        }

        let localPlayer = await getPlayer(localSDK);

        if (localPlayer == null) {
            error("[loadUserData] PLAYER is not defined", "sdk", "player");
            return {};
        }

        const data = await localPlayer.getData([key]);

        return data ?? {};
    } catch (err) {
        error(`[loadUserData] catched error ${err}`, 'sdk', 'player');
    }

    return {}
}

async function getDefaultLanguage() {
    if (isLocalHost()) {
        error("[getDefaultLanguage] local host usage", "sdk", "sdk");
        return 'ru';
    }

    let localSDK = await getSDK();

    if (localSDK == null) {
        error("[getDefaultLanguage] SKD is not defined", "sdk", "sdk");
        return 'ru';
    }

    return SDK.environment.i18n.lang;
}

async function getSDK() {
    try {
        if (SDK != null) {
            log('[getSDK] Has cached SDK', "sdk", "sdk");
            return SDK;
        }

        log('[getSDK] Try initialize SDK', "sdk", "sdk");
        SDK = await YaGames.init();
        log('[getSDK] SDK has been initialized', "sdk", "sdk");
        return SDK;
    } catch (err) {
        error(`Failed to load [SDK]: ${err}`, "sdk", "sdk");
        return null;
    }
}

async function getPlayer(sdk) {
    if (sdkPlayer != null) {
        log('[getPlayer] Has cached PLAYER ' + sdkPlayer, "sdk", "player");
        return sdkPlayer;
    }
    if (sdk == null) {
        error(`Failed to get [PLAYER]: [SDK] is not defined`, "sdk", "player");
        return null;
    }

    try {
        log('[getPlayer] Try initialize PLAYER', "sdk", "player");
        sdkPlayer = await sdk.getPlayer({ scopes: false });
        log('[getPlayer] PLAYER has been initialized', "sdk", "player");
        return sdkPlayer;
    } catch (err) {
        error(`Failed to load [PLAYER]: ${err}`, "sdk", "player");
        return null;
    }
}

async function initializeSDK() {
    SDK = await getSDK();
    sdkPlayer = await getPlayer(SDK);
}

export { saveUserData, loadUserData, getPlatform, showRewarded, showInterstitial, initializeSDK, getDefaultLanguage, processExit }