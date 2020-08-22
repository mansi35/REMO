const homeSec = document.getElementById("home-container");
const aboutSec = document.getElementById("about-container");
const teamSec = document.getElementById("team-container");
const contactSec = document.getElementById("contact-container");

const homeBtn = document.getElementById("home-btn");
const aboutBtn = document.getElementById("about-btn");
const teamBtn = document.getElementById("team-btn");
const contactBtn = document.getElementById("contact-btn");

homeBtn.addEventListener("click", displayHome);
aboutBtn.addEventListener("click", displayAbout);
teamBtn.addEventListener("click", displayTeam);
contactBtn.addEventListener("click", displayContact);

function hideAll() {
    homeSec.classList.add("d-md-none");
    aboutSec.classList.add("d-md-none");
    teamSec.classList.add("d-md-none");
    contactSec.classList.add("d-md-none");

    homeBtn.classList.remove("active-btn");
    aboutBtn.classList.remove("active-btn");
    teamBtn.classList.remove("active-btn");
    contactBtn.classList.remove("active-btn");
}

function displayHome() {
    hideAll();
    homeSec.classList.remove("d-md-none");
    homeBtn.classList.add("active-btn");
}

function displayAbout() {
    hideAll();
    aboutSec.classList.remove("d-md-none");
    aboutBtn.classList.add("active-btn");
}

function displayTeam() {
    hideAll();
    teamSec.classList.remove("d-md-none");
    teamBtn.classList.add("active-btn");
}

function displayContact() {
    hideAll();
    contactSec.classList.remove("d-md-none");
    contactBtn.classList.add("active-btn");
}