var myMap = null;
var markerClusters; 
var markers = [];
var MapNameContractStations = new Map();
var MapNumberContractStations = new Map();

//Set up shape of pings
var myIcon = L.icon({
  iconUrl: "../Images/Ping.png",
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [-3, -76],
});

/**
 * Create Map and call ListeStations method
 */
function initMap() 
{
  //Set the view of the map at the beginning
  myMap = L.map('map').setView([44.868181, -0.547516], 4);

  //Load Map
  L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
  attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
  minZoom: 4,
  maxZoom: 20
  }).addTo(myMap);

  //Place markers on the map from API data
  ListStations();

  //Group close markers
  markerClusters = L.markerClusterGroup(); 
}

/**
 * Call API and retrieve all stations , create and place markers on the map
 */
function ListStations()
{
  //Déclare http request to call the API and retrieve stations datas
  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.jcdecaux.com/vls/v3/stations?apiKey=afc2870654d1c19b39d0278b671b5a148199b1c1', true);
  
  //When we get the answer
  request.onload = function () 
  {
    //Transform data into objects
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) 
    {
      //For each object we retrieve
      data.forEach(station => 
      {  
        //Set marker on map
        var marker = L.marker( [station.position.latitude, station.position.longitude], { icon: myIcon } ).on('click', function(e) {
          InfoStation(station.number,station.contractName);
        });

        MapNameContractStations.set(station.name,station.contractName);
        MapNumberContractStations.set(station.name,station.number)
       
        markerClusters.addLayer(marker); 
        markers.push(marker);        
      });
    } 

    L.featureGroup(markers);
    myMap.addLayer(markerClusters);
  }

  //Call API
  request.send();
}

/**
 * Call API and retrieve informations of the stations matching with parameters
 * Show the section of the informations of the station and fill his fiels with the informations
 * @param {*} number number of the station
 * @param {*} contractName contractName of the station
 */
function InfoStation(number,contractName)
{
  //Display the div for informations of the station
  document.getElementById("InfoStation").style = "display : flex;";

  //Request to get information of a specific station 

  var request = new XMLHttpRequest();
  request.open('GET', 'https://api.jcdecaux.com/vls/v3/stations/'+number+'?contract='+contractName+'&apiKey=afc2870654d1c19b39d0278b671b5a148199b1c1', true);

  //When we retrieve data
  request.onload = function () 
  {
    //Transform data into objects
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400) 
    {
      document.getElementById("Name").innerHTML = ( data.name == "" ? "Non renseigné" : data.name );
      document.getElementById("Status").innerHTML = ( data.status == "" ? "Non renseigné" : data.status );
      document.getElementById("Address").innerHTML = ( data.address == "" ? "Adresse non renseigné" : data.address );
      document.getElementById("nbBikes").innerHTML = ( data.mainStands.availabilities.bikes === "" ? "Non renseigné" : data.mainStands.availabilities.bikes + " Vélo(s) disponible(s)" );
      document.getElementById("mechanicalBikes").innerHTML = ( data.mainStands.availabilities.mechanicalBikes === "" ? "Non renseigné" : data.mainStands.availabilities.mechanicalBikes + " Vélo(s) méchanique(s)" );
      document.getElementById("electricalBikes").innerHTML = ( data.mainStands.availabilities.electricalBikes === "" ? "Non renseigné" : data.mainStands.availabilities.electricalBikes + " Vélo(s) electrique(s)" );
      document.getElementById("MajData").innerHTML = "Recensement : " + ( data.lastUpdate == "" ? "Non renseigné" : convertDate(data.lastUpdate) );
      document.getElementById("BikeCapacity").innerHTML = "Capacité totale : " + ( data.mainStands.capacity == "" ? "Non renseigné" : data.mainStands.capacity + " Vélos" );
      document.getElementById("Banking").innerHTML = "Terminal de paiement : " + ( data.banking == "" ? "non renseigné" : data.banking ? "Disponible" : "Non disponible" );
      document.getElementById("overflow").innerHTML = "Repose de vélo : " +( data.overflow == "" ? "Non renseigné" : data.overflow ? "Autorisé" : "Refusé" );
      document.getElementById("connected").innerHTML = ( data.connected == "" ? "Connexion au terminal central non renseigné" : data.connected ? "Connecté au terminal central" : "Non connecté au terminal central" );
      myMap.flyTo(new L.LatLng(data.position.latitude, data.position.longitude), 15);
    }

  
  }
 
  //ECall API
  request.send();
}

/**
 * When you click the close button of station information section
 * Hide section and empty fields
 */
var leftBand = document.getElementById("close");
leftBand.onclick = function() 
{ 
  document.getElementById("InfoStation").style = "display : none;";
  document.getElementById("recherche").value = "";
  var blocInfo = document.getElementById("InfoStation");

  try{
    blocInfo.removeChild(document.getElementById("resultSearch"));
  }catch{}

};


var searchButton = document.getElementById("search");
var searchInput =  document.getElementById("recherche");

/**
 * When user type on search input
 * Call searchStationsOnName method 
 * Create a field with informations of the 5 first matching stations name
 */
searchInput.onkeyup = function(){

  var result = searchStationsOnName( searchInput.value ) ;
  var blocInfo = document.getElementById("InfoStation");
  var inputHolder = document.getElementById("search-wrapper-active");

  if (searchInput.value != "" )
  {
    try
    {
      blocInfo.removeChild(document.getElementsByClassName("resultSearch"));
    }catch{}

    if ( result.size > 0)
    {
      let ConteneurResult = document.createElement("div");
      ConteneurResult.className = "resultSearch"
      blocInfo.insertBefore(ConteneurResult, blocInfo.children[1]);

      var compteur = 0;
      for (const [key, value] of result) 
      {
        if ( compteur < 5 )
        {
          let child = document.createElement("div");
          child.id = "ResultChild";

          let text = document.createElement("span");
          text.id = "TexteResult"; 
          text.innerHTML = key;

          text.onclick = function () 
          {
            searchInput.value = text.innerHTML;
            try
            {
              blocInfo.removeChild(document.getElementsByClassName("resultSearch"));
            }catch{}
          }

          child.appendChild(text);

          ConteneurResult.appendChild(child);
          compteur++;
          
        }
        else{break;}
      }
    }
  }
  else
  {
    try{
      blocInfo.removeChild(document.getElementsByClassName("resultSearch"));
    }catch{}
  }

  if ( document.getElementsByClassName("resultSearch"))
  {
    inputHolder.style="	border-bottom:5px solid black;";
  }
  else
  {
    inputHolder.style="	border-bottom:0px solid black;";
  }

};

/**
 * When user click on search button
 * Try to load the station matching with the search input value
 */
searchButton.onclick = function() { 

  var blocInfo = document.getElementById("InfoStation");
  if (MapNumberContractStations.get( searchInput.value ) != undefined && MapNameContractStations.get(searchInput.value) != undefined )
  {
    InfoStation( MapNumberContractStations.get( searchInput.value ),MapNameContractStations.get(searchInput.value) );
  }
  else{
    alert("This station doesn't exist.");
  }
  try{
    blocInfo.removeChild(document.getElementById("resultSearch"));
  }catch{}
  searchInput.value="";
};

/**
 * Retrieve all stations name matching with the parameter
 * @param {*} word word typing in the reseach bar AKA name of the station the user is looking for
 * @returns a map key = stationName, value = ContractName of the matching stations
 */
function searchStationsOnName(word){

  var correspondance = new Map();
  for (const [key, value] of MapNameContractStations) 
  {
    if (key.match(new RegExp(word.toUpperCase())) != null )
    {
      if ( correspondance.length >= 5 ) {
        break;
      }
      correspondance.set(key,value);
    }
  }
  return correspondance;
}

/**
 * Convert the date value to a readeable date 
 * @param {*} date to convert
 * @returns the Formatted date
 */
function convertDate(date)
{
  var FormattedDate = date.substring(0, 10);
  FormattedDate += " à " + date.substring(11, 13) + " " + date.substring(13, 16);
  FormattedDate = FormattedDate.replace(":"," H ");
  return FormattedDate;
}