if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});


const video = document.getElementById('video');
const select = document.getElementById('select');
const stopStream = document.getElementById('stopStream');
const errMsg = document.getElementById('ErrMsg');
video.style.display = 'none'; 
stopStream.style.display = 'none'; 
errMsg.style.display = 'none';
let currentStream;

function Fullscreen() {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();   
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) { /* Safari */
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { /* IE11 */
        video.msRequestFullscreen();
      }
    }
}

function stopMediaTracks() {
  video.style.display = 'none'; 
  stopStream.style.display = 'none'; 
  currentStream.getTracks().forEach(track => {
    track.stop();
  });
}

function gotDevices(deviceInfos) {
  select.innerHTML = '';
  var option = document.createElement('option');
  option.text = '';
  select.appendChild(option);
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || 'Camera ' + (select.length + 1);
      select.appendChild(option);
    }
  }
}

function selectDevice() {
  if (typeof currentStream !== 'undefined') {
    video.style.display = 'none'; 
    stopStream.style.display = 'none'; 
    errMsg.style.display = 'none';
    stopMediaTracks();
  }
  if (select.value != '') {
    const constraints = {
      video: {
          frameRate: { max: 30 }, 
          deviceId: { exact: select.value },
          width: {ideal: 1280},
          height: {ideal: 960}
      },
      audio: false
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      video.style.display = 'block'; 
      stopStream.style.display = 'block'; 
      errMsg.style.display = 'none';
      currentStream = stream;
      video.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    }).then(gotDevices).catch(error => {
      stopStream.style.display = 'none'; 
      handleError(error)
    });
  }
}

function handleError(error) {
  errMsg.style.display = 'block'; 
  if (error.name === 'OverconstrainedError') {
    const v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'NotAllowedError') {
    errorMsg('Permissions have not been granted to use your camera and microphone, ' +
      'you need to allow the page access to your devices in order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`);
}
function errorMsg(msg) {
  errMsg.innerHTML += `<p>${msg}</p>`;
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(error => { handleError(error)});
video.addEventListener("touchstart", Fullscreen);
select.addEventListener("change", selectDevice);
stopStream.addEventListener("click", stopMediaTracks);