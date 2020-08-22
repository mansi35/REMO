var firebaseConfig = {
    apiKey: "AIzaSyDkaU5im4Hj7QsqQDFVkM3_kKyF1YGQI4Q",
    authDomain: "remo-e30b0.firebaseapp.com",
    databaseURL: "https://remo-e30b0.firebaseio.com",
    projectId: "remo-e30b0",
    storageBucket: "remo-e30b0.appspot.com",
    messagingSenderId: "318553256084",
    appId: "1:318553256084:web:955bfc1a10af2b009d4481",
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var fire = database.ref().child("Lab_details");
var val;

function getlab(roomId) {
    val = roomId;
    fire.on("value", gotData);
    function gotData(data) {
        data = data.val();
        let keys = Object.keys(data);
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == roomId) {
                document.getElementById("lab").setAttribute("src", keys[i].two);
            }
        }
    }
}
