import { disablePreloader, enablePreloader } from '../../loader/loader.js';

const navagationDuration = 0.2;

class ScreenParameters {
    constructor() {
        this.defaultSelectedElement = null;
        this.selectableElements = [];
        this.openCallback = null;
    }
}

class Screen {
    constructor(options = { style, isPopup, isMain, element, openButtons, closeButtons, onFocus, onUnfocus, screenParameters }) {
        this.style = options.style;
        this.screenParameters = options.screenParameters;
        this.element = options.element;
        this.closeButtons = options.closeButtons;
        this.openButtons = options.openButtons;

        this.onFocus = options.onFocus;
        this.onUnfocus = options.onUnfocus;

        this.isMain = options.isMain;
        this.isPopup = options.isPopup;
        this.isOpened = false;
        this.element.style.display = 'none';
        this.element.style.opacity = 0;
        this.element.style.transition = `opacity ${navagationDuration}s ease`;

        this.styleLink = null;
    }

    show = function (onShow) {

        const mainFlow = () => {
            if (!this.isPopup) {
                setTimeout(() => {
                    this.element.style.display = '';
                    setTimeout(() => {
                        this.element.style.opacity = 1;
                    }, 10)
                    onShow?.();
                    this.isOpened = true;
                }, navagationDuration * 1000)
            } else {
                this.element.style.display = '';
                setTimeout(() => {
                    this.element.style.opacity = 1;
                }, 10);
                onShow?.();
                this.isOpened = true;
            }
        }

        if (this.style != null) {
            enablePreloader();

            setTimeout(() => {
                if (this.styleLink == null) {
                    this.styleLink = document.createElement('link');
                    this.styleLink.type = 'text/css';
                    this.styleLink.rel = 'stylesheet';
                    this.styleLink.href = this.style;

                    this.styleLink.setAttribute('media', 'print');
                    this.styleLink.onload = () => {
                        this.styleLink.removeAttribute('media');
                        mainFlow();
                        disablePreloader();
                    }
                } else {
                    mainFlow();
                    disablePreloader();
                }

                document.head.appendChild(this.styleLink);
            }, 50);


        } else {
            mainFlow();
        }
    }

    hide = function (onHide) {
        this.element.style.opacity = 0;
        if (!this.element.classList.contains('hidden')) {
            setTimeout(() => {
                this.element.style.display = 'none';
                onHide?.();

                if (this.styleLink != null) {
                    this.styleLink.remove();
                }
            }, navagationDuration * 1000)
        }

        this.isOpened = false;
    }
}

class Navigation {
    constructor() {
        this.registredScreens = [];
        this.openedScreens = [];
    }

    registerScreen(screen) {
        if (this.registredScreens.includes(screen)) return false;

        this.registredScreens.push(screen);
        return true;
    }

    open = function (screen) {
        screen.show(() => {
            screen.onFocus?.()
        });
    }

    close = function (screen) {
        screen.hide(() => {
            screen.onUnfocus?.();
            if (this.openedScreens.length > 0) {
                this.openedScreens[this.openedScreens.length - 1].onFocus?.();
            }
        });
    }
}

class StackNavigation extends Navigation {
    registerScreen(screen) {
        if (super.registerScreen(screen)) {
            const navigation = this;

            if (screen.openButtons && screen.openButtons.length > 0) {
                for (let i = 0; i < screen.openButtons.length; i++) {
                    const element = screen.openButtons[i];
                    element.onclick = function () {
                        navigation.push(screen);
                    }
                }
            }

            if (screen.closeButtons && screen.closeButtons.length > 0) {
                for (let i = 0; i < screen.closeButtons.length; i++) {
                    const element = screen.closeButtons[i];
                    element.onclick = function () {
                        navigation.pop();
                    }
                }
            }
        }
    }

    push = function (screen) {
        if (this.openedScreens.includes(screen)) return;
        if (!screen.isPopup) {
            const last = this.openedScreens.pop();
            if (last != null) {
                last.hide(() => {
                    this.openedScreens.push(screen);
                    this.open(screen);
                });
                return;
            }
        }
        this.openedScreens.push(screen);
        this.open(screen);
    }

    pop = function () {
        if (this.openedScreens.length <= 0) return;

        const lastScreen = this.openedScreens[this.openedScreens.length - 1];
        if (lastScreen.isMain) return;

        this.openedScreens.pop();

        this.close(lastScreen);
    }
}

class BackActionHandler {
    constructor(input, onSigleBack, onDoubleBack) {
        this.onSigleBack = onSigleBack;
        this.onDoubleBack = onDoubleBack;

        this.timeout = null;
        this.backPressCount = 0;
        this.isFunctional = true;

        input.addGlobalKeyHandle('Escape', () => {
            this.handleBackAction();
        });
    }

    clear = function () {
        clearTimeout(this.timeout);
        this.timeout = null;
        this.backPressCount = 0;
    }

    handleSinglePress = function () {
        this.clear();

        this.onSigleBack?.();
    }

    handleDoublePress = function () {
        this.clear();

        this.onDoubleBack?.();
    }

    handleBackAction = function () {
        if (!this.isFunctional) return;
        this.backPressCount++;

        if (this.backPressCount >= 2) {
            this.handleDoublePress();
            return;
        }

        this.timeout = setTimeout(() => {
            this.handleSinglePress();
        }, 200);
    }

    stop = function () {
        this.isFunctional = false;
    }

    start = function () {
        this.isFunctional = true;
    }
}

export { StackNavigation, Screen, BackActionHandler, ScreenParameters }