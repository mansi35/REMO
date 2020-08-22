var v = true;
var a = true;

function init() {
    getUserMedia();
    document.querySelector('#toggleMic').addEventListener('click', toggleMic);
    document.querySelector('#toggleCamera').addEventListener('click', toggleCamera);
}

async function getUserMedia() {
    const lstream = await navigator.mediaDevices.getUserMedia({ video: v, audio: a });
    document.querySelector('#localVideo').srcObject = lstream;
    localStream = lstream;
    console.log(lstream);
    console.log('Stream:', document.querySelector('#localVideo').srcObject);
    document.querySelector('#toggleCamera').disabled = false;
    document.querySelector('#toggleMic').disabled = false;
}

async function toggleCamera() {
    localStream.getVideoTracks()[0].enabled = !(localStream.getVideoTracks()[0].enabled);
    $(this).find("i").toggleClass("fa-video-slash");
    v = !v;
    window.localStorage.setItem('v', v);
    console.log(window.localStorage.getItem('v'));
}

async function toggleMic() {
    localStream.getAudioTracks()[0].enabled = !(localStream.getAudioTracks()[0].enabled);
    $(this).find("i").toggleClass("fa-microphone-slash");
    a = !a;
    window.localStorage.setItem('a', a);
    console.log(window.localStorage.getItem('a'));
}

window.localStorage.setItem('v', v);
window.localStorage.setItem('a', a);

init();
