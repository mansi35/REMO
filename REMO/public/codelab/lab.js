function accesslab() {
    var content;
    $.get(
        "https://cors-anywhere.herokuapp.com/https://usethelab.herokuapp.com/",
        function(data) {
            content = data;
            document.getElementById("lab").setAttribute("src", data);
        }
    );
}

function monitorlab() {
    var content;
    $.get(
        "https://cors-anywhere.herokuapp.com/https://monitorthelab.herokuapp.com/",
        function(data) {
            content = data;
            document.getElementById("lab").setAttribute("src", data);
        }
    );
}
