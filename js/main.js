// var gestisciSegnalazioni = false;
var isAdmin = false;
var isLogged = false;
var userMail;
var userPass;
var map;

$(document).ready(function () {
    console.log("ready!");

    var mymap = L.map('mapWrapper').setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        accessToken: 'your.mapbox.access.token'
    }).addTo(mymap);
});

function validaLoginMock() {
    userMail = document.getElementById("emailLogIn").value;
    userPass = document.getElementById("passLogIn").value;


    //admin
    if (userMail == "admin@admin.it" && userPass == "admin") {
        isAdmin = true;
        isLogged = true;
        $('#accediRegistrati').modal('hide');
        document.getElementById("gestisci").hidden = false;
        $("#gestisci").show();

        document.getElementById("gotoprofilo").classList.remove("disabled");
        $('#wrongCred').hide();
        $('#entra').hide();
        $('#esci').show()
    }
    //user
    else if (userMail == "user@user.it" && userPass == "user") {
        isAdmin = false;
        isLogged = true;
        $('#accediRegistrati').modal('hide');
        document.getElementById("gotoprofilo").classList.remove("disabled");
        $('#wrongCred').hide();
        $('#entra').hide();
        $('#esci').show()
        document.getElementById("gestisci").hidden = true;
    }
    else {
        $('#wrongCred').show();
        document.getElementById("gestisci").hidden = true;
    }
}

function logOut() {
    isAdmin = false;
    isLogged = false;
    $('#gestisci').hide()
    document.getElementById("gotoprofilo").classList.add("disabled");
    $('#esci').hide()
    $('#entra').show();
    document.getElementById("gestisci").hidden = true;
}

function gotoProfilo() {
    closeLateralMenu();
    $("#allSeg").hide();
    $("#tabProfilo").show();
    $("#mySeg").hide();
    $("#gestSeg").hide();
}

function gotoAllSeg() {
    closeLateralMenu();
    $("#allSeg").show();
    $("#tabProfilo").hide();
    $("#mySeg").hide();
    $("#gestSeg").hide();
}

function gotoMySeg() {
    closeLateralMenu();
    $("#allSeg").hide();
    $("#tabProfilo").hide();
    $("#mySeg").show();
    $("#gestSeg").hide();
}

function gotoGestSeg() {
    closeLateralMenu();
    $("#allSeg").hide();
    $("#tabProfilo").hide();
    $("#mySeg").hide();
    $("#gestSeg").show();
}

function closeLateralMenu() {
    $(".custom-navbar-toggler")[0].setAttribute("aria-expanded", "false");
    $(".navbar-collapsable")[0].classList.remove("expanded");
    $(".navbar-collapsable")[0].style.setProperty("display", "none")
}

$(function () {
    $('.btn-group-fab').on('click', '.btn', function () {
        $('.btn-group-fab').toggleClass('active');
        //TODO OPEN MODAL INSERIMENTO DELLA SEGNALAZIONE
    });
});


