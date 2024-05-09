async function waitForButtonClick(button) {
    await new Promise((p) => {
        button.onclick = function () {
            p();
        }
    })
}

export { waitForButtonClick }