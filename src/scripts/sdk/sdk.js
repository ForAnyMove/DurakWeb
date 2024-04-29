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

    SDK = await getSDK();

    if (SDK == null) {
        error("[showRewarded] SKD is not defined", "sdk", "sdk");
        return;
    }

    log('[showRewarded] Try start rewarded', "sdk", "sdk");
    SDK.adv.showRewardedVideo({
        callbacks: {
            onOpen: () => {
                audioManager.pause();
                openCallback?.();
            }, onRewarded: () => {
                rewardCallback?.();
            }, onClose: () => {
                audioManager.unpause();
                closeCallback?.();
            }, onError: (e) => {
                errorCallback?.();
            }
        }
    });
}

async function showInterstitial(closeCallback, errorCallback) {
    if (isLocalHost()) {
        error("[showInterstitial] local host usage", "sdk", "sdk");

        closeCallback?.();
        return;
    }

    SDK = await getSDK();

    if (SDK == null) {
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
        SDK.adv.showFullscreenAdv({
            callbacks: {
                onClose: function (wasShown) {
                    closeCallback?.(wasShown);
                }, onError: function (error) {
                    errorCallback?.(error);
                }
            }
        });
    }
}

function processExit() {
    if (SDK == null || isLocalHost()) {
        error("SKD is undefined or script launched on localhost", "sdk", "sdk");
        return;
    }

    SDK.dispatchEvent(SDK.EVENTS.EXIT);
}

async function getPlatform() {
    let finalPlatformResult = Platform.Desktop;

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

    SDK = await getSDK();

    if (SDK == null) {
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

        SDK = await getSDK();
        if (SDK == null) {
            error("[saveUserData] SKD is not defined", "sdk", "sdk");
            return;
        }

        player = await getPlayer(SDK);

        if (player == null) {
            error("[saveUserData] PLAYER is not defined", "sdk", "player");
            return;
        }

        console.log("[saveUserData] start saving", 'sdk', 'player');
        player.setData(data);
    } catch (err) {
        error(`[saveUserData] catched error ${err}`, 'sdk', 'player');
    }
}

async function loadUserData(key) {
    try {
        if (isLocalHost()) {
            error("[loadUserData] local host usage", "sdk", "sdk");
            return {};
        }

        SDK = await getSDK();
        if (SDK == null) {
            error("[loadUserData] SKD is not defined", "sdk", "sdk");
            return {};
        }

        player = await getPlayer(SDK);

        if (player == null) {
            error("[loadUserData] PLAYER is not defined", "sdk", "player");
            return {};
        }

        const data = await player.getData([key]);
        log(`[loadUserData] data from server => ${data}`, "sdk", "player");

        return data ?? {};
    } catch (err) {
        error(`[loadUserData] catched error ${err}`, 'sdk', 'player');
    }
}

async function getDefaultLanguage() {
    if (isLocalHost()) {
        error("[getDefaultLanguage] local host usage", "sdk", "sdk");
        return 'ru';
    }

    SDK = await getSDK();

    if (SDK == null) {
        error("[getDefaultLanguage] SKD is not defined", "sdk", "sdk");
        return 'ru';
    }

    return SDK.environment.i18n.lang;
}

async function getSDK() {
    try {
        if (SDK != null) {
            console.log('[getSDK] Has cached SDK');
            return SDK;
        }

        console.log('[getSDK] Try initialize SDK');
        SDK = await YaGames.init();
        console.log('[getSDK] SDK has been initialized');
        return SDK;
    } catch (err) {
        error(`Failed to load [SDK]: ${err}`, "sdk", "sdk");
        return null;
    }
}

async function getPlayer(sdk) {
    if (player != null) {
        console.log('[getPlayer] Has cached PLAYER');
        return player;
    }
    if (sdk == null) {
        error(`Failed to get [PLAYER]: [SDK] is not defined`, "sdk", "player");
        return null;
    }

    try {
        console.log('[getPlayer] Try initialize PLAYER');
        player = await sdk.getPlayer({ scopes: false });
        console.log('[getPlayer] PLAYER has been initialized');
        return player;
    } catch (err) {
        error(`Failed to load [PLAYER]: ${err}`, "sdk", "player");
        return null;
    }
}

async function initializeSDK() {
    SDK = await getSDK();
    player = await getPlayer(SDK);
}

export { saveUserData, loadUserData, getPlatform, showRewarded, showInterstitial, initializeSDK, getDefaultLanguage }