// var firebaseConfig = {
//     apiKey: "AIzaSyDkaU5im4Hj7QsqQDFVkM3_kKyF1YGQI4Q",
//     authDomain: "remo-e30b0.firebaseapp.com",
//     databaseURL: "https://remo-e30b0.firebaseio.com",
//     projectId: "remo-e30b0",
//     storageBucket: "remo-e30b0.appspot.com",
//     messagingSenderId: "318553256084",
//     appId: "1:318553256084:web:955bfc1a10af2b009d4481",
// };

// firebase.initializeApp(firebaseConfig);

var firebaseConfig = {
    apiKey: "AIzaSyBz0YSeBST7Ud2k-Kla9GYj-yYqusLll3c",
    authDomain: "removirtual-fa3b3.firebaseapp.com",
    databaseURL: "https://removirtual-fa3b3.firebaseio.com",
    projectId: "removirtual-fa3b3",
    storageBucket: "removirtual-fa3b3.appspot.com",
    messagingSenderId: "17916687649",
    appId: "1:17916687649:web:efcbfc9b14ee5ddeafba60"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let database = firebase.database();
let fire = database.ref().child("Interview_details");
var val;

function validate() {
    //           console.log(document.getElementById("P1name").value);
    val = document.getElementById("room_key").value;
    valname = document.getElementById("room_name").value;
    window.localStorage.setItem('name', valname);
    if (val.endsWith('R')) {
        window.localStorage.setItem('interviewer', 1);
    } else {
        window.localStorage.setItem('interviewer', 0);
    }
    console.log(window.localStorage.getItem('interviewer'));
    val = val.slice(0, -1);
    console.log(val);
    document.getElementById("form").reset();

    fire.on("value", gotData);

    function gotData(data) {
        data = data.val();
        console.log(data);
        let keys = Object.keys(data);
        var present = keys.includes(val);
        if (present == true) {
            url = "../Room/room.html?key=" + val;
            console.log(present);
            window.location.replace(url);
        } else {
            alert("Stay Calm And Enter The Correct Key!");
        }
    }
}
