{
    const box = document.getElementById('box');
    const boxInner = box.querySelector('.inner');
    boxInner.ondragenter = function (event) {
        box.classList.add('drag-drop');
    }
    boxInner.ondragleave = function (event) {
        box.classList.remove('drag-drop');
    }
    boxInner.onchange = async function (event) {
        if (boxInner.files[0]) {
            while (!processFile) {
                await new Promise(function (resolve) {
                    setTimeout(resolve, 250);
                });
            }
            let initialValue = boxInner.value;
            await processFile(boxInner.files[0]);
            if (boxInner.value == initialValue) {
                boxInner.value = null;
            }
        }
    }
}