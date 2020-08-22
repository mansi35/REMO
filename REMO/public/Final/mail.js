// var firebaseConfig = {
//         apiKey: "AIzaSyDkaU5im4Hj7QsqQDFVkM3_kKyF1YGQI4Q",
//         authDomain: "remo-e30b0.firebaseapp.com",
//         databaseURL: "https://remo-e30b0.firebaseio.com",
//         projectId: "remo-e30b0",
//         storageBucket: "remo-e30b0.appspot.com",
//         messagingSenderId: "318553256084",
//         appId: "1:318553256084:web:955bfc1a10af2b009d4481"
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

var database = firebase.database();
var firebaseOrdersCollection = database.ref().child('Interview_details');

const KEY_SIZE = 15;

var rand = random(KEY_SIZE);

document.getElementById("schedule-form").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("schedule-submit-btn").innerHTML = `sending...`;
    sendmail();
});


function sendmail() {

    rand = random(KEY_SIZE);
    submitdetails();
}

function random(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return (result);
}

function submitdetails() {
    var details = {
        Interviewer_name: $('#P1name').val(),
        Interviewee_name: $('#P2name').val(),
        Interviewee_email: $("#P2email").val(),
        Interviewer_email: $("#P1email").val(),
        Date_: $("#date-time").val(),
        Key: rand,
    };

    firebaseOrdersCollection.child(rand).set(details);

    sendtointerviewee();
    sendtointerviewer();
    sendtoremovirtual();
};


function sendtointerviewee() {
    Email.send({

        Host: "smtp.gmail.com",
        Username: "removirtual@gmail.com",
        Password: "removirtual123$",
        To: $("#P2email").val(),
        From: "removirtual@gmail.com",
        Subject: "Interview Confirmation",
        Body: "Hey " + $("#P2name").val() + " ,\r\r" + "Your interview has been scheduled on " + $("#date-time").val().split("T")[0] + " at " + $("#date-time").val().split("T")[1] + ". Join the room with the key - " + rand + "E" + "\n\n. Wish you the best.",
    })
}

function sendtointerviewer() {
    Email.send({

        Host: "smtp.gmail.com",
        Username: "removirtual@gmail.com",
        Password: "removirtual123$",
        To: $("#P1email").val(),
        From: "removirtual@gmail.com",
        Subject: "Interview Confirmation",
        Body: "You interview with " + $("#P2name").val() + " has been scheduled on " + $("#date-time").val().split("T")[0] + " at " + $("#date-time").val().split("T")[1] + ". Join the room with the key - " + rand + "R",
    })
}


function sendtoremovirtual() {
    Email.send({

        Host: "smtp.gmail.com",
        Username: "removirtual@gmail.com",
        Password: "removirtual123$",
        To: "removirtual@gmail.com",
        From: "removirtual@gmail.com",
        Subject: "Launch the lab",
        Body: $("#date-time").val().split(" ")[0] + " at " + $("#date-time").val().split(" ")[1] + " " + $("#date-time").val().split(" ")[2] + ". Please launch the lab and ensure it is functional .",
    }).then(
        e => {
            document.getElementById("schedule-submit-btn").innerHTML = `
            <audio autoplay>
                <source src="./assets/insight.mp3#t=00:00:01" type="audio/ogg">
            </audio>
            SENT
            <svg class="tick-svg" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>`;
            setTimeout(function() { document.getElementById("schedule-submit-btn").innerHTML = `SEND`;
                document.getElementById("schedule-form").reset(); }, 3000);
        }
    );
}


//---- contact us -------

document.getElementById("contact-form").addEventListener("submit", function(event) {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    event.preventDefault();

    document.getElementById("contact-submit-btn").innerHTML = `sending...`;

    Email.send({
        Host: "smtp.gmail.com",
        Username: "removirtual@gmail.com",
        Password: "removirtual123$",
        To: "removirtual@gmail.com",
        From: $("#email").val(),
        Subject: $("#name").val() + "'s query",
        Body: $("#message").val(),
    }).then(
        e => {
            document.getElementById("contact-submit-btn").innerHTML = `
            <audio autoplay>
                <source src="./assets/insight.mp3#t=00:00:01" type="audio/ogg">
            </audio>
            SENT
            <svg class="tick-svg" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>`;
            setTimeout(function() { document.getElementById("contact-submit-btn").innerHTML = `SEND`;
                document.getElementById("contact-form").reset(); }, 3000);
        }
    );

});