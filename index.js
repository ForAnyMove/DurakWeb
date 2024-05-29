import('./src/scripts/rewardReceiverView.js');

import { Items, Platform, locales } from './src/scripts/statics/staticValues.js';
import { inDayGameCount } from './src/scripts/ingameDayCounter.js';
import {
  dailyRewards,
  isCompleted,
  tryCompleteDailyReward,
} from './src/scripts/dailyRewards.js';
import { load, save } from './src/scripts/save_system/SaveSystem.js';

import DirectionalInput from './src/scripts/directionInput.js';
import DynamicFontChanger from './src/localization/dynamicFontChanger.js';
import { getInputElements } from './src/scripts/helpers.js';
import { BackActionHandler, Screen } from './src/scripts/navigation/navigation.js';
import { CollectionScreen } from './src/scripts/navigation/screens/collectionScreen.js';
import { AchievementsScreen } from './src/scripts/navigation/screens/achievementsScreen.js';
import { BonusesScreen } from './src/scripts/navigation/screens/bonusesScreen.js';
import { SettingsScreen } from './src/scripts/navigation/screens/settingsScreen.js';
import { ProfileScreen } from './src/scripts/navigation/screens/profileScreen.js';
import { GameSettingsScreen } from './src/scripts/navigation/screens/gameSettingsScreen.js';
import { AvatarSelectionScreen } from './src/scripts/navigation/screens/avatarSelectionScreen.js';
import { MainScreen } from './src/scripts/navigation/screens/mainScreen.js';
import { DailyBonusesScreen } from './src/scripts/navigation/screens/dailyBonusesScreen.js';
import { LanguageSelectionScreen } from './src/scripts/navigation/screens/languageSelectionScreen.js';
import { RewardReceiveScreen } from './src/scripts/navigation/screens/rewardReceiveScreen.js';
import { PlaygroundScreen } from './src/scripts/navigation/screens/playgroundScreen.js';
import { GameFinishScreen } from './src/scripts/navigation/screens/gameFinishScreen.js';
import { ExitGameScreen } from './src/scripts/navigation/screens/exitGameScreen.js';
import { GlobalExitGameScreen } from './src/scripts/navigation/screens/globalGameExitScreen.js';

input ??= new DirectionalInput();

const mainScreenRoot = document.getElementsByClassName('main-tab')[0];
const mainScreen = new Screen({
  id: 'main',
  isMain: true,
  element: mainScreenRoot,
  onFocus: () => {
    dynamicFontChanger.update();
    if (!input.loadBackup())
      input.updateQueryCustom(mainScreen.screenLogic.selectableElements, mainScreen.screenLogic.defaultSelectedElement);

    input.clearSavedState('tv-gameplay');
    navigation.registerScreen(achievementsScreen);
    navigation.registerScreen(collectionScreen);
    navigation.registerScreen(profileScreen);
    navigation.registerScreen(gameSelectionScreen);
    navigation.registerScreen(profileAvatarScreen);
    navigation.registerScreen(dailyBonusesScreen);
    navigation.registerScreen(languagesScreen);
    navigation.registerScreen(rewardReceiveOffsetScreen);
    navigation.registerScreen(playgroundScreen);

    navigation.registerScreen(bonusesScreen);
    navigation.registerScreen(settingsScreen);
    navigation.registerScreen(tutorialOffsetScreen);
    navigation.registerScreen(exitGameScreen);

    backActionHandler.onSigleBack = () => {
      navigation.pop();
    };
    backActionHandler.onDoubleBack = () => {
      navigation.push(exitGameScreen);
    };
  },
  onUnfocus: () => { },
  screenLogic: new MainScreen({ screenRoot: mainScreenRoot })
})

const collectionRoot = document.getElementById('skins-tab');
const collectionScreen = new Screen({
  element: collectionRoot,
  openButtons: mainScreen.element.querySelectorAll('.skins-tab-open-button'),
  closeButtons: collectionRoot.querySelectorAll('.skins-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    if (!input.loadBackup())
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
    if (!input.loadBackup())
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
    if (!input.loadBackup())
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
    if (!input.loadBackup())
      input.updateQueryCustom(profileScreen.screenLogic.selectableElements,
        profileScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: new ProfileScreen({ screenRoot: profileRoot })
});

const profileAvatarRoot = document.getElementById('choose-avatar-tab');
const profileAvatarScreen = new Screen({
  element: profileAvatarRoot,
  openButtons: profileRoot.querySelectorAll('.choose-avatar-tab-open-button'),
  closeButtons: profileAvatarRoot.querySelectorAll('.choose-avatar-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    if (!input.loadBackup())
      input.updateQueryCustom(profileAvatarScreen.screenLogic.selectableElements,
        profileAvatarScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
    navigation.push(profileScreen);
  },
  screenLogic: new AvatarSelectionScreen({ screenRoot: profileAvatarRoot })
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
  screenLogic: new SettingsScreen({ screenRoot: settingsRoot })
});

const languagesRoot = document.getElementById('languages');
const languagesScreen = new Screen({
  id: 'languagesScreen',
  isPopup: true,
  element: languagesRoot,
  openButtons: settingsScreen.element.querySelectorAll('.languages-open-button'),
  closeButtons: languagesRoot.querySelectorAll('.languages-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    if (!input.loadBackup())
      input.updateQueryCustom(languagesScreen.screenLogic.selectableElements,
        languagesScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
  },
  screenLogic: new LanguageSelectionScreen({ screenRoot: languagesRoot })
});

const gameFinishRoot = document.getElementById('end-popup-tab');
const gameFinishScreen = new Screen({
  id: 'gameFinishScreen',
  isPopup: true,
  element: gameFinishRoot,
  onFocus: () => {
    dynamicFontChanger.update();
    if (!input.loadBackup())
      input.updateQueryCustom(gameFinishScreen.screenLogic.selectableElements,
        gameFinishScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
  },
  screenLogic: new GameFinishScreen({ screenRoot: gameFinishRoot })
});

const dailyBonusesRoot = document.getElementById('daily-bonuses-tab');
const dailyBonusesScreen = new Screen({
  element: dailyBonusesRoot,
  closeButtons: dailyBonusesRoot.querySelectorAll('.daily-bonuses-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    if (!input.loadBackup())
      input.updateQueryCustom(dailyBonusesScreen.screenLogic.selectableElements,
        dailyBonusesScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: new DailyBonusesScreen({
    screenRoot: dailyBonusesRoot, onRewardAvailable: () => {
      navigation.push(dailyBonusesScreen);
    }
  })
});

const gameSelectionRoot = document.getElementById('start-game-tab');
const gameSelectionScreen = new Screen({
  element: gameSelectionRoot,
  openButtons: mainScreen.element.querySelectorAll('.start-game-tab-open-button'),
  closeButtons: gameSelectionRoot.querySelectorAll('.start-game-tab-close-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    if (!input.loadBackup())
      input.updateQueryCustom(gameSelectionScreen.screenLogic.selectableElements,
        gameSelectionScreen.screenLogic.defaultSelectedElement);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: new GameSettingsScreen({ screenRoot: gameSelectionRoot })
});

const exitPopupRoot = document.getElementById('exit-popup-tab');
const exitScreen = new Screen({
  id: 'exitGameScreen',
  isPopup: true,
  element: exitPopupRoot,
  closeButtons: [exitPopupRoot.querySelector('.exit-no')],
  onFocus: () => {
    dynamicFontChanger.update();
    if (!input.loadBackup()) {
      input.updateQueryCustom(exitScreen.screenLogic.selectableElements,
        exitScreen.screenLogic.defaultSelectedElement);
    }
  }, onUnfocus: () => {
  }, screenLogic: new ExitGameScreen({ screenRoot: exitPopupRoot })
});

const exitGamePopupRoot = document.getElementById('global-exit-popup-tab');
const exitGameScreen = new Screen({
  id: 'exitGlobalGameScreen',
  isPopup: true,
  element: exitGamePopupRoot,
  closeButtons: [exitGamePopupRoot.querySelector('.exit-no')],
  onFocus: () => {
    dynamicFontChanger.update();
    const elements = getInputElements(exitGameScreen.element, { tags: ['button'] });
    console.log(`${elements}`);
    input.updateQueryCustom(elements, elements[1]);
  }, onUnfocus: () => {
  }, screenLogic: new GlobalExitGameScreen({ screenRoot: exitGamePopupRoot })
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

const rewardReceivePopupRoot = document.getElementById('reward-receiver');
const rewardReceiveOffsetScreen = new Screen({
  id: 'reward_receiver',
  isPopup: true,
  element: rewardReceivePopupRoot,
  closeButtons: [rewardReceivePopupRoot],
  onFocus: () => {
    input.updateQueryCustom({ element: rewardReceivePopupRoot }, { element: rewardReceivePopupRoot });
  }, screenLogic: new RewardReceiveScreen({ screenRoot: rewardReceivePopupRoot })
});

const playgroundScreenRoot = document.getElementById('playground-tab');
const playgroundScreen = new Screen({
  id: 'playground',
  element: playgroundScreenRoot,
  openButtons: gameSelectionScreen.element.querySelectorAll('.playground-tab-open-button'),
  onFocus: () => {
    dynamicFontChanger.update();
    input.deselect();
    input.updateQueryCustom([], null);

    navigation.clear();
    navigation.openedScreens.push(playgroundScreen);
    navigation.registerScreen(gameFinishScreen);
    navigation.registerScreen(exitScreen);
    navigation.registerScreen(exitGameScreen);

    backActionHandler.onSigleBack = () => {
      if (navigation.openedScreens[navigation.openedScreens.length - 1] == playgroundScreen) {
        if (platform == Platform.TV) {
          navigation.push(exitScreen, { isGameExit: true });
        } else {
          return;
        }
      } else {
        navigation.pop();
      }
    };

    backActionHandler.onDoubleBack = () => {
      navigation.push(exitGameScreen);
    };

    input.loadFromSavedPull('tv-gameplay');
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenLogic: new PlaygroundScreen({ screenRoot: playgroundScreenRoot })
}); {
  playgroundScreen.scaleIn = 1;
  playgroundScreen.scaleOut = 1.2;
  playgroundScreen.element.style.scale = playgroundScreen.scaleOut;
}

const exitButton = exitScreen.element.getElementsByClassName('exid-yes')[0];
if (exitButton != null) {
  exitButton.onclick = function () { SDK?.dispatchEvent(SDK.EVENTS.EXIT); }
}

// if (load('tutorial-offer', false) == false) {
//   tutorialPopupRoot.querySelector('.yes').onclick = function () {
//     window.location.href = './src/playground/playground.html?levelID=level_def_s_1&isTutorial=true';
//   }

//   setTimeout(() => { navigation.push(tutorialOffsetScreen) }, 400)
//   save('tutorial-offer', true);
// }

navigation.push(mainScreen);

backActionHandler = new BackActionHandler(input);

dynamicFontChanger = new DynamicFontChanger();