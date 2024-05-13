import { Items, locales } from './src/scripts/statics/staticValues.js';
import { inDayGameCount } from './src/scripts/ingameDayCounter.js';
import {
  dailyRewards,
  isCompleted,
  tryCompleteDailyReward,
} from './src/scripts/dailyRewards.js';
import { showRewarded } from './src/scripts/sdk/sdk.js';
import('./src/scripts/rewardReceiverView.js');

import DirectionalInput from './src/scripts/directionInput.js';
import DynamicFontChanger from './src/localization/dynamicFontChanger.js';
import { createElement, getInputElements } from './src/scripts/helpers.js';
import { BackActionHandler, Screen, ScreenParameters } from './src/scripts/navigation/navigation.js';
import { load, save } from './src/scripts/save_system/SaveSystem.js';
import { CollectionScreen } from './src/scripts/navigation/screens/collectionScreen.js';
import { AchievementsScreen } from './src/scripts/navigation/screens/achievementsScreen.js';
import { BonusesScreen } from './src/scripts/navigation/screens/bonusesScreen.js';
import { SettingsScreen } from './src/scripts/navigation/screens/settingsScreen.js';
import { ProfileScreen } from './src/scripts/navigation/screens/profileScreen.js';

input ??= new DirectionalInput();

const screenParameters = new ScreenParameters();
screenParameters.defaultSelectedElement = { element: document.getElementsByClassName('play-btn')[0] };
screenParameters.selectableElements = getInputElements(document.getElementsByClassName('main-tab')[0], { tags: ['button'] })

const mainScreen = new Screen({
  isMain: true,
  element: document.getElementsByClassName('main-tab')[0],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(screenParameters.selectableElements, screenParameters.defaultSelectedElement);
  },
  onUnfocus: () => { }
})

const collectionRoot = document.getElementById('skins-tab');
const collectionScreen = new Screen({
  element: collectionRoot,
  openButtons: mainScreen.element.querySelectorAll('.skins-tab-open-button'),
  closeButtons: collectionRoot.querySelectorAll('.skins-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(collectionScreen.screenLogic.selectableElements,
      collectionScreen.screenLogic.defaultSelectedElement);

    setTimeout(() => {
      dynamicFontChanger.updateTextFont();
    }, 100);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: new CollectionScreen({ screenRoot: collectionRoot })
})

const achievementsRoot = document.getElementById('achievements-tab');
const achievementsScreen = new Screen({
  element: achievementsRoot,
  openButtons: mainScreen.element.querySelectorAll('.achievements-tab-open-button'),
  closeButtons: achievementsRoot.querySelectorAll('.achievements-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(achievementsScreen.screenLogic.selectableElements,
      achievementsScreen.screenLogic.defaultSelectedElement);

    setTimeout(() => {
      dynamicFontChanger.updateTextFont();
    }, 100);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: new AchievementsScreen({ screenRoot: achievementsRoot })
})

const bonusesRoot = document.getElementById('bonuses-tab');
const bonusesScreen = new Screen({
  element: bonusesRoot,
  openButtons: mainScreen.element.querySelectorAll('.bonuses-tab-open-button'),
  closeButtons: bonusesRoot.querySelectorAll('.bonuses-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(bonusesScreen.screenLogic.selectableElements,
      bonusesScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: new BonusesScreen({ screenRoot: bonusesRoot })
});

const profileRoot = document.getElementById('profile-tab');
const profileScreen = new Screen({
  element: profileRoot,
  openButtons: mainScreen.element.querySelectorAll('.profile-tab-open-button'),
  closeButtons: profileRoot.querySelectorAll('.profile-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(profileScreen.screenLogic.selectableElements,
      profileScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: new ProfileScreen()
});

const profileAvatarRoot = document.getElementById('choose-avatar-tab');
const profileAvatarScreen = new Screen({
  element: profileAvatarRoot,
  openButtons: profileRoot.querySelectorAll('.choose-avatar-tab-open-button'),
  closeButtons: profileAvatarRoot.querySelectorAll('.choose-avatar-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(profileScreen.screenLogic.selectableElements,
      profileScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
    navigation.push(profileScreen);
  },
  screenLogic: new ProfileScreen()
});

const settingsRoot = document.getElementById('settings-tab');
const settingsScreen = new Screen({
  element: settingsRoot,
  openButtons: mainScreen.element.querySelectorAll('.settings-tab-open-button'),
  closeButtons: settingsRoot.querySelectorAll('.settings-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(settingsScreen.screenLogic.selectableElements,
      settingsScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: new SettingsScreen()
});

const gameSelectionRoot = document.getElementById('start-game-tab');
const gameSelectionScreen = new Screen({
  element: gameSelectionRoot,
  openButtons: mainScreen.element.querySelectorAll('.start-game-tab-open-button'),
  closeButtons: gameSelectionRoot.querySelectorAll('.start-game-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(gameSelectionScreen.screenLogic.selectableElements,
      gameSelectionScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: null
});

const exitPopupRoot = document.getElementById('exit-popup-tab');
const exitScreen = new Screen({
  element: exitPopupRoot,
  closeButtons: [exitPopupRoot.querySelector('.exit-no')],
  onFocus: () => {
    dynamicFontChanger.update();
    const elements = getInputElements(exitScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[1]);
  }, onUnfocus: () => {
    navigation.push(mainScreen);
  }
});

const tutorialPopupRoot = document.getElementById('tutorial-popup-tab');
const tutorialOffsetScreen = new Screen({
  element: tutorialPopupRoot,
  closeButtons: [tutorialPopupRoot.querySelector('.no')],
  onFocus: () => {
    dynamicFontChanger.update();
    const elements = getInputElements(tutorialOffsetScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[0]);
  }, onUnfocus: () => {
    navigation.push(mainScreen);
  }
});

const exitButton = exitScreen.element.getElementsByClassName('exid-yes')[0];
if (exitButton != null) {
  exitButton.onclick = function () { SDK?.dispatchEvent(SDK.EVENTS.EXIT); }
}

navigation.registerScreen(achievementsScreen);
navigation.registerScreen(collectionScreen);
navigation.registerScreen(profileScreen);
navigation.registerScreen(gameSelectionScreen);
navigation.registerScreen(profileAvatarScreen);

navigation.registerScreen(bonusesScreen);
navigation.registerScreen(settingsScreen);
navigation.registerScreen(exitScreen);
navigation.registerScreen(tutorialOffsetScreen);

// if (load('tutorial-offer', false) == false) {
//   tutorialPopupRoot.querySelector('.yes').onclick = function () {
//     window.location.href = './src/playground/playground.html?levelID=level_def_s_1&isTutorial=true';
//   }

//   setTimeout(() => { navigation.push(tutorialOffsetScreen) }, 400)
//   save('tutorial-offer', true);
// }

navigation.push(mainScreen);

backActionHandler = new BackActionHandler(input, () => {
  navigation.pop();
}, () => {
  navigation.push(exitScreen);
});

// function setupReqularBonusesButtons() {
//   const itemCountPairs = [
//     { item: Items.Energy, count: 5 },
//     { item: Items.BoosterHint, count: 4 },
//     { item: Items.BoosterMage, count: 2 },
//     { item: Items.BoosterUndo, count: 5 },
//     { item: Items.BoosterTime, count: 1 },
//   ];

//   const buttons = document
//     .getElementsByClassName('regular-boosters-container')[0]
//     .getElementsByClassName('start-level-btn');

//   for (let i = 0; i < buttons.length; i++) {
//     const button = buttons[i];
//     button.onclick = function () {
//       showRewarded(
//         null,
//         null,
//         () => user.addItem(itemCountPairs[i].item, itemCountPairs[i].count, { isTrue: true, isMonetized: false }),
//         null
//       );
//     };
//   }
// }
// setupReqularBonusesButtons();

// const dayInGame = inDayGameCount();

// function setupDailyRewards() {
//   const commonDays = document
//     .getElementsByClassName('daily-boosters-container')[0]
//     .getElementsByClassName('booster');
//   const allDays = [];

//   for (let i = 0; i < commonDays.length; i++) {
//     const element = commonDays[i];
//     allDays.push(element);
//   }

//   allDays.push(document.getElementsByClassName('special-booster')[0]);

//   for (let i = 0; i < allDays.length; i++) {
//     const element = allDays[i];

//     if (isCompleted(i)) {
//       element.classList.add('completed');
//       continue;
//     }

//     if (dayInGame - 1 >= i) {
//       // dailyBonuses.style.display = 'flex'; // if tutorial popup was showen and just once per session
//       element.classList.add('ready');
//       element.onclick = function () {
//         if (tryCompleteDailyReward(i)) {
//           element.classList.remove('ready');
//           element.classList.add('completed');

//           if (typeof dailyRewards[i].item == 'object') {
//             const items = [];
//             for (let j = 0; j < dailyRewards[i].item.length; j++) {
//               const element = dailyRewards[i].item[j];
//               items.push({ type: element.item, count: element.count })
//             }
//             user.addItems(items, { isTrue: true, isMonetized: true });
//           } else {
//             user.addItem(dailyRewards[i].item, dailyRewards[i].count, { isTrue: true, isMonetized: true });
//           }
//         }
//       };

//       audioManager.addClickableToPull(element);
//     }
//   }
// }
// setupDailyRewards();

// function setupLanguageSelector(initialLocale) {
//   const selectors = document.getElementsByClassName('language-container');

//   const languageSelectorStructs = [];

//   for (let i = 0; i < selectors.length; i++) {
//     const selector = selectors[i];
//     const check = selector.getElementsByClassName('accept-checkbox-icon')[0];

//     const selectorStruct = {
//       locale: locales[i],
//       selector: selector,
//       check: check,
//       select: () => {
//         for (let j = 0; j < languageSelectorStructs.length; j++) {
//           const element = languageSelectorStructs[j];
//           if (element == selectorStruct) {
//             element.check.classList.remove('hidden');
//           } else if (!element.check.classList.contains('hidden')) {
//             element.check.classList.add('hidden');
//           }
//         }

//         languageChangeEvent.invoke(selectorStruct.locale);
//       }
//     };

//     selector.onclick = () => {
//       selectorStruct.select();
//     };
//     audioManager.addClickableToPull(selector);

//     languageSelectorStructs.push(selectorStruct)
//   }

//   for (let i = 0; i < languageSelectorStructs.length; i++) {
//     const element = languageSelectorStructs[i];
//     if (element.locale == initialLocale) {
//       element.select();
//       break;
//     }
//   }
// }


// export { setupLanguageSelector }
dynamicFontChanger = new DynamicFontChanger();