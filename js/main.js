// var gestisciSegnalazioni = false;
var isAdmin = true;
var isLogged = true;
var userMail;
var userPass;
var map;

var segnalazioni;

$(document).ready(function() {
    console.log("ready!");

    //da levare quando testi
    validaLoginMock();

    initMap();

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

// $(document).click(function(event) {
//     console.log($(event.target));
// });


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

    var LayerMarkers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(LayerMarkers);

}



//LA SEGUENTE FUNZIONE SERVIRÀ A CERCA IL POSTO DELLA SEGNALAZIONE
function getPosition(place) {
    $.ajax({
        url: "http://open.mapquestapi.com/geocoding/v1/address?key=ZOwWyHSPqFu1airrcvdG5d05XcfGTln0&location=" + place + ", BA",
        success: function(result) {
            console.log(result.results[0]);
        }
    });

    //AGGIUNGI MARKER DI SEGUITO
    // LayerMarkers.addMarker(new OpenLayers.Marker(LonLat));
}

// ZOwWyHSPqFu1airrcvdG5d05XcfGTln0

// C2Nn3TEHOh28mjfr