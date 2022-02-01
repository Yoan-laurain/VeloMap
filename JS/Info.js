var MapCityWithContract = new Map();
var MapStationsOfCity= new Map();
var listCity =[];
getAllCityWithContract();

function getAllCityWithContract()
{
    //Déclare http request to call the API and retrieve stations datas
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.jcdecaux.com/vls/v3/contracts?apiKey=afc2870654d1c19b39d0278b671b5a148199b1c1', true);

    //When we get the answer
    request.onload = function () 
    {
        //Transform data into objects
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) 
        {
            //For each object we retrieve
            data.forEach(villes => 
            {  
                MapCityWithContract.set(villes.name,villes.commercial_name);          
            });
            createListCity();
        }
    }

    //Call API
    request.send();
}

function getAllStationsOfTheCity(city)
{
    MapStationsOfCity = new Map();
    //Déclare http request to call the API and retrieve stations datas
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.jcdecaux.com/vls/v3/stations?contract='+city+'&apiKey=afc2870654d1c19b39d0278b671b5a148199b1c1', true);

    //When we get the answer
    request.onload = function () 
    {
        //Transform data into objects
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) 
        {
            //For each object we retrieve
            data.forEach(stations => 
            {  
                MapStationsOfCity.set(stations.name,stations.contractName);   
            });
            CreateListStations();

        }
    }

    //Call API
    request.send();
}


function createListCity()
{
    MapCityWithContract = new Map([...MapCityWithContract.entries()].sort());

    var conteneur = document.getElementById("ConteneurListe");
    const listItems = [];

    for (const [key, value] of MapCityWithContract) 
    {
        listItems.push({"id":key});
    }

    listCity = listItems.map((d) => <div id={d.id} onClick={() => showListStations(d.id)} >{d.id}</div>);

    ReactDOM.render(ReactListCity(listCity),conteneur);
}

function showListStations(key)
{
    var cont = document.getElementById( "ConteneurListeStations") ;
    while (cont.firstChild) {
        cont.removeChild(cont.lastChild);
      }
    getAllStationsOfTheCity(key);
}

function ReactListCity(list){ return (<div>{ list } </div>) }

function CreateListStations()
{
    MapStationsOfCity = new Map([...MapStationsOfCity.entries()].sort());
    var conteneur = document.getElementById("ConteneurListeStations");
    var nomVille ="";
    const listStations = [];
    
    for (const [key, value] of MapStationsOfCity) 
    {
        listStations.push({"id":key});
        nomVille = value;
    }

    var list = listStations.map((d) => <div id={d.id}>{d.id}</div>);

    ReactDOM.render(ReactListCity(list),conteneur);

    document.getElementById("TitreStations").innerHTML = "Voici toutes les stations de " + nomVille;
}

