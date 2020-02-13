// var gestisciSegnalazioni = false;
var isAdmin = true;
var isLogged = true;
var userMail;
var userPass;
var map;
var LayerMarkers;
var idUtente;
var seg;

var segnalazioni;

$(document).ready(function() {
    console.log("ready!");

    segnalazioni = [];


    //da levare quando testi
    validaLoginMock();

    initMap();

    caricaSegnalazioniAll();

});

function validaLoginMock() {
    userMail = document.getElementById("emailLogIn").value;
    userPass = document.getElementById("passLogIn").value;



    //admin
    if ((isAdmin && isLogged) || userMail == "admin@admin.it" && userPass == "admin") {
        isAdmin = true;
        isLogged = true;
        $('#accediRegistrati').modal('hide');
        document.getElementById("gestisci").hidden = false;
        $("#gestisci").show();

        // document.getElementById("gotoprofilo").classList.remove("disabled");
        document.getElementById("gotoprofilo").hidden = false;
        $('#wrongCred').hide();
        $('#entra').hide();
        $('#esci').show()
        $('#loginlink').hide();
        $('#logoutlink').show()
    }
    //user
    else if ((isLogged) || userMail == "user@user.it" && userPass == "user") {
        isAdmin = false;
        isLogged = true;
        $('#accediRegistrati').modal('hide');
        // document.getElementById("gotoprofilo").classList.remove("disabled");
        document.getElementById("gotoprofilo").hidden = false;
        $('#wrongCred').hide();
        $('#entra').hide();
        $('#esci').show()
        $('#loginlink').hide();
        $('#logoutlink').show()
        document.getElementById("gestisci").hidden = true;
    } else {
        $('#wrongCred').show();
        document.getElementById("gestisci").hidden = true;
    }
}

function logOut() {
    isAdmin = false;
    isLogged = false;
    $('#gestisci').hide()
    // document.getElementById("gotoprofilo").classList.add("disabled");
    document.getElementById("gotoprofilo").hidden=true;
    $('#esci').hide()
    $('#entra').show();
    $('#logoutlink').hide()
    $('#loginlink').show();
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

$(function() {
    $('.btn-group-fab').on('click', '.btn', function() {
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
        success: function(result) {
            console.log(result.results[0]);
        }
    });
   
}

function assignSegnalazioni(result){
    segnalazioni = result;
    for (i = 0; i < result.length; i++){
       generateSegnalazione(result[i]);
    }
}

function caricaSegnalazioniAll(){
    $.ajax({
        url: "json/segnalazioni-base.json",
        success: function(result) {

            debugger;
            console.log(result);
            assignSegnalazioni(result);
            var projectTo = map.getProjectionObject();
            var epsg4326 =  new OpenLayers.Projection("EPSG:4326");
            var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
            for (var i = 0; i < result.length; i++){
                  
                   var lon = result[i].lon;
                   var lat = result[i].lat;
                   
                    var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point( lon, lat ).transform(epsg4326, projectTo),
                            {description: "marker number " + i} ,
                            {externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
                        );             
                    vectorLayer.addFeatures(feature);

            }
            map.addLayer(vectorLayer);
        }, 
        error: function(result){
            console.log(result);
        }
        
    });
}

function generateSegnalazione(result){
    let segnalazioneHTML = $("#segnalazioneFake");

    console.log(result.stato);

    if (result.stato == 2){
        let seg = segnalazioneHTML.clone();
        seg.find(".immagine").attr("src", result.images.length == 0 ? "https://via.placeholder.com/64x64/ebebeb/808080/?text=Immagine" : result.images[0]);
        seg.find(".titolo").html( result.titolo);
        seg.find(".corpo").html(result.testo);
        seg.attr("id", result.id);
        seg.show();
        
        $("#seg").append(seg);
        $("#seg2").append(seg);
    } else if (result.stato == 1){
        let seg = segnalazioneHTML.clone();
        seg.find(".immagine").attr("src", result.images.length == 0 ? "https://via.placeholder.com/64x64/ebebeb/808080/?text=Immagine" : result.images[0]);
        seg.find(".titolo").html( result.titolo);
        seg.find(".corpo").html(result.testo);
        seg.attr("id", result.id);
        seg.show();
        
        $("#seg2").append(seg);
    } else if (result.stato == 3){
        let seg = segnalazioneHTML.clone();
        seg.find(".immagine").attr("src", result.images.length == 0 ? "https://via.placeholder.com/64x64/ebebeb/808080/?text=Immagine" : result.images[0]);
        seg.find(".titolo").html( result.titolo);
        seg.find(".corpo").html(result.testo);
        seg.attr("id", result.id);
        seg.show();
        
        $("#seg2").append(seg);
    }

    function addSegnalazione(){
        let modal = $("#modal-addSegnalazione");
        seg = segnalazioni[0];

        seg.luogo = modal.find(".luogo");

        if (navigator.geolocation && seg.luogo != "" && seg.luogo != undefined && seg.luogo != null) {
            navigator.geolocation.getCurrentPosition(assignlatlon);
        }

        

        seg.id=segnalazioni.length;
        seg.titolo = modal.find("#titoloadd").html;
        seg.testo = modal.find("#descrizione").html;
        seg.autore = idUtente;
        seg.stato = 1;
        seg.images.add(modal.find(".image"));
        seg.data = Date.now();

        segnalazioni.add(seg);

        generateSegnalazione(seg);
    }

    function assignlatlon(position){
        seg.lat = posizione.coords.latitude; 
        seg.lon = posizione.coords.longitude;
    }
}