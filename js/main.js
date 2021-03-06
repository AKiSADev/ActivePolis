// var gestisciSegnalazioni = false;
var isAdmin = false;
var isLogged = false;
var userMail;
var userPass;
var map;
var LayerMarkers;
var idUtente;
var seg;

var byPassLogin = false;

var utente = {
    pimage: "",
    nome: "",
    cognome: "",
    cf: "",
    email: "",
    pass: ""
}

var segnalazioni;

$(document).ready(function () {
    console.log("ready!");

    $('#logoutlink').hide();

    segnalazioni = [];

    initMap();

    caricaSegnalazioniAll();

});

function validaLoginMock() {
    userMail = document.getElementById("emailLogIn").value;
    userPass = document.getElementById("passLogIn").value;

    //admin
    if (userMail == "admin@admin.it" && userPass == "admin") {
        idUtente = 1;
        isAdmin = true;
        isLogged = true;
        $('#accediRegistrati').modal('hide');
        document.getElementById("gestisci").hidden = false;
        $("#gestisci").show();

        // document.getElementById("gotoprofilo").classList.remove("disabled");
        document.getElementById("gotoprofilo").hidden = false;
        document.getElementById("yourSeg").hidden = false;



        $('#wrongCred').hide();

        $('#entra').hide();
        $('#loginlink').hide();

        $('#esci').show();
        $('#logoutlink').show();

        clearSeg();
        caricaSegnalazioniAll();
        caricaInfoUtente();

        $(".btn-group-fab").show();
    }
    //user
    else if ((byPassLogin) || userMail == "user@user.it" && userPass == "user") {
        idUtente = 2;
        isAdmin = false;
        isLogged = true;
        $('#accediRegistrati').modal('hide');
        // document.getElementById("gotoprofilo").classList.remove("disabled");
        document.getElementById("gotoprofilo").hidden = false;
        document.getElementById("yourSeg").hidden = false;

        $('#wrongCred').hide();

        $('#entra').hide();
        $('#loginlink').hide();

        $('#esci').show();
        $('#logoutlink').show();

        document.getElementById("gestisci").hidden = true;
        clearSeg();
        caricaSegnalazioniAll();
        caricaInfoUtente();
        $(".btn-group-fab").show();
    } else {
        $('#wrongCred').show();
        document.getElementById("gestisci").hidden = true;
    }


}

function logOut() {

    $("#parent-link").addClass("focus--mouse");

    gotoAllSeg();

    isAdmin = false;
    isLogged = false;
    $('#gestisci').hide()
    // document.getElementById("gotoprofilo").classList.add("disabled");
    document.getElementById("gotoprofilo").hidden = true;
    document.getElementById("yourSeg").hidden = true;
    $('#esci').hide();
    $('#entra').show();
    $('#logoutlink').hide();
    $('#loginlink').show();


    $(".btn-group-fab").hide();

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
    $('.nav-item.active')[0].firstChild.classList.remove("active");
    $('.nav-item.active')[0].firstChild.firstChild.classList.remove("active");
    $('.nav-item.active')[0].classList.remove("active");

    $('a.nav-link.focus--mouse')[0].parentNode.classList.add("active");
    $('a.nav-link.focus--mouse')[0].firstChild.classList.add("active");
    $('a.nav-link.focus--mouse')[0].classList.add("active");

}

$(function () {
    $('.btn-group-fab').on('click', '.btn', function () {
        $('.btn-group-fab').toggleClass('active');
        //TODO OPEN MODAL INSERIMENTO DELLA SEGNALAZIONE
    });
});

function initMap() {
    map = new OpenLayers.Map("map", {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326")
    });

    var mapnik = new OpenLayers.Layer.OSM("OpenStreetMap (Mapnik)");

    map.addLayer(mapnik);

    var lonLat = new OpenLayers.LonLat(16.852, 41.1187)
        .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
        );

    map.setCenter(lonLat, 13);

    LayerMarkers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(LayerMarkers);

}


//LA SEGUENTE FUNZIONE SERVIRÀ A CERCA IL POSTO DELLA SEGNALAZIONE
function getPosition() {
    let place;
    $.ajax({
        url: "http://open.mapquestapi.com/geocoding/v1/address?key=ZOwWyHSPqFu1airrcvdG5d05XcfGTln0&location=" + place + ", BA",
        success: function (result) {
            console.log(result.results[0]);
        }
    });

}

function assignSegnalazioni(result) {
    segnalazioni = result;
    for (i = 0; i < result.length; i++) {
        generateSegnalazione(result[i]);
    }
}

function caricaSegnalazioniAll() {
    $.ajax({
        url: "json/segnalazioni-base.json",
        success: function (result) {

            console.log(result);
            assignSegnalazioni(result);
            var projectTo = map.getProjectionObject();
            var epsg4326 = new OpenLayers.Projection("EPSG:4326");
            var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
            for (var i = 0; i < result.length; i++) {
                if (result[i].stato == 2) {
                    var lon = result[i].lon;
                    var lat = result[i].lat;

                    var feature = new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.Point(lon, lat).transform(epsg4326, projectTo),
                        { description: "marker number " + i },
                        { externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset: -12, graphicYOffset: -25 }
                    );
                    vectorLayer.addFeatures(feature);
                }
            }
            map.addLayer(vectorLayer);
        },
        error: function (result) {
            console.log("PERCHE VA IN ERRORE" + result.toString);
        }

    });
}

function generateSegnalazione(result) {

    /*GLI STATI SONO
        1 - IN ATTESA
        2 - ACCETTATA 
        3 - RIFIUTATA

        1 - IN ATTESA DEVONO ESSERE VISUALIZZATE SOLO NELLE MIE SEGNALAZIONI 
            E IN GESTISCI SEGNALAZIONI SE L'UTENTE LOGGATO È 1 E AUTORE
            È 2(#seg2 e #seg3)

        2 - ACCETTATA DEVONO ESSERE VISUALIZZATE IN TUTTE LE SEGNALAZIONI SOLTANTO (#seg)

        3 - RIFIUTATA DEVE ESSERE VISUALIZZATA SOLO IN LE TUE SEGNALAZIONI (#seg2) SE UTENTE LOGGATO
            E AUTORE COINCIDONO

    */
    if (result.stato == 2) {
        appendtoSeg(result);
        if (result.autore == idUtente) {
            appendtoMySeg(result);
        }
    } else if (result.stato == 1) {
        appendToGest(result);
    } else if (result.stato == 3 && result.autore == idUtente) {
        appendtoMySeg(result);
    }
}

function appendtoSeg(result) {


    debugger;
    let segnalazioneHTML = $("#segnalazioneFake");

    let seg = segnalazioneHTML.clone();
    seg.find(".immagine").attr("src", result.images.length == 0 ? "img/Immagine.png" : result.images[0]);
    seg.find(".titolo").html(result.titolo);
    seg.find(".corpo").html(result.testo.slice(0, 255));
    seg.attr("id", result.id);
    seg.show();

    seg.css({ "border": "3px solid #90EE90", "border-radius": "10px" });
    seg.find(".icon").attr("xlink:href", "bootstrap-italia/svg/sprite.svg#it-check-circle");
    //seg.find(".icon").addClass("icon-success");

    $("#seg").append(seg);
}

function appendToGest(result) {
    let segnalazioneHTML = $("#segnalazioneFake");

    let seg = segnalazioneHTML.clone();
    seg.find(".immagine").attr("src", result.images.length == 0 ? "img/Immagine.png" : result.images[0]);
    seg.find(".titolo").html(result.titolo);
    seg.find(".corpo").html(result.testo.slice(0, 255));
    seg.attr("id", result.id);
    seg.show();

    seg.css({ "border": "3px solid #FFFF33", "border-radius": "10px" });
    seg.find(".icon").attr("xlink:href", "bootstrap-italia/svg/sprite.svg#it-clock");
    //seg.find(".icon").addClass("icon-secondary");
    $("#seg3").append(seg);
}

function appendtoMySeg(result) {
    let segnalazioneHTML = $("#segnalazioneFake");

    let seg = segnalazioneHTML.clone();
    seg.find(".immagine").attr("src", result.images.length == 0 ? "img/Immagine.png" : result.images[0]);
    seg.find(".titolo").html(result.titolo);
    seg.find(".corpo").html(result.testo.slice(0, 255));
    seg.attr("id", result.id);
    seg.show();

    if (result.stato == 1) {
        seg.css({ "border": "3px solid #FFFF33", "border-radius": "10px" });
        seg.find(".icon").attr("xlink:href", "bootstrap-italia/svg/sprite.svg#it-clock");
        //seg.find(".icon").addClass("icon-secondary");
    }
    else if (result.stato == 2) {
        seg.css({ "border": "3px solid #90EE90", "border-radius": "10px" });
        seg.find(".icon").attr("xlink:href", "bootstrap-italia/svg/sprite.svg#it-check-circle");
        //seg.find(".icon").addClass("icon-success");
    }
    else {
        seg.css({ "border": "3px solid #DC143C", "border-radius": "10px" });
        seg.find(".icon").attr("xlink:href", "bootstrap-italia/svg/sprite.svg#it-close-circle");
        //seg.find(".icon").addClass("icon-danger");
    }

    $("#seg2").append(seg);
}


function addSegnalazione() {
    let modal = $("#modal-addSegnalazione");

    seg = segnalazioni[0];

    seg.luogo = modal.find(".luogo");

    if (navigator.geolocation && (seg.luogo == "" || seg.luogo == undefined || seg.luogo == null)) {
        navigator.geolocation.getCurrentPosition(assignlatlon);
    }



    seg.id = segnalazioni.length;
    seg.titolo = modal.find("#titoloadd").val();
    seg.testo = modal.find("#descrizione").val();
    seg.autore = idUtente;
    seg.stato = idUtente == 1 ? 1 : 2;


    if (modal.find(".image").length > 0) {
        seg.images.push(modal.find(".image"));
    }
    seg.data = Date.now();

    segnalazioni.push(seg);

    generateSegnalazione(seg);

    $('#avviso-modal').modal('toggle');


}

function assignlatlon(position) {
    seg.lat = posizione.coords.latitude;
    seg.lon = posizione.coords.longitude;
}

function clearSeg() {
    $("#seg").empty();
    $("#seg2").empty();
    $("#seg3").empty();
}

function caricaInfoUtente() {

    if (idUtente == 1) {
        utente.pimage = "https://randomuser.me/api/portraits/men/21.jpg"
        utente.nome = "Mario";
        utente.cognome = "Rossi";
        utente.cf = "RSSMAR56G22A662N";
        utente.email = "admin@admin.it";
        utente.pass = "admin";
    } else {
        utente.pimage = "https://randomuser.me/api/portraits/women/24.jpg"
        utente.nome = "Anastasia";
        utente.cognome = "Mazza";
        utente.cf = "MZZNST56G62A662N";
        utente.email = "user@user.it";
        utente.pass = "user";
    }

    $(".avatar").find("img").attr("src", utente.pimage);
    $("#input-group-1").val(utente.nome);
    $("#input-group-2").val(utente.cognome);
    $("#input-group-3").val(utente.cf);
    $("#input-group-4").val(utente.email);
    $("#input-group-5").val(utente.pass);
}

$("#seg").on("click", "li.segnalazione", function (event) {
    $('#modal-leggi').modal('toggle');

    let id = $(this).attr('id')

    let result = segnalazioni[id - 1];

    let modale = $('#modal-leggi');

    modale.find(".immagine").attr("src", result.images.length == 0 ? "img/Immagine.png" : result.images[0]);
    modale.find("#title").html(result.titolo);
    modale.find(".descrizione").html(result.testo);
    modale.find(".gravita").html("normale");
    modale.find(".luogo").html(getViaByLatLong(result.lat, result.lon));
});

$("#seg2").on("click", "li.segnalazione", function (event) {
    $('#modal-leggi').modal('toggle');

    let id = $(this).attr('id')

    let result = segnalazioni[id - 1];

    let modale = $('#modal-leggi');

    modale.find(".immagine").attr("src", result.images.length == 0 ? "img/Immagine.png" : result.images[0]);
    modale.find("#title").html(result.titolo);
    modale.find(".descrizione").html(result.testo);
    modale.find(".gravita").html("normale");
    modale.find(".luogo").html(getViaByLatLong(result.lat, result.lon));

});

$("#seg3").on("click", "li.segnalazione", function (event) {
    $('#modal-gestisci').modal('toggle');

    let id = $(this).attr('id')

    let result = segnalazioni[id - 1];

    let modale = $('#modal-gestisci');

    modale.attr("val", id);

    modale.find(".immagine").attr("src", result.images.length == 0 ? "img/Immagine.png" : result.images[0]);
    modale.find("#title").html(result.titolo);
    modale.find(".descrizione").html(result.testo);
    modale.find(".gravita").html("normale");
    modale.find(".luogo").html(getViaByLatLong(result.lat, result.lon));
});

$("#ADD").on("click", function (event) {
    $('#modal-gestisci').modal('toggle');

    let id = $('#modal-gestisci').attr('val');

    let result = segnalazioni[id - 1];

    result.stato = 2;
    removeFromMySeg(id);

    appendtoSeg(result);

    $('#ok-modal').modal('toggle');

});

$("#DEL").on("click", function (event) {
    $('#modal-gestisci').modal('toggle');

    let id = $('#modal-gestisci').attr('val');

    let result = segnalazioni[id - 1];


    result.stato = 3;

    removeFromMySeg(id);
    $('#no-modal').modal('toggle');


});

function removeFromMySeg(id) {
    $('#' + id).remove();
}

$("#registratibtn").on("click", function (event) {

    byPassLogin = true;

    validaLoginMock();

});

function getViaByLatLong(lat, long){
    let place = "";
    $.ajax({
        async: false,
        url: "http://open.mapquestapi.com/geocoding/v1/reverse?key=ZOwWyHSPqFu1airrcvdG5d05XcfGTln0&location="+ lat + "," + long + "&includeRoadMetadata=true&includeNearestIntersection=true",
        success: function (result) {
            console.log(result);
            debugger;
            place = result.results[0].locations[0].street;
        }
    });
    debugger;
    return place;
}
