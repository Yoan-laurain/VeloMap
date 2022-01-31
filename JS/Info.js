var MapCityWithContract = new Map();
var MapStationsOfCity= new Map();

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
            console.log(data);
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
    var Parent = document.getElementById("ContentInfoDroite");

    for (const [key, value] of MapCityWithContract) 
    {
        var myDiv = document.createElement("div");
        myDiv.id = key;
        myDiv.innerHTML = key;

        myDiv.onclick = function () 
        {
            try
            {
                Parent.removeChild(document.getElementById("ConteneurListeStations"));
                var myContent = document.createElement("div");
                myContent.id = "ConteneurListeStations";
                myContent.setAttribute("data-aos","fade-left");
                Parent.appendChild(myContent);
            }catch{}
            getAllStationsOfTheCity(key);
        }
        conteneur.appendChild(myDiv);
    }
    //document.getElementById("amiens").click();
}

function CreateListStations()
{
    MapStationsOfCity = new Map([...MapStationsOfCity.entries()].sort());
    var conteneur = document.getElementById("ConteneurListeStations");
    var nomVille ="";

    for (const [key, value] of MapStationsOfCity) 
    {
        var myDiv = document.createElement("div");
        myDiv.id = key;
        myDiv.innerHTML = key;

        conteneur.appendChild(myDiv);
        nomVille = value;
    }

    document.getElementById("TitreStations").innerHTML = "Voici toutes les stations de " + nomVille;
}

