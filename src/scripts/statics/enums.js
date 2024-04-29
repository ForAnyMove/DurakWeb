const Suit = {
    Spades: "spades",
    Diamonds: "diamonds",
    Clubs: "clubs",
    Hearts: "hearts"
}

const Rank = {
    Ace: 1,
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9,
    Ten: 10,
    Jack: 11,
    Queen: 12,
    King: 13
}

const RanksStringList = ['ace', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king'];
const SuitsStringList = ['spades', 'diamonds', 'clubs', 'hearts'];

const CardSide = {
    Back: 0,
    Face: 1
}

const Pattern = {
    Spider: "spider",
    SpiderLady: "spiderLady"
}

const ContentType = {
    CardSkin: "cardSkin",
    CardBack: "cardBack",
    Background: "background"
}

const SuitMode = {
    OneSuit: "oneSuit",
    TwoSuits: "twoSuits",
    FourSuits: "fourSuits",
}

const Rule = {
    OneSuitSpider: {
        Pattern: Pattern.Spider,
        SuitMode: SuitMode.OneSuit
    },
    TwoSuitsSpider: {
        Pattern: Pattern.Spider,
        SuitMode: SuitMode.TwoSuits
    },
    FourSuitsSpider: {
        Pattern: Pattern.Spider,
        SuitMode: SuitMode.FourSuits
    },
    OneSuitSpiderLady: {
        Pattern: Pattern.SpiderLady,
        SuitMode: SuitMode.OneSuit
    },
    TwoSuitsSpiderLady: {
        Pattern: Pattern.SpiderLady,
        SuitMode: SuitMode.TwoSuits
    },
    FourSuitsSpiderLady: {
        Pattern: Pattern.SpiderLady,
        SuitMode: SuitMode.FourSuits
    },
}

const Statefull = {
    Equipped: "equipped",
    AvailableToEquip: "availableToEquip",
    Locked: "locked",
    Unlocked: "unlocked",
}

const LevelState = {
    Locked: "locked",
    Unclocked: "unlocked",
    Completed: "completed",
}

const LevelResult = {
    Win: "win",
    Lose: "lose",
    Restart: "restart",
    Exit: "exit"
}

const LevelType = {
    Default: "default",
    Story: "story",
    Trial: "trial",
}


export { Statefull, LevelResult, LevelType, LevelState, Suit, Pattern, SuitMode, Rule, ContentType, Rank, CardSide, RanksStringList, SuitsStringList }