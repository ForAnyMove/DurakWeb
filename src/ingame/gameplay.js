import Card from "../scripts/cardModel.js";
import { createLevel } from "../scripts/levelCreator.js";
import { CardSide, ContentType, Suit } from "../scripts/statics/enums.js";
import { Content } from "../scripts/statics/staticValues.js";

const result = createLevel();

setInterval(() => {
    if (cardModel.isFocused) {
        cardModel.unfocus();
    } else {
        cardModel.focus()
    }
}, 1000)

document.body.appendChild(cardElement);