let mapView = new ol.View({
    center: [8942183.375932872, 2694054.933844003],
    zoom: 4,
    //extent: [5709381.317080659, 752789.8137997919, 12223402.301201582, 4451081.33075584],
});

let map = new ol.Map ({
    target: 'map',
    view: mapView,
    controls: []
});

let osmTile = new ol.layer.Tile({
    title: 'os map',
    visible: true,
    source: new ol.source.OSM()
});

map.addLayer(osmTile);

let worldcont = new ol.layer.Tile({
    title: 'world continents',
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/wld_map/wms?',
        params: {'LAYERS': 'wld_map:World_Continents', 'TILED': true},
        servertype: 'geoserver',
        visible: true
    })
});
//map.addLayer(worldcont);

let indiaroadstile = new ol.layer.Tile({
    title: 'india roads',
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/wms?',
        params: {'LAYERS': 'statepath', 'TILED': true},
        servertype: 'geoserver',
        visible: true
    })
});
map.addLayer(indiaroadstile);

let boxLayer;
let boundaryLayer;
let boxExtent;
let boxRes;
var boxInteraction = new ol.interaction.DragBox();
boxInteraction.on('boxend', (evt) =>{
    let coordinates = boxInteraction.getGeometry().getCoordinates();
    boxExtent = boxInteraction.getGeometry().getExtent();
    let polygonFeature = new ol.Feature(
        new ol.geom.Polygon(coordinates));
        boxLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
              features: [polygonFeature]
            }),
            style: new ol.style.Style({
              stroke: new ol.style.Stroke({
                width: 1,
                color: [0, 0, 0, 1]
              }),
               fill: new ol.style.Fill({
                 color: [0,130,0,0.2]
               })
            })
          }); 
          map.addLayer(boxLayer);
          boundaryLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
              features: [polygonFeature]
            }),
            style: new ol.style.Style({
              stroke: new ol.style.Stroke({
                width: 1,
                color: [0, 0, 0, 1]
              }),
            })
          }); 
          boxInteraction.on('boxstart', (evt) => {
              map.removeLayer(boxLayer);
          });
          
          document.addEventListener('keyup', (event) => {
            var name = event.key;
            if (name === 'Enter') {
                //boxButton.classList.toggle('clicked');
                document.getElementById("map").style.cursor = "default";
                map.removeInteraction(boxInteraction);
                map.removeControl(boxControl);
                indiaroadstile.setExtent(boxExtent);
                map.addLayer(indiaroadstile);
                map.addLayer(boundaryLayer);
                map.removeLayer(boxLayer);
                map.getView().fit(boxExtent);
                console.log(boxExtent);            
            }
        }, false);  
});





/*boxInteraction.on('boxend', function(){
    var boxExtent = boxInteraction.getGeometry().getExtent();
   // console.log(boxExtent);
   indiaroadstile.setExtent(boxExtent);
   //map.target = 'map2';
   map.getView().fit(boxExtent);
});*/
// var boxInteraction = new ol.interaction.Draw({
//         type: 'Circle',
//         geometryFunction: geometryFunction,          
//     });

//<--start box from here-->
/*
var source = new ol.source.Vector({wrapX: false});
*/ 
//<--end box here-->
var boxButton = document.createElement('button');
boxButton.innerHTML = '<img src="resources/image/box.webp" alt="" style="width:18px;height:18px"></>';
boxButton.className = 'myButton';
boxButton.id = 'boxButton';

var belement = document.createElement('div');
belement.className = 'boxButtonDiv';
belement.appendChild(boxButton);

var boxControl = new ol.control.Control({
    element: belement
})

var bFlag = false;
boxButton.addEventListener("click",() =>{
    boxButton.classList.toggle('clicked');
    bFlag = !bFlag;
    if (bFlag) {
        document.getElementById("map").style.cursor = "crosshair";
        map.addInteraction(boxInteraction);
    } else {
        map.removeInteraction(boxInteraction);
        document.getElementById("map").style.cursor = "default";
    }
})

map.addControl(boxControl);


var cancelButton = document.createElement('button');
cancelButton.innerHTML = '<img src="resources/image/cancel.png" alt="" style="width:18px;height:18px"></>';
cancelButton.className = 'myButton';
cancelButton.id = 'cancelButton';

var cancelElement = document.createElement('div');
cancelElement.className = 'cancelButtonDiv';
cancelElement.appendChild(cancelButton);

var cancelControl = new ol.control.Control({
    element: cancelElement
})

cancelButton.addEventListener("click",() =>{
    location.href= "map.html";
})

map.addControl(cancelControl);


//vector layer
const vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: './vector_layer/map.geojson',
        format: new ol.format.GeoJSON()
    }),
    visible: true,
    title: 'empty vector layer'
})
map.addLayer(vectorLayer);