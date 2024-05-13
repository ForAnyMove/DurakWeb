import { ContentType } from "./enums.js"

const locales = ['ru', 'en', 'de', 'hi', 'pt', 'es', 'tr'];

const Platform = {
    Desktop: 'desktop',
    Mobile: 'mobile',
    Tablet: 'tablet',
    TV: 'tv',
}

const Items = {
    Currency: "currency",
}

const IconsByItem = [
    { type: Items.Currency, url: 'Sprites/Icons/Icon_Energy.png' },
]

const Content = {
    CardSkin01: { type: ContentType.CardSkin, id: "card_skin_01" },
    CardSkin02: { type: ContentType.CardSkin, id: "card_skin_02" },
    CardSkin03: { type: ContentType.CardSkin, id: "card_skin_03" },
    CardSkin04: { type: ContentType.CardSkin, id: "card_skin_04" },
    CardSkin05: { type: ContentType.CardSkin, id: "card_skin_05" },
    CardSkin06: { type: ContentType.CardSkin, id: "card_skin_06" },
    CardSkin07: { type: ContentType.CardSkin, id: "card_skin_07" },
    CardSkin08: { type: ContentType.CardSkin, id: "card_skin_08" },
    CardSkin09: { type: ContentType.CardSkin, id: "card_skin_09" },
    //
    CardBackSkin01: { type: ContentType.CardBack, id: "card_back_skin_01" },
    CardBackSkin02: { type: ContentType.CardBack, id: "card_back_skin_02" },
    CardBackSkin03: { type: ContentType.CardBack, id: "card_back_skin_03" },
    CardBackSkin04: { type: ContentType.CardBack, id: "card_back_skin_04" },
    CardBackSkin05: { type: ContentType.CardBack, id: "card_back_skin_05" },
    CardBackSkin06: { type: ContentType.CardBack, id: "card_back_skin_06" },
    CardBackSkin07: { type: ContentType.CardBack, id: "card_back_skin_07" },
    CardBackSkin08: { type: ContentType.CardBack, id: "card_back_skin_08" },
    CardBackSkin09: { type: ContentType.CardBack, id: "card_back_skin_09" },
    //
    Background01: { type: ContentType.Background, id: "background_01" },
    Background02: { type: ContentType.Background, id: "background_02" },
    Background03: { type: ContentType.Background, id: "background_03" },
    Background04: { type: ContentType.Background, id: "background_04" },
    Background05: { type: ContentType.Background, id: "background_05" },
    Background06: { type: ContentType.Background, id: "background_06" },
    Background07: { type: ContentType.Background, id: "background_07" },
    Background08: { type: ContentType.Background, id: "background_08" },
    Background09: { type: ContentType.Background, id: "background_09" },
}

export { Items, Content, Platform, IconsByItem, locales }
