$( document ).ready(function() {
    // mapbox initialization
  L.mapbox.accessToken = 'pk.eyJ1Ijoiam9uYXRoYW56d2hpdGUiLCJhIjoiWVE1TGVtayJ9.HrKCwb0HolE2rM9tmi_OZQ';

  var map = L.mapbox.map('map', 'mapbox.streets');
  map.setView([33.7550, -84.3900], 12);

  var schoolsLayer = _createSchoolsLayer();
  var crimesLayer = _createCrimesLayer();

  map.addLayer(schoolsLayer);
  map.addLayer(crimesLayer);
});

function _createCrimesLayer() {
  var crimesLayer = new L.MarkerClusterGroup();

  crimes.forEach(function(crime) {
    if (!crime.x ||
      !crime.y ||
      !crime.occur_date ||
      isNaN(crime.x) ||
      isNaN(crime.y)) {
      return;
    }

    var marker = L.marker(new L.LatLng(crime.y, crime.x), {
      icon: L.mapbox.marker.icon({
        'marker-symbol': 'cross',
        'marker-color': 'EA623D'
      }),
    });

    marker.bindPopup(crime['UC2 Literal']);
    crimesLayer.addLayer(marker);
  });

  return crimesLayer;
}

function _createSchoolsLayer() {
  var schoolsLayer = L.mapbox.featureLayer();
  var schoolsGeoJson = [];

  schools.forEach(function(school) {
      schoolsGeoJson.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [ school.SCHOOL_LONG, school.SCHOOL_LAT]
        },
        properties: {
          'marker-color': '#5381FF',
          "marker-size": "large",
          "marker-symbol": 'warehouse',

          name: school.SCHOOL_NAME,
          county: school.COUNTY,
          sat: school.SAT_COMBINED,
          ccpri: school.CCPRI
        },
      });
  });

  schoolsLayer.setGeoJSON(schoolsGeoJson);

  schoolsLayer.eachLayer(function(layer) {
    var content = '<h2>' + layer.feature.properties.name + '<\/h2>' +
        '<p>County: ' + layer.feature.properties.county + '<br \/>' +
        '<p>CCPR: ' + layer.feature.properties.ccpri + '<br \/>' +
        'SAT: ' + layer.feature.properties.sat + '<\/p>';
    layer.bindPopup(content);
  });

  return schoolsLayer;
}
