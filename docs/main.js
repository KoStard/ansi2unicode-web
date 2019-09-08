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
            box.classList.remove('drag-drop');
            let initialValue = boxInner.value;
            let resp = await processFile(boxInner.files[0]);
            if (boxInner.value == initialValue) {
                boxInner.value = null;
            }
            if (!resp) {
                box.classList.add('invalid');
                setTimeout(() => {
                    box.classList.remove('invalid');
                }, 500);
            }
        }
    }
}