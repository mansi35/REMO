var socket;
var b;
var c;

const querystring = window.location.search;
console.log(querystring);

const urlParams = new URLSearchParams(querystring);

const room = urlParams.get("key");
var roomId = room;

function setup() {
    createCanvas(windowWidth, windowHeight - 3.5);
    background(255);
    b = 0;

    weight = document.getElementById('weight');
    c = "#000000";

    socket = io()
    socket.emit('create', roomId);
    console.log(room);
    socket.on('mouse', newDrawing);
}

function newDrawing(data) {
    b = data.display;
    if (b == 1) {
        background(255);
        b = 0;
    }
    stroke(data.color);
    // console.log(data.color);
    strokeWeight(data.weight);
    line(data.x, data.y, data.px, data.py);
}

function mouseDragged() {
    console.log(mouseX + ', ' + mouseY);
    data = {
        x: mouseX,
        y: mouseY,
        px: pmouseX,
        py: pmouseY,
        color: c,
        weight: weight.value
    }
    socket.emit('mouse', data);
    stroke(c);
    // console.log(c);
    strokeWeight(weight.value);
    line(mouseX, mouseY, pmouseX, pmouseY);
}

function resetSketch() {
    background(255);
    b = 1;
    erase = {
        display: b
    }
    socket.emit('mouse', erase);
}

function changered() {
    c = "#f44336";
    weight.value = 3;
}

function changeblue() {
    c = "#008cba";
    weight.value = 3;
}

function changeblack() {
    c = "#000000";
    weight.value = 3;
}

function Erase() {
    c = "#ffffff";
    weight.value = 30;
}