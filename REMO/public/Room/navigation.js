var videoDIV = document.getElementById("videoDIV");
var gitDIV = document.getElementById("gitDIV");
var boardDIV = document.getElementById("boardDIV");
var chatDIV = document.getElementById("chatDIV");

function openvideo() {
    close("gitDIV");
    close("chatDIV");
    close("boardDIV");
    close("labDIV");
    large("remoteVideo");
    open("localVideo");
}

function opengit() {
    close("boardDIV");
    close("chatDIV");
    close("localVideo");
    small("remoteVideo");
    close("labDIV");
    open("gitDIV");
}

function openboard() {
    close("gitDIV");
    close("chatDIV");
    close("localVideo");
    small("remoteVideo");
    close("labDIV");
    open("boardDIV");
    //var iframeID = document.getElementById("board");
    //$(iframeID).focus();
}
function openchat() {
    close("gitDIV");
    close("localVideo");
    small("remoteVideo");
    close("labDIV");
    close("boardDIV");
    open("chatDIV");
    //var iframeID = document.getElementById("board");
    //$(iframeID).focus();
}
function openlab() {
    close("gitDIV");
    close("localVideo");
    small("remoteVideo");
    close("boardDIV");
    open("labDIV");
    close("chatDIV");
    var iframeID = document.getElementById("lab");
    $(iframeID).focus();
}

function opensettings() {
    document.getElementById("setting").classList.toggle("d-none");
}
//--utiliy functions ---------

function close(s) {
    var element = document.getElementById(s);
    element.classList.add("d-none");
}


function open(s) {
    var element = document.getElementById(s);
    element.classList.remove("d-none");
}

function small(s) {
    var element = document.getElementById(s);
    element.style.height = "30vh";
    element.style.width = "35vh";
    element.style.position = "absolute";
    element.style.right = "0em";
    element.style.cursor = "move";
    dragElement(element);
}

function large(s) {
    var element = document.getElementById(s);
    element.style.height = "100vh";
    element.style.width = "100%";
    element.style.removeProperty("position");
    element.style.removeProperty("right");
    element.style.removeProperty("cursor");
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
