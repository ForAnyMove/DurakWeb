import { getElements } from "./helpers.js";
import { load, save } from "./save_system/SaveSystem.js";

class AudioManager {
    constructor(musicIcons, soundIcons) {
        this.enabledMusicIcon = musicIcons[0];
        this.disabledMusicIcon = musicIcons[1];
        this.enabledSoundIcon = soundIcons[0];
        this.disabledSoundIcon = soundIcons[1];

        this.soundSwitchButton = document.getElementById('sound-switch');
        this.musicSwitchButton = document.getElementById('music-switch');

        this.musicAudioElement = document.getElementById('backgroundMusic');
        this.butonAudionElement = document.getElementById('buttonClick');

        this.isMusicEnabled = load('music', true);
        this.isSoundEnabled = load('sound', true);

        if (this.isMusicEnabled) {
            document.addEventListener("click", () => {
                this.musicAudioElement.play();
            });
        } else {
            this.musicAudioElement.muted = true;
        }

        this.clickables = getElements(document, { tags: ['button', 'a', 'img'] });
        for (let i = 0; i < this.clickables.length; i++) {
            const element = this.clickables[i];
            if (element.click == null) continue;
            element.addEventListener('click', () => {
                this.butonAudionElement.play();
            })
        }

        this.soundSwitchButton.addEventListener('click', () => {
            this.switchSoundState();
        });

        this.musicSwitchButton.addEventListener('click', () => {
            this.switchMusicState();
        });

        this.updateSwitchButtonIcons();

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                console.log('mute');
                this.musicAudioElement.muted = true;
                this.butonAudionElement.muted = true;
            } else {
                this.musicAudioElement.muted = !this.isMusicEnabled;
                this.butonAudionElement.muted = !this.isSoundEnabled;
            }
        });
    }

    pause = function () {
        this.musicAudioElement.muted = true;
        this.butonAudionElement.muted = true;
    }

    unpause = function () {
        this.musicAudioElement.muted = !this.isMusicEnabled;
        this.butonAudionElement.muted = !this.isSoundEnabled;
    }

    addClickableToPull = function (clickable) {
        this.clickables.push(clickable);
        clickable.addEventListener('click', () => {
            this.butonAudionElement.play();
        })
    }

    switchMusicState = function () {
        this.isMusicEnabled = !this.isMusicEnabled;
        save('music', this.isMusicEnabled);

        if (this.isMusicEnabled) {
            this.musicAudioElement.play();
            this.musicAudioElement.muted = false;
        } else {
            this.musicAudioElement.muted = true;
        }

        this.updateSwitchButtonIcons();
    }

    switchSoundState = function () {
        this.isSoundEnabled = !this.isSoundEnabled;

        if (this.isSoundEnabled) {
            this.butonAudionElement.muted = false;
        } else {
            this.butonAudionElement.muted = true;
        }
        save('sound', this.isSoundEnabled);

        this.updateSwitchButtonIcons();
    }

    updateSwitchButtonIcons = function () {
        this.soundSwitchButton.children[0].src = this.isSoundEnabled ? this.enabledSoundIcon : this.disabledSoundIcon;
        this.musicSwitchButton.children[0].src = this.isMusicEnabled ? this.enabledMusicIcon : this.disabledMusicIcon;
    }
}

export { AudioManager }