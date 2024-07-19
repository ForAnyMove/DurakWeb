async function waitForButtonClick(button) {
    await new Promise((p) => {
        button.onclick = function () {
            audioManager.playSound();

            p();
        }
    })
}

export { waitForButtonClick }