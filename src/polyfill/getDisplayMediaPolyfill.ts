// DEPRECATED: polyfilled getDisplayMedia
// https://github.com/electron/electron/issues/16513#issuecomment-602070250

/*
const ScreenShare = {
  desktopCapturer: desktopCapturer,
};

module.exports = ScreenShare;

window.onload = () => {
  // shim the getDisplayMedia function when it is called by the remote web app
  window.navigator.mediaDevices.getDisplayMedia = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const desktopCapturerSources = await desktopCapturer.getSources({ types: ['window', 'screen'] });

        const screenSources = desktopCapturerSources.filter(source => source.id.startsWith('screen'));
        const windowSources = desktopCapturerSources.filter(source => source.id.startsWith('window'));

        // UI
        const selectionElem = document.createElement('div');
        selectionElem.classList.add('desktop-capturer-selection');
        selectionElem.innerHTML = `
        <style>
        .desktop-capturer-selection {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(30,30,30,.75);
          color: #fff;
          z-index: 10000000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .desktop-capturer-selection__scroller {
          width: 100%;
          max-height: 100vh;
          overflow-y: auto;
        }
        .desktop-capturer-selection__list {
          max-width: calc(100% - 100px);
          margin: 50px;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          list-style: none;
          overflow: hidden;
          justify-content: center;
        }
        .desktop-capturer-selection__item {
          display: flex;
          margin: 4px;
        }
        .desktop-capturer-selection__btn {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 145px;
          margin: 0;
          border: 0;
          border-radius: 3px;
          padding: 4px;
          background: #252626;
          text-align: left;
          transition: background-color .15s, box-shadow .15s;
        }
        .desktop-capturer-selection__btn:hover,
        .desktop-capturer-selection__btn:focus {
          background: rgba(98,100,167,.8);
        }
        .desktop-capturer-selection__thumbnail {
          width: 100%;
          height: 81px;
          object-fit: cover;
        }
        .desktop-capturer-selection__name {
          margin: 6px 0 6px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60vw;
          max-width: 100%;
          height: 50vh;
          display: flex;
          justify-content: space-evenly;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .desktop-capturer-screen-selection, .desktop-capturer-window-selection {
          width: 15vw;
        }
        </style>
        <div class="desktop-capturer modal">
          <button class="desktop-capturer-screen-selection">
            Your Entire Screen
          </button>
          <button class="desktop-capturer-window-selection">
            Application Window
          </button>
          <div class="desktop-capturer-selection__scroller">
          </div>
        </div>
        `
        document.querySelector('#root').appendChild(selectionElem);

        const displaySources = (event, sources) => {
          document.querySelector('.desktop-capturer-selection__scroller').innerHTML = `
            <ul class="desktop-capturer-selection__list">
              ${sources.map(({ id, name, thumbnail, display_id, appIcon }) => `
                <li class="desktop-capturer-selection__item">
                  <button class="desktop-capturer-selection__btn" data-id="${id}" title="${name}">
                    <img class="desktop-capturer-selection__thumbnail" src="${thumbnail.toDataURL()}" />
                    <span class="desktop-capturer-selection__name">${name}</span>
                  </button>
                </li>
              `).join('')}
            </ul>
          `

          // handle click outside to hide selection screen
          document
            .querySelector('.desktop-capturer-selection')
            .addEventListener('click', (event) => {
              // if buttons contain (event.target), then we clicked a button
              const sources = document.querySelectorAll(`
              .desktop-capturer-selection__btn,
              .desktop-capturer-screen-selection,
              .desktop-capturer-window-selection
              `)
              let clickedSource = false;
              sources.forEach(source => {
                if (source.contains(event.target)) {
                  clickedSource = true;
                }
              });

              // otherwise, we clicked outside
              if (!clickedSource) {
                selectionElem.remove()
              }
            });

          document
            .querySelectorAll('.desktop-capturer-selection__btn')
            .forEach(button => {
              const id = button.getAttribute('data-id')
              const source = desktopCapturerSources.find(source => source.id === id)
              if (!source) {
                throw new Error(`Source with id ${id} does not exist`)
              }

              button.addEventListener('click', async () => {
                try {
                  const id = button.getAttribute('data-id');
                  const stream = await window.navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                      mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: id
                      }
                    }
                  });
                  resolve(stream);
                  selectionElem.remove();
                } catch (err) {
                  console.error('Error selecting desktop capture source:', err);
                  reject(err);
                }
              })
            })
        };

        document
          .querySelector('.desktop-capturer-screen-selection')
          .addEventListener('click', (event) => displaySources(event, screenSources));

        document
          .querySelector('.desktop-capturer-window-selection')
          .addEventListener('click', (event) => displaySources(event, windowSources));

        displaySources(undefined, screenSources);
      } catch (err) {
        console.error('Error displaying desktop capture sources:', err);
        reject(err);
      }
    })
  }
}; */
