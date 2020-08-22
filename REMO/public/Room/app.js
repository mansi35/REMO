const configuration = {
    iceServers: [{
        urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    }, ],
    iceCandidatePoolSize: 10,
};

let peerConnection = null;
let localStream = null;
let remoteStream = null;
let roomDialog = null;
let createdRoomDialog = null;
let roomId = null;
let roomRef = null;
let roomSnapshot = null;

function init() {
    makeRoom();
    if (window.localStorage.getItem('interviewer') == 0) {
        $('#myModal').modal({
            backdrop: 'static'
        });
        $("#myModal").modal("show");
    }
    document.querySelector("#toggleCamera").addEventListener("click", toggleCamera);
    document.querySelector("#toggleMic").addEventListener("click", toggleMic);
    document.querySelector("#hangupBtn").addEventListener("click", hangUp);
}

var elem = document.documentElement;

function openFullscreen() {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

if (window.localStorage.getItem('interviewer') == 0) {
    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);

    function exitHandler() {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            $('#warning').modal({
                backdrop: 'static'
            });
            $("#warning").modal("show");
        }
    }
}

async function makeRoom() {
    await openUserMedia();
    const querystring = window.location.search;
    console.log(querystring);

    const urlParams = new URLSearchParams(querystring);

    const roomId = urlParams.get("key");
    // roomId = window.localStorage.getItem('roomId')
    console.log(roomId);
    var boardLink = "https://removirtual-board.herokuapp.com/?key=" + roomId;
    document.getElementById("board").setAttribute("src", boardLink);
    console.log(boardLink);
    name = window.localStorage.getItem('name');
    var chatLink = "https://chat-at-remo.herokuapp.com/?key=" + roomId + "&name=" + name;
    document.getElementById("chat").setAttribute("src", chatLink);
    console.log(chatLink);
    db = firebase.firestore();
    roomRef = db.collection("rooms").doc(`${roomId}`);
    roomSnapshot = await roomRef.get();
    console.log("Got room:", roomSnapshot.exists);

    if (roomSnapshot.exists) {
        joinRoomById(roomId);
    } else {
        createRoomById();
    }
    return roomId;
}


async function createRoomById() {
    const db = firebase.firestore();

    console.log("Create PeerConnection with configuration: ", configuration);
    peerConnection = new RTCPeerConnection(configuration);

    registerPeerConnectionListeners();

    // Add code for creating a room here
    // Code for creating room above

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    // Code for creating a room below
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const roomWithOffer = {
        offer: {
            type: offer.type,
            sdp: offer.sdp,
        },
    };
    const querystring = window.location.search;
    console.log(querystring);

    const urlParams = new URLSearchParams(querystring);

    const roomId = urlParams.get("key");
    launchlab(roomId);
    const roomRef = await db.collection("rooms").doc(roomId);

    roomRef.set(roomWithOffer);

    // Code for creating a room above

    // Code for collecting ICE candidates below
    const callerCandidatesCollection = roomRef.collection("callerCandidates");
    peerConnection.addEventListener("icecandidate", (event) => {
        if (!event.candidate) {
            console.log("Got final candidate!");
            return;
        }
        console.log("Got candidate: ", event.candidate);
        callerCandidatesCollection.add(event.candidate.toJSON());
    });

    // Code for collecting ICE candidates above

    peerConnection.addEventListener("track", (event) => {
        console.log("Got remote track:", event.streams[0]);
        event.streams[0].getTracks().forEach((track) => {
            console.log("Add a track to the remoteStream:", track);
            remoteStream.addTrack(track);
        });
    });

    // Listening for remote session description below
    roomRef.onSnapshot(async(snapshot) => {
        const data = snapshot.data();
        if (!peerConnection.currentRemoteDescription && data && data.answer) {
            console.log("Got remote description: ", data.answer);
            const rtcSessionDescription = new RTCSessionDescription(data.answer);
            await peerConnection.setRemoteDescription(rtcSessionDescription);
        }
    });
    // Listening for remote session description above

    // Listen for remote ICE candidates below
    roomRef.collection("calleeCandidates").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async(change) => {
            if (change.type === "added") {
                let data = change.doc.data();
                console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
                await peerConnection.addIceCandidate(new RTCIceCandidate(data));
            }
        });
    });
    // Listen for remote ICE candidates above

    return roomId;
}

async function joinRoomById(roomId) {
    getlab(roomId);
    console.log(roomSnapshot);
    console.log("Create PeerConnection with configuration: ", configuration);
    peerConnection = new RTCPeerConnection(configuration);
    registerPeerConnectionListeners();
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const calleeCandidatesCollection = roomRef.collection("calleeCandidates");
    peerConnection.addEventListener("icecandidate", (event) => {
        if (!event.candidate) {
            console.log("Got final candidate!");
            return;
        }
        console.log("Got candidate: ", event.candidate);
        calleeCandidatesCollection.add(event.candidate.toJSON());
    });
    // Code for collecting ICE candidates above

    peerConnection.addEventListener("track", (event) => {
        console.log("Got remote track:", event.streams[0]);
        event.streams[0].getTracks().forEach((track) => {
            console.log("Add a track to the remoteStream:", track);
            remoteStream.addTrack(track);
        });
    });

    // Code for creating SDP answer below
    const offer = roomSnapshot.data().offer;
    console.log("Got offer:", offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    console.log("Created answer:", answer);
    await peerConnection.setLocalDescription(answer);
    const roomWithAnswer = {
        answer: {
            type: answer.type,
            sdp: answer.sdp,
        },
    };
    await roomRef.update(roomWithAnswer);
    // Code for creating SDP answer above

    // Listening for remote ICE candidates below
    roomRef.collection("callerCandidates").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach(async(change) => {
            if (change.type === "added") {
                let data = change.doc.data();
                console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
                await peerConnection.addIceCandidate(new RTCIceCandidate(data));
            }
        });
    });
    // Listening for remote ICE candidates above
    // }
}

async function openUserMedia(e) {
    v = window.localStorage.getItem("v") == "true";
    console.log(v);
    a = window.localStorage.getItem("a") == "true";
    console.log(a);
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
    });
    console.log(stream);
    document.querySelector("#localVideo").srcObject = stream;
    localStream = stream;
    console.log(localStream);
    if (v == false) {
        await toggleCamera();
    }
    if (a == false) {
        await toggleMic();
    }
    remoteStream = new MediaStream();
    document.querySelector("#remoteVideo").srcObject = remoteStream;

    console.log("Stream:", document.querySelector("#localVideo").srcObject);
    document.querySelector("#toggleCamera").disabled = false;
    document.querySelector("#toggleMic").disabled = false;
    document.querySelector("#hangupBtn").disabled = false;
}

function toggleCamera() {
    element = document.getElementById("toggleCameraIcon");
    if (element.classList.contains("fa-video-camera")) {
        element.classList.remove("fa-video-camera");
        element.classList.add("fa-video-slash");
    } else {
        element.classList.add("fa-video-camera");
        element.classList.remove("fa-video-slash");
    }
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0]
        .enabled;
}

function toggleMic() {
    element = document.getElementById("toggleMicIcon");
    if (element.classList.contains("fa-microphone")) {
        element.classList.remove("fa-microphone");
        element.classList.add("fa-microphone-slash");
    } else {
        element.classList.add("fa-microphone");
        element.classList.remove("fa-microphone-slash");
    }
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0]
        .enabled;
}

async function hangUp(e) {
    const tracks = document.querySelector("#localVideo").srcObject.getTracks();
    tracks.forEach((track) => {
        track.stop();
    });

    if (remoteStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
    }

    if (peerConnection) {
        peerConnection.close();
    }

    document.querySelector("#localVideo").srcObject = null;
    document.querySelector("#remoteVideo").srcObject = null;
    document.querySelector("#hangupBtn").disabled = true;
    document.querySelector("#currentRoom").innerText = "";

    window.location.replace("../feedback/Feedback.html");
    // Delete room on hangup
    const querystring = window.location.search;
    console.log(querystring);

    const urlParams = new URLSearchParams(querystring);

    const roomId = urlParams.get("key");
    console.log(roomId);
    if (roomId) {
        const db = firebase.firestore();
        const roomRef = db.collection("rooms").doc(roomId);
        const calleeCandidates = await roomRef.collection("calleeCandidates").get();
        calleeCandidates.forEach(async(candidate) => {
            await candidate.delete();
        });
        const callerCandidates = await roomRef.collection("callerCandidates").get();
        callerCandidates.forEach(async(candidate) => {
            await candidate.delete();
        });
        await roomRef.delete();
    }
}

function registerPeerConnectionListeners() {
    peerConnection.addEventListener("icegatheringstatechange", () => {
        console.log(
            `ICE gathering state changed: ${peerConnection.iceGatheringState}`
        );
    });

    peerConnection.addEventListener("connectionstatechange", () => {
        console.log(`Connection state change: ${peerConnection.connectionState}`);
    });

    peerConnection.addEventListener("signalingstatechange", () => {
        console.log(`Signaling state change: ${peerConnection.signalingState}`);
    });

    peerConnection.addEventListener("iceconnectionstatechange ", () => {
        console.log(
            `ICE connection state change: ${peerConnection.iceConnectionState}`
        );
    });
}

init();
