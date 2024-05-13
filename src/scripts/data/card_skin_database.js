import { Content } from "../statics/staticValues.js";

const skinDatabase = {
    skinList: [
        {
            id: Content.CardSkin01,
            previewPath: "Sprites/Card Skins/Preview/Skin_01.png",
            itemPreviewPath: "Sprites/Card Skins/Preview/Skin_01.png",
            unlockDescription: ""
        },
        {
            id: Content.CardSkin02,
            previewPath: "Sprites/Card Skins/Preview/Skin_02.png",
            itemPreviewPath: "Sprites/Card Skins/Preview/Skin_02.png",
            unlockDescription: ""
        },
        {
            id: Content.CardSkin03,
            previewPath: "Sprites/Card Skins/Preview/Skin_03.png",
            itemPreviewPath: "Sprites/Card Skins/Preview/Skin_03.png",
            unlockDescription: "content_unlock_descr{1}"
        },
        {
            id: Content.CardSkin04,
            previewPath: "Sprites/Card Skins/Preview/Skin_04.png",
            itemPreviewPath: "Sprites/Card Skins/Preview/Skin_04.png",
            unlockDescription: "content_unlock_descr{7}"
        },
        {
            id: Content.CardSkin05,
            previewPath: "Sprites/Card Skins/Preview/Skin_05.png",
            itemPreviewPath: "Sprites/Card Skins/Preview/Skin_05.png",
            unlockDescription: "content_unlock_descr{13}"
        },
    ]
}

function getSkinImage(content, suit, rank) {
    for (let i = 0; i < skinDatabase.skinList.length; i++) {
        const element = skinDatabase.skinList[i];
        const index = i + 1;

        if (element.id.id == content.id) {
            return `url('../../Sprites/Card Skins/Release/Skin_${(index > 9 ? index : `0${index}`)}/${rank}_${suit}_${(index > 9 ? index : `0${index}`)}.png')`
        }
    }
}

function getSkinImageCleanPath(content, suit, rank) {
    for (let i = 0; i < skinDatabase.skinList.length; i++) {
        const element = skinDatabase.skinList[i];
        const index = i + 1;

        if (element.id.id == content.id) {
            return `Sprites/Card Skins/Release/Skin_${(index > 9 ? index : `0${index}`)}/${rank}_${suit}_${(index > 9 ? index : `0${index}`)}.png`
        }
    }
}

const backSkinDatabase = {
    skinList: [
        {
            id: Content.CardBackSkin01,
            previewPath: "Sprites/CardBacks/Card_Back_01.png",
            itemPreviewPath: "Sprites/CardBacks/Card_Back_01.png",
            unlockDescription: ""
        },
        {
            id: Content.CardBackSkin02,
            previewPath: "Sprites/CardBacks/Card_Back_02.png",
            itemPreviewPath: "Sprites/CardBacks/Card_Back_02.png",
            unlockDescription: ""
        },
        {
            id: Content.CardBackSkin03,
            previewPath: "Sprites/CardBacks/Card_Back_03.png",
            itemPreviewPath: "Sprites/CardBacks/Card_Back_03.png",
            unlockDescription: "content_unlock_descr{3}"
        },
        {
            id: Content.CardBackSkin04,
            previewPath: "Sprites/CardBacks/Card_Back_04.png",
            itemPreviewPath: "Sprites/CardBacks/Card_Back_04.png",
            unlockDescription: "content_unlock_descr{9}"
        },
        {
            id: Content.CardBackSkin05,
            previewPath: "Sprites/CardBacks/Card_Back_05.png",
            itemPreviewPath: "Sprites/CardBacks/Card_Back_05.png",
            unlockDescription: "content_unlock_descr{15}"
        }
    ]
}

function getSkinBackImage(content) {
    for (let i = 0; i < backSkinDatabase.skinList.length; i++) {
        const element = backSkinDatabase.skinList[i];
        if (element.id.id == content.id) {
            return `url(../../${element.previewPath})`;
        }
    }
}

const backgroundDatabase = {
    skinList: [
        {
            id: Content.Background01,
            previewPath: "Sprites/Backgrounds/Preview/Background_01.png",
            itemPreviewPath: "Sprites/Backgrounds/Preview/Background_01.png",
            unlockDescription: ""
        },
        {
            id: Content.Background02,
            previewPath: "Sprites/Backgrounds/Preview/Background_02.png",
            itemPreviewPath: "Sprites/Backgrounds/Preview/Background_02.png",
            unlockDescription: ""
        },
        {
            id: Content.Background03,
            previewPath: "Sprites/Backgrounds/Preview/Background_03.png",
            itemPreviewPath: "Sprites/Backgrounds/Preview/Background_03.png",
            unlockDescription: "content_unlock_descr{5}"
        },
        {
            id: Content.Background04,
            previewPath: "Sprites/Backgrounds/Preview/Background_04.png",
            itemPreviewPath: "Sprites/Backgrounds/Preview/Background_04.png",
            unlockDescription: "content_unlock_descr{11}"
        },
        {
            id: Content.Background05,
            previewPath: "Sprites/Backgrounds/Preview/Background_05.png",
            itemPreviewPath: "Sprites/Backgrounds/Preview/Background_05.png",
            unlockDescription: "content_unlock_descr{17}"
        }
    ]
}


function getBackgroundImage(content) {
    for (let i = 0; i < backgroundDatabase.skinList.length; i++) {
        const element = backgroundDatabase.skinList[i];
        if (element.id.id == content.id) {
            return `url(../../${element.previewPath})`;
        }
    }
}

export { skinDatabase, backSkinDatabase, backgroundDatabase, getSkinImage, getSkinBackImage, getBackgroundImage, getSkinImageCleanPath }