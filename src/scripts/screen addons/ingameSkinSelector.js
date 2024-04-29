import { initialLocale } from "../../localization/translator.js";
import { backSkinDatabase, backgroundDatabase, skinDatabase } from "../data/card_skin_database.js"
import { createButton, createElement, createImage, createTextP, createTextSpan, getInputElements } from "../helpers.js";
import { ContentType, Statefull } from "../statics/enums.js"

const checkIconPath = '../../Sprites/Icons/Icon_Check.png'
const lockIconPath = '../../Sprites/Icons/Icon_Lock.png'

const skinParent = document.getElementById('skins-collection-slider');

let instances = [];

function createBackgroundInstance(data) {
    let state = Statefull.Locked;

    if (user.hasContent(data.id)) {
        state = Statefull.AvailableToEquip;
    }
    if (user.hasUsedContent(data.id)) {
        state = Statefull.Equipped;
    }
    const plane = createElement('div', ['background-card'], {
        backgroundImage: `url(../../${data.itemPreviewPath})`
    });

    if (state == Statefull.Locked) {
        createImage(['lock-icon'], null, plane, lockIconPath);
        const requirementTextContainer = createElement('div', ['lock-mask'], null, plane);
        const unlockDescription = createTextP(['mask-title'], null, requirementTextContainer, '');
        unlockDescription.lang = data.unlockDescription;
    } else {
        const useButton = createButton(['start-level-btn'], null, plane, () => {
            user.useContent(data.id);
        });

        input.selectableElements.push({
            element: useButton, onSubmit: () => {
                input.select(input.selectableElements[3]);
            }
        });
        useButton.id = 'play-btn';
        const useText = createTextSpan(['start-level-btn-title'], null, useButton, 'Использовать');
        useText.lang = 'use'
        if (state != Statefull.AvailableToEquip) {
            useButton.classList.add('hidden');
        }
        const usedIcon = createImage(['check-icon'], null, plane, checkIconPath);
        if (state != Statefull.Equipped) {
            usedIcon.classList.add('hidden');
        }
        user.contentUsageChanged.addListener(() => {
            if (user.hasUsedContent(data.id) && !useButton.classList.contains('hidden')) {
                useButton.classList.add('hidden');
                usedIcon.classList.remove('hidden');
            } else if (!user.hasUsedContent(data.id) && !usedIcon.classList.contains('hidden')) {
                useButton.classList.remove('hidden');
                usedIcon.classList.add('hidden');
            }
        });
    }

    return plane;
}

function createSkinInstance(data) {
    let state = Statefull.Locked;

    if (user.hasContent(data.id)) {
        state = Statefull.AvailableToEquip;
    }
    if (user.hasUsedContent(data.id)) {
        state = Statefull.Equipped;
    }
    const plane = createElement('div', ['skin-card']);
    const preview = createImage(['card-skin'], null, plane, '../../' + data.previewPath);

    if (state == Statefull.Locked) {
        preview.classList.add('tonned');

        createImage(['lock-icon'], null, plane, lockIconPath);
        const requirementTextContainer = createElement('div', ['lock-mask'], null, plane);
        const unlockDescription = createTextP(['mask-title'], null, requirementTextContainer, '');
        unlockDescription.lang = data.unlockDescription;
    } else {
        const useButton = createButton(['start-level-btn'], null, plane, () => {
            user.useContent(data.id);
        });

        input.selectableElements.push({
            element: useButton, onSubmit: () => {
                input.select(input.selectableElements[1]);
            }
        });

        useButton.id = 'play-btn';
        const useText = createTextSpan(['start-level-btn-title'], null, useButton, 'Использовать');
        useText.lang = 'use';
        if (state != Statefull.AvailableToEquip) {
            useButton.classList.add('hidden');
        }
        const usedIcon = createImage(['check-icon'], null, plane, checkIconPath);
        if (state != Statefull.Equipped) {
            usedIcon.classList.add('hidden');
        }
        user.contentUsageChanged.addListener(() => {
            if (user.hasUsedContent(data.id) && !useButton.classList.contains('hidden')) {
                useButton.classList.add('hidden');
                usedIcon.classList.remove('hidden');
            } else if (!user.hasUsedContent(data.id) && !usedIcon.classList.contains('hidden')) {
                useButton.classList.remove('hidden');
                usedIcon.classList.add('hidden');
            }
        });
    }

    return plane;
}

function createSkinBackInstance(data) {
    let state = Statefull.Locked;

    if (user.hasContent(data.id)) {
        state = Statefull.AvailableToEquip;
    }
    if (user.hasUsedContent(data.id)) {
        state = Statefull.Equipped;
    }
    const plane = createElement('div', ['skin-card-back'], {
        backgroundImage: `url(../../${data.previewPath})`,
        backgroundSize: '100% 100%'
    });

    if (state == Statefull.Locked) {
        createImage(['lock-icon'], null, plane, lockIconPath);
        const requirementTextContainer = createElement('div', ['lock-mask'], null, plane);
        const unlockDescription = createTextP(['mask-title'], null, requirementTextContainer, '');
        unlockDescription.lang = data.unlockDescription;
    } else {
        const useButton = createButton(['start-level-btn'], null, plane, () => {
            user.useContent(data.id);
        });
        useButton.id = 'play-btn';
        const useText = createTextSpan(['start-level-btn-title'], null, useButton, 'Использовать');
        useText.lang = 'use';
        if (state != Statefull.AvailableToEquip) {
            useButton.classList.add('hidden');
        }

        input.selectableElements.push({
            element: useButton, onSubmit: () => {
                input.select(input.selectableElements[2]);
            }
        });

        const usedIcon = createImage(['check-icon'], null, plane, checkIconPath);
        if (state != Statefull.Equipped) {
            usedIcon.classList.add('hidden');
        }
        user.contentUsageChanged.addListener(() => {
            if (user.hasUsedContent(data.id) && !useButton.classList.contains('hidden')) {
                useButton.classList.add('hidden');
                usedIcon.classList.remove('hidden');
            } else if (!user.hasUsedContent(data.id) && !usedIcon.classList.contains('hidden')) {
                useButton.classList.remove('hidden');
                usedIcon.classList.add('hidden');
            }
        });
    }

    return plane;
}

function createCardSkins() {
    for (let i = 0; i < skinDatabase.skinList.length; i++) {
        const data = skinDatabase.skinList[i];
        const instance = createSkinInstance(data);
        skinParent.appendChild(instance);

        instances.push(instance);
    }
}

function createCardBacks() {
    for (let i = 0; i < backSkinDatabase.skinList.length; i++) {
        const data = backSkinDatabase.skinList[i];
        const instance = createSkinBackInstance(data);
        skinParent.appendChild(instance);

        instances.push(instance);
    }
}

function createBackgrounds() {
    for (let i = 0; i < backgroundDatabase.skinList.length; i++) {
        const data = backgroundDatabase.skinList[i];
        const instance = createBackgroundInstance(data);
        skinParent.appendChild(instance);

        instances.push(instance);
    }
}

skinParent.addEventListener("wheel", function (e) {
    if (e.deltaY > 0) {
        skinParent.scrollLeft += 100;
        e.preventDefault();
    }
    else {
        skinParent.scrollLeft -= 100;
        e.preventDefault();
    }
});

const backButton = document.getElementById('skins-collection-back-btn');

function closePopup() {
    for (let i = 0; i < instances.length; i++) {
        const element = instances[i];
        element.remove();
    }

    instances = [];
}

function openPopup(contentType) {
    switch (contentType) {
        case ContentType.CardSkin:
            createCardSkins();
            break;
        case ContentType.CardBack:
            createCardBacks();
            break;
        case ContentType.Background:
            createBackgrounds();
            break;
    }

    input.updateQueryCustom(getInputElements(skinParent, { tags: ['button'] }).concat({ element: backButton }), { element: backButton });

    setTimeout(() => {
        dynamicFontChanger.updateElementsPull();
        languageChangeEvent?.invoke(initialLocale);
    }, 100)
}

export { openPopup, closePopup }

// openPopup(ContentType.CardSkin);