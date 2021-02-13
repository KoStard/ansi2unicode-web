import * as wasm from "ansi2unicode-web";

let updateNotifier;
let newWorker;

function updateOfflineAccessibilityMessageStatus(accessible = true) {
    if (accessible) {
        document.getElementsByClassName('offline-status-message')[0].classList.add('show');
    } else {
        document.getElementsByClassName('offline-status-message')[0].classList.remove('show');
    }
}

function setupDOMEvents() {
    console.log("Setting up DOM listeners");
    updateNotifier = document.getElementById('update_notifier');

    updateNotifier.querySelector('.update').addEventListener('click', function () {
        if (newWorker) {
            newWorker.postMessage({
                action: 'skipWaiting'
            });
        }
    });

    const box = document.getElementById('box');
    const fileInput = document.getElementById('file-input');
    fileInput.ondragenter = function (event) {
        box.classList.add('drag-drop');
    }
    fileInput.ondragleave = function (event) {
        box.classList.remove('drag-drop');
    }
    fileInput.onchange = async function (event) {
        console.log("File change detected");
        if (fileInput.files[0]) {
            box.classList.remove('drag-drop');
            let initialValue = fileInput.value;
            let file = fileInput.files[0]
            let reader = new FileReader();
            let resp;
            let pr = new Promise(function (resolve) {
                reader.onloadend = () => {
                    let t = new Date();
                    window.freader = reader;
                    console.log(`Converting file ${file.name}`);
                    resp = wasm.convert_file(file.name, new Uint8Array(reader.result));
                    if (resp != "Done") {
                        resolve(false);
                    } else {
                        console.log("Finished in " + (new Date() - t) + "ms.");
                        resolve(true);
                    }
                };
            });
            reader.readAsArrayBuffer(file);
            await pr;
            if (fileInput.value == initialValue) {
                fileInput.value = null;
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

function setupSW() {
    if ('serviceWorker' in navigator) {
        // Adding service worker - will allow the app to run and load in offline mode
        // Show in the DOM that the program can run in offline mode
        let base = document.location.pathname.split('/')[1];
        if (base) {
            // Required to run on localhost too
            base = `/${base}`;
        }

        navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` }).then(function (reg) {
            if (reg.installing) {
                console.log('Service worker installing');
            } else if (reg.waiting) {
                if (reg.active) {
                    console.log("We have two versions available, one waiting");
                    newWorker = reg.waiting;
                    if (newWorker.state == 'installed') {
                        if (navigator.serviceWorker.controller) {
                            updateNotifier.classList.add('show');
                        }
                    } else {
                        newWorker.addEventListener('statechange', function () {
                            if (newWorker.state == 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    updateNotifier.classList.add('show');
                                }
                            }
                        });
                    }
                } else {
                    console.log('Service worker installed');
                }
            } else if (reg.active) {
                console.log('Service worker active');
            }

            updateOfflineAccessibilityMessageStatus(true);

            reg.addEventListener('updatefound', function () {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', function () {
                    if (newWorker.state == 'installed') {
                        if (navigator.serviceWorker.controller) {
                            updateNotifier.classList.add('show');
                        }
                    }
                })
            })

        }).catch(function (error) {
            // registration failed
            console.log('Registration failed with ' + error);
        });

        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (refreshing) {
                return;
            }
            window.location.reload();
            refreshing = true;
        })
    }
}


if (document.readyState == 'complete') {
    console.log('Document is loaded');
    setupDOMEvents();
    setupSW();
} else {
    console.log('Document is not loaded');
    window.addEventListener("load", function () {
        setupDOMEvents();
        setupSW();
    });
}


function save_zip(name, value) {
    let data = value;
    let blob = new Blob([data], { type: "application/zip" });
    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, name);
    } else {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display:none";
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}
// Making visible externally - probably there is a better way to do this :) 
window.save_zip = save_zip;

function save_txt(name, value) {
    let data = value;
    let blob = new Blob([data], { type: "application/txt" });
    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, name);
    } else {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display:none";
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}

// Making visible externally - probably there is a better way to do this :) 
window.save_txt = save_txt;