// var gestisciSegnalazioni = false;
var isAdmin = false;
var isLogged = false;
var userMail;
var userPass;
var map;

$(document).ready(function () {
    console.log("ready!");


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
    $('#gestisci').classList.remove("active");
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

    //leva active
    $('.nav-item.active')[0].lastChild.classList.remove("active");
    $('.nav-item.active')[0].lastChild.lastChild.classList.remove("active");
    $('.nav-item.active')[0].classList.remove("active");

    $('a.nav-link.focus--mouse')[0].parentNode.classList.add("active");
    $('a.nav-link.focus--mouse')[0].lastChild.classList.add("active");
    $('a.nav-link.focus--mouse')[0].classList.add("active");

}

$(function () {
    $('.btn-group-fab').on('click', '.btn', function () {
        $('.btn-group-fab').toggleClass('active');
        //TODO OPEN MODAL INSERIMENTO DELLA SEGNALAZIONE
    });
});

$(document).click(function(event) {
    console.log($(event.target));
});