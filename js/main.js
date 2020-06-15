// select the button using ID
var button = document.querySelector('#translateBtn');
var button2 = document.querySelector('#MapBtn');
var button3 = document.querySelector('#LocalStorage');
var userInput = document.querySelector('#userInput');
var resultInputCases = document.querySelector('#result1');
var resultInputTodayCases = document.querySelector('#result2');
var resultInputDeaths = document.querySelector('#result3');
var resultInputTodayDeaths = document.querySelector('#result4');
var resultInputRecovered = document.querySelector('#result5');
var resultInputActive = document.querySelector('#result6');
var resultInputCritical = document.querySelector('#result7');
var resultInputCasesPerMillion = document.querySelector('#result8');
var resultLat = document.querySelector('#result58');
var resultLong = document.querySelector('#result59');
var TotalCases = document.querySelector('#result101');
var TotalRecovered = document.querySelector('#result102');
var TotalDeaths = document.querySelector('#result103');

var divContainer = document.getElementById('#result10');

class SearchObj {     // SEARCH IN LOCAL STORAGE

    count;
    lastSearched;
    constructor(count, lastSearched) {
      this.count= count;
      this.lastSearched= lastSearched;
    }
  }

var loadingDiv = document.querySelector('#loading');

var mymap = L.map('mapid').setView([49, 15], 4);

button.onclick = function () {
    // show the loading dialog
    loadingDiv.style.display = 'block';
    // disable  button
    button.setAttribute('disabled','disabled');

    console.log(userInput.value);
    var inputText = userInput.value;
    
    resultInputCases.value = inputText;
    var Lat = resultLat.value;
    var Long = resultLong.value;
    // REST API url endpoint
    var url = 'https://corona.lmao.ninja/v2/countries/' + inputText;

    // create the GET request against API to obtain JSON result
    fetch(url)
    .then(function(response) {
        // server returns the response, parse it to JSON
        return response.json();
    })
    .then(function(myJson) {
            // JSON DATA
            resultInputCases.value = myJson.cases;
            resultInputTodayCases.value = myJson.todayCases;
            resultInputDeaths.value = myJson.deaths;
            resultInputTodayDeaths.value = myJson.todayDeaths;
            resultInputRecovered.value = myJson.recovered;
            resultInputActive.value = myJson.active;
            resultInputCritical.value = myJson.critical;
            resultInputCasesPerMillion.value = myJson.casesPerOneMillion;
            resultLat.value = myJson.countryInfo.lat;
            resultLong.value = myJson.countryInfo.long;
            loadingDiv.style.display = 'none';          // hide the loading dialog
            button.removeAttribute('disabled');         // enable translate button

            mymap.setView([resultLat.value, resultLong.value], 6)
    });
   
   
    var datas;
    
    


    if (typeof(Storage) !== "undefined") {
        // Store
        datas = new Map(JSON.parse(localStorage.getItem("SearchCountry")));
        if (datas) {
            var search = datas.get(inputText)
            if (search) {
                search.count++;
                search.lastSearched = new Date();
                                
            }
            else{
                datas.set(inputText, new SearchObj(1, new Date()));          
            }
        }
        else{// FIRST SEARCH
            datas = new Map();
            datas.set(inputText, new SearchObj(1, new Date()));          
        }

        localStorage.setItem("SearchCountry", JSON.stringify([...datas.entries()]));
        
        // Retrieve
        console.log(datas)
        
        document.getElementById("datas").innerHTML = localStorage.getItem("SearchCountry");
       
     
      } else {
        document.getElementById("datas").innerHTML = "Sorry, your browser does not support Web Storage...";
       
    }

   


    
    
    var table4 = document.getElementById("tabledata"); // LOCAL STORAGE TABLE
    
    var mapIterator = datas.entries();
    for (const searchObj of mapIterator) {
        var row = table4.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        
        cell1.innerHTML = searchObj[0]; 
        cell2.innerHTML = searchObj[1].count; 
        cell3.innerHTML = searchObj[1].lastSearched; 
    }
    
    


    
}


button2.onclick = function () {
    var url1 = 'https://disease.sh/v2/jhucsse';
    var url4 = 'https://disease.sh/v2/all';

    // create the GET request against API to obtain JSON result
    fetch(url1)
    .then(function(response) {
        // server returns the response, parse it to JSON
        return response.json();
    })
    .then(function(myJson2) {
               

        function getColor(d) { // color selection
            return d > 80000 ? '#800000' :
                   d > 60000  ? '#BD0026' :
                   d > 40000  ? '#E31A1C' :
                   d > 20000  ? '#FC4E2A' :
                   d > 10000   ? '#FD8D3C' :
                   d > 5000   ? '#FEB24C' :
                   d > 1000   ? '#FED976' :
                              '#FFEDA0';
        }  

                  
            mymap.createPane('labels');
            mymap.getPane('labels').style.zIndex = 650;
            mymap.getPane('labels').style.pointerEvents = 'none';
            var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
                
        }).addTo(mymap);
        
        var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
                attribution: '©Data from Johns Hopkins University,build with ©OpenStreetMap and ©CartoDB, ',
                pane: 'labels'
        }).addTo(mymap);
            var arrayOfObjects = myJson2;
            
            for (var i = 0; i < arrayOfObjects.length; i++) { // circle definition
                
                               var circle = L.circle([arrayOfObjects[i].coordinates.latitude, arrayOfObjects[i].coordinates.longitude], {
                                weight: 2,
                                opacity: 1,
                                color: 'white',
                                dashArray: '3',
                                fillColor: getColor(arrayOfObjects[i].stats.confirmed),
                                fillOpacity: 0.7,
                                radius: arrayOfObjects[i].stats.confirmed + 30000,
                            }).addTo(mymap);
                            if(arrayOfObjects[i].province!=null){
                               circle.bindPopup('<b>Country: </b>'+arrayOfObjects[i].country+'<br>'+ '<b>Province: </b>'+arrayOfObjects[i].province+'<br>'+"<b>Cases: </b>"+ arrayOfObjects[i].stats.confirmed); }
                               else {
                                circle.bindPopup('<b>Country: </b>'+arrayOfObjects[i].country+'<br>'+ "<b>Cases: </b>"+ arrayOfObjects[i].stats.confirmed); ;
                              }
                    }
	     
            });fetch(url4)
            .then(function(response) {
                // server returns the response, parse it to JSON
                return response.json();
            })
            .then(function(myJson4) {

                TotalCases.value = myJson4.cases;
                TotalRecovered.value = myJson4.recovered;
                TotalDeaths.value = myJson4.deaths;
              




            })
}

// CreateTableFromJSON
function CreateTableFromJSON(inputSort) { 
    var url2 = 'https://disease.sh/v2/countries?sort=' + inputSort;

    // create the GET request against API to obtain JSON result
    fetch(url2)
    .then(function(response) {
        // server returns the response, parse it to JSON
        return response.json();
    })
    .then(function(myJson) {
        
            //resultInputCountry.value = myJson;

            //var arrayOfObjects = myJson;
    var TableJson = myJson;
        

    // EXTRACT VALUE FOR HTML HEADER. 
    var col = [];
    for (var i = 0; i < TableJson.length; i++) {
        
        for (var key in TableJson[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 1; i < 2; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        
        th.innerHTML = col[i];
        tr.appendChild(th);
        
    }
    for (var i = 3; i < 11; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        
        th.innerHTML = col[i];
        tr.appendChild(th);
        
    }
    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < TableJson.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 1; j < 2; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = TableJson[i][col[j]];
            
        }
        for (var j = 3; j < 11; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = TableJson[i][col[j]];
            
        }
    }
    

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
});


}

