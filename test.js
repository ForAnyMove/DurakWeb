import { createButton, createElement, createHSpace, createImage, createTextH3, createTextP, createTextSpan, createVSpace, getIconByContent, getIconByItem, getIconByPattern, getIconBySuit, getPatternLang, getPatternName, getSuitLang, getSuitName } from "./src/scripts/helpers.js";
import { trialLevelDatabase } from "./src/scripts/data/level_databases.js";


const openTestBtn = document.getElementById('challenge-test');
const testChallengeScreen = document.getElementById('challenges-test-screen');
const mainTab = document.getElementById('main-screen');
openTestBtn.addEventListener('click', () => {
  console.log(testChallengeScreen);
  testChallengeScreen.style.display = 'flex';
  mainTab.style.display = 'none';
});

const arrowBackBtn = document.getElementById('');
function testAdd() {
  const container = document.getElementsByClassName(
    'challenges-test-container'
  )[0];
  const testBooster = createBooster()
  for (let i = 0; i < 15; i++) {
    const challengeTestCard = document.createElement('div');
    challengeTestCard.classList.add('challenge-test-container');
    
    

    container.appendChild(challengeTestCard);
  }
}

testAdd();
