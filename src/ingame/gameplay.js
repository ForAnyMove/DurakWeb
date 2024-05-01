import Card from "../scripts/cardModel.js";
import { createLevel } from "../scripts/levelCreator.js";
import { CardSide, ContentType, Suit } from "../scripts/statics/enums.js";
import { Content } from "../scripts/statics/staticValues.js";

const result = createLevel();

let selectedFaceSkin = user.getContentOfType(ContentType.CardSkin) ?? Content.CardSkin01;
let selectedBackSkin = user.getContentOfType(ContentType.CardBack) ?? Content.CardBackSkin01;

const cardElement = document.createElement('div');

cardElement.style.backgroundSize = "100% 100%";

cardElement.id = `card_ace_spades_01`;
cardElement.classList.add('card-element');

const cardModel = new Card(Suit.Spades, 1, CardSide.Face, cardElement, 0);

cardModel.setupCardFaceImage(selectedFaceSkin);
cardModel.setupCardBackImage(selectedBackSkin);

cardElement.style.position = 'absolute';
cardElement.style.top = '50%';
cardElement.style.left = '50%';


setInterval(() => {
    if (cardModel.isFocused) {
        cardModel.unfocus();
    } else {
        cardModel.focus()
    }
}, 1000)

document.body.appendChild(cardElement);