var macarte = null;
var markerClusters; 
var markers = [];

//Set up le ping qui apparaitrat sur la carte
var myIcon = L.icon({
  iconUrl: "../Images/Ping.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [-3, -76],
});

function initMap() 
{
  //Place le Ping de départ sur la carte
  macarte = L.map('map').setView([44.868181, -0.547516], 4);

  markerClusters = L.markerClusterGroup(); 

  //Charge la carte 
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
  attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
  minZoom: 4,
  maxZoom: 20
  }).addTo(macarte);

  //On place les markers sur la carte en récupérant leurs coordonnées depuis l'API
  ListeStations();
}

function ListeStations()
{
  //Déclare une requete d'appel pour l'API -> pour récupérer toutes les stations
  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.jcdecaux.com/vls/v3/stations?apiKey=afc2870654d1c19b39d0278b671b5a148199b1c1', true);
  
  //On récupère la réponse
  request.onload = function () 
  {
    //On transforme le JSON en objet
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) 
    {
      //Parcours toutes les stations pour placer les pings sur la carte
      data.forEach(station => 
      {  
        //Place le marqueur sur la carte
        var marker = L.marker( [station.position.latitude, station.position.longitude], { icon: myIcon } ); 
        marker.bindPopup(station);
        markerClusters.addLayer(marker); 
        markers.push(marker);        
      });
    } 

    //Groupe les marqeurs proches
    var group = new L.featureGroup(markers); 
    //macarte.fitBounds(group.getBounds().pad(0.5)); 
    macarte.addLayer(markerClusters);

  }
  //Execution de l'appel de l'API
  request.send();
}

