let updateNotifier;
let newWorker;

function updateOfflineAccessibilityMessageStatus(accessible=true) {
  if (accessible) {
    document.getElementsByClassName('offline-status-message')[0].classList.add('show');
  } else {
    document.getElementsByClassName('offline-status-message')[0].classList.remove('show');
  }
}

function setupDOMEvents() {
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
    if (fileInput.files[0]) {
      while (!processFile) {
        await new Promise(function (resolve) {
          setTimeout(resolve, 250);
        });
      }
      box.classList.remove('drag-drop');
      let initialValue = fileInput.value;
      let resp = await processFile(fileInput.files[0]);
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
    navigator.serviceWorker.register(`/${base}/sw.js`, { scope: `/${base}/` }).then(function (reg) {

      if (reg.installing) {
        console.log('Service worker installing');
      } else if (reg.waiting) {
        console.log('Service worker installed');
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

window.onload = function () {
  setupDOMEvents();
  setupSW();
}