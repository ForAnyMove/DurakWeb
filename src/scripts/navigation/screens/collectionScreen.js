import { backSkinDatabase, backgroundDatabase, skinDatabase } from "../../data/card_skin_database.js";
import { Action } from "../../globalEvents.js";
import { createElement, createImage, createTextSpan, setRemoveClass } from "../../helpers.js";
import { Statefull } from "../../statics/enums.js";
import { ScreenLogic } from "../navigation.js";

class CollectionScreen extends ScreenLogic {
    constructor(parameters) {
        super(parameters);

    }

    onCreate() {
        this.defaultSelectedElement = { element: this.screenRoot.querySelector('.arrow-back-btn') }
        this.selectableElements.push(this.defaultSelectedElement);

        const skinParent = this.screenRoot.querySelector('#pick-area-1');
        const skinBackParent = this.screenRoot.querySelector('#pick-area-3');
        const backgroundParent = this.screenRoot.querySelector('#pick-area-2');

        const tabScreens = [skinParent, backgroundParent, skinBackParent];

        const unequippedIcon = './Sprites/Desktop - дурак- настройки/Group 54 4x 451329194.png'
        const equippedIcon = './Sprites/Desktop - дурак- настройки/Group 54 4x -1518726756.png'

        const lockedIcon = './Sprites/Desktop - дурак- ежедневный бону/замок 4x -1037125765.png'

        const contentStateUpdateEvent = new Action();

        const setupTabSwitch = () => {
            function changeTabsVisibility(index) {
                if (index > tabScreens.length - 1 || index < 0) return false;

                for (let i = 0; i < tabScreens.length; i++) {
                    const screen = tabScreens[i];

                    if (i == index) {
                        if (!screen.classList.contains('hidden-all')) return false;
                        screen.classList.remove('hidden-all');
                    } else if (!screen.classList.contains('hidden-all')) {
                        screen.classList.add('hidden-all');
                    }
                }

                return true;
            }
            const tabClass = 'categories-btn';
            const tabs = this.screenRoot.getElementsByClassName(tabClass);

            for (let i = 0; i < tabs.length; i++) {
                const element = tabs[i];
                this.selectableElements.push({ element: element })
                element.onclick = function () {
                    if (changeTabsVisibility(i)) {
                        for (let j = 0; j < tabs.length; j++) {
                            const element = tabs[j];
                            if (i == j && !element.classList.contains('categories-btn-title_active')) {
                                element.classList.add('categories-btn-title_active')
                            } else {
                                element.classList.remove('categories-btn-title_active')
                            }
                        }
                    }
                }
            }
        }

        const createSkinInstance = (data) => {
            const plane = createElement('div', ['skin-element', 'skin-element_skin-1'], {
                backgroundImage: `url('${data.previewPath}')`,
                backgroundSize: '100% 100%'
            });
            plane.id = data.id.id;

            createTextSpan(['collection-skin-timer'], null, plane, '');

            const lock = createImage(['skin-element_locked-icon'], null, plane, lockedIcon);
            const useButton = plane;
            useButton.onclick = () => {
                user.useContent(data.id);
            }

            audioManager.addClickableToPull(useButton);

            this.selectableElements.push({
                element: useButton
            });

            const checkbox = createImage(['checkbox-pick-icon'], null, plane, null);

            user.contentUsageChanged.addListener(() => {
                if (user.hasUsedContent(data.id) && checkbox.src != equippedIcon) {
                    checkbox.src = equippedIcon;
                } else if (!user.hasUsedContent(data.id) && checkbox.src != unequippedIcon) {
                    checkbox.src = unequippedIcon
                }
            });

            const updateState = () => {
                let state = Statefull.Locked;

                if (user.hasContent(data.id)) {
                    state = Statefull.AvailableToEquip;
                }

                if (user.hasUsedContent(data.id)) {
                    state = Statefull.Equipped;
                }

                setRemoveClass(plane, 'skin-element_locked', state == Statefull.Locked);
                setRemoveClass(lock, 'hidden-all', state != Statefull.Locked);
                setRemoveClass(checkbox, 'hidden-all', state == Statefull.Locked);

                checkbox.src = state == Statefull.Equipped ? equippedIcon : unequippedIcon;

                if (user.hasUsedContent(data.id) && checkbox.src != equippedIcon) {
                    checkbox.src = equippedIcon;
                } else if (!user.hasUsedContent(data.id) && checkbox.src != unequippedIcon) {
                    checkbox.src = unequippedIcon
                }
            }

            updateState();

            user.contentListUpdateEvent.addListener(() => {
                updateState();
            })

            return plane;
        }

        const createSkinBackInstance = (data) => {
            const plane = createElement('div', ['skin-back-element', 'skin-back-element_skin-1'], {
                backgroundImage: `url('${data.previewPath}')`,
                backgroundSize: '100% 100%'
            });
            plane.id = data.id.id;
            createTextSpan(['collection-skin-timer'], null, plane, '');

            const lock = createImage(['skin-element_locked-icon'], null, plane, lockedIcon);
            const useButton = plane;
            useButton.onclick = () => {
                user.useContent(data.id);
            }

            audioManager.addClickableToPull(useButton);

            this.selectableElements.push({
                element: useButton
            });

            const checkbox = createImage(['checkbox-pick-icon'], null, plane, null);

            user.contentUsageChanged.addListener(() => {
                if (user.hasUsedContent(data.id) && checkbox.src != equippedIcon) {
                    checkbox.src = equippedIcon;
                } else if (!user.hasUsedContent(data.id) && checkbox.src != unequippedIcon) {
                    checkbox.src = unequippedIcon
                }
            });

            const updateState = () => {
                let state = Statefull.Locked;

                if (user.hasContent(data.id)) {
                    state = Statefull.AvailableToEquip;
                }

                if (user.hasUsedContent(data.id)) {
                    state = Statefull.Equipped;
                }

                setRemoveClass(plane, 'skin-element_locked', state == Statefull.Locked);
                setRemoveClass(lock, 'hidden-all', state != Statefull.Locked);
                setRemoveClass(checkbox, 'hidden-all', state == Statefull.Locked);

                checkbox.src = state == Statefull.Equipped ? equippedIcon : unequippedIcon;

                if (user.hasUsedContent(data.id) && checkbox.src != equippedIcon) {
                    checkbox.src = equippedIcon;
                } else if (!user.hasUsedContent(data.id) && checkbox.src != unequippedIcon) {
                    checkbox.src = unequippedIcon
                }
            }

            updateState();

            user.contentListUpdateEvent.addListener(() => {
                updateState();
            })

            return plane;
        }

        const createBackgroundInstance = (data) => {
            const plane = createElement('div', ['background-element'], null);
            createElement('div', ['background-element_skin-1'], {
                backgroundImage: `url('${data.itemPreviewPath}')`,
                backgroundSize: '100% 100%'
            }, plane);
            plane.id = data.id.id;
            createTextSpan(['collection-skin-timer'], null, plane, '');

            const lock = createImage(['skin-element_locked-icon'], null, plane, lockedIcon);
            const useButton = plane;
            useButton.onclick = () => {
                user.useContent(data.id);
            }

            audioManager.addClickableToPull(useButton);

            this.selectableElements.push({
                element: useButton
            });

            const checkbox = createImage(['checkbox-pick-icon'], null, plane, null);

            user.contentUsageChanged.addListener(() => {
                if (user.hasUsedContent(data.id) && checkbox.src != equippedIcon) {
                    checkbox.src = equippedIcon;
                } else if (!user.hasUsedContent(data.id) && checkbox.src != unequippedIcon) {
                    checkbox.src = unequippedIcon
                }
            });

            const updateState = () => {
                let state = Statefull.Locked;

                if (user.hasContent(data.id)) {
                    state = Statefull.AvailableToEquip;
                }

                if (user.hasUsedContent(data.id)) {
                    state = Statefull.Equipped;
                }

                setRemoveClass(plane, 'skin-element_locked', state == Statefull.Locked);
                setRemoveClass(lock, 'hidden-all', state != Statefull.Locked);
                setRemoveClass(checkbox, 'hidden-all', state == Statefull.Locked);

                checkbox.src = state == Statefull.Equipped ? equippedIcon : unequippedIcon;

                if (user.hasUsedContent(data.id) && checkbox.src != equippedIcon) {
                    checkbox.src = equippedIcon;
                } else if (!user.hasUsedContent(data.id) && checkbox.src != unequippedIcon) {
                    checkbox.src = unequippedIcon
                }
            }

            updateState();

            user.contentListUpdateEvent.addListener(() => {
                updateState();
            })

            return plane;
        }

        const createCardSkins = () => {
            for (let i = 0; i < skinDatabase.skinList.length; i++) {
                const data = skinDatabase.skinList[i];
                skinParent.appendChild(createSkinInstance(data));
            }
        }

        function createCardBacks() {
            for (let i = 0; i < backSkinDatabase.skinList.length; i++) {
                const data = backSkinDatabase.skinList[i];
                skinBackParent.appendChild(createSkinBackInstance(data));
            }
        }

        function createBackgrounds() {
            for (let i = 0; i < backgroundDatabase.skinList.length; i++) {
                const data = backgroundDatabase.skinList[i];
                backgroundParent.appendChild(createBackgroundInstance(data));
            }
        }

        createCardSkins();
        createCardBacks();
        createBackgrounds();

        setupTabSwitch();

    }
}

export { CollectionScreen }