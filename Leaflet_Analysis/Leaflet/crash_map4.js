// Initialize a Leaflet map
var map = L.map('map');

// Set the initial view and fit the bounds for Australia
var bounds = [
  [-44, 112], // Southwest coordinates
  [-10, 154]  // Northeast coordinates
];
map.setView([-25, 135], 4); // Set the initial view
map.fitBounds(bounds);

// Add base layers
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var otherBasemapLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create an object for base layers
var baseLayers = {
  'Open Street Map': osmLayer,
  'Topography Basemap': otherBasemapLayer
};

// Add the OpenStreetMap layer as the default layer
osmLayer.addTo(map);

// Add a control to switch between layers
L.control.layers(baseLayers).addTo(map);

// Define the createMarkers function
function createMarkers(crashData) {
  // Initialize an object to hold crash data by location
  var crashDataByLocation = {};

  function onEachFeature(feature, layer) {
    var locationKey = feature.properties['lat'] + ',' + feature.properties['lng'];
  
    // Retrieve the total number of crashes (count of unique crash IDs) for the specific location
    var totalCrashes = crashData.features.filter(function (f) {
      return f.properties['lat'] + ',' + f.properties['lng'] === locationKey;
    }).length;
  
    var maxFatalitiesRoadType = findMaxFatalitiesRoadType(feature, locationKey);
    var maxFatalitiesTimeOfDay = findMaxFatalitiesTimeOfDay(feature, locationKey);
    var maxFatalitiesSpeedLimit = findMaxFatalitiesSpeedLimit(feature, locationKey);
    var maxFatalitiesGender = findMaxFatalitiesGender(feature, locationKey);
    var maxFatalitiesAgeGroup = findMaxFatalitiesAgeGroup(feature, locationKey);
  
    // Customize the popup content with specific properties
    var popupContent = `
      <h3>${feature.properties['National LGA Name 2021']}</h3>
      <ul>
        <li><strong>Total Crashes:</strong> ${totalCrashes}</li>
        <li><strong>Total Fatalities:</strong> ${crashDataByLocation[locationKey]}</li>
        <li><strong>Speed Limit with Most Fatalities:</strong> ${maxFatalitiesSpeedLimit}</li>
        <li><strong>Time of Day with Most Fatalities:</strong> ${maxFatalitiesTimeOfDay}</li>
        <li><strong>National Road Type with Most Fatalities:</strong> ${maxFatalitiesRoadType}</li>
        <li><strong>Gender with Most Fatalities:</strong> ${maxFatalitiesGender}</li>
        <li><strong>Age Group with Most Fatalities:</strong> ${maxFatalitiesAgeGroup}</li>
      </ul>
    `;
    layer.bindPopup(popupContent);
  }

  function findMaxFatalitiesRoadType(feature, locationKey) {
    // Filter features at the same location
    var sameLocationFeatures = crashData.features.filter(function (f) {
      return f.properties['lat'] + ',' + f.properties['lng'] === locationKey;
    });

    // Create an object to count fatalities by road type
    var fatalitiesByRoadType = {};

    sameLocationFeatures.forEach(function (f) {
      var roadType = f.properties['National Road Type'];
      var fatalities = f.properties['Number Fatalities'];
      fatalitiesByRoadType[roadType] = (fatalitiesByRoadType[roadType] || 0) + fatalities;
    });

    // Find the road type with the most fatalities
    var maxFatalities = 0;
    var maxFatalitiesType = '';

    for (var roadType in fatalitiesByRoadType) {
      if (fatalitiesByRoadType[roadType] > maxFatalities) {
        maxFatalities = fatalitiesByRoadType[roadType];
        maxFatalitiesType = roadType;
      }
    }

    return maxFatalitiesType;
  }

  function findMaxFatalitiesTimeOfDay(feature, locationKey) {
    // Filter features at the same location
    var sameLocationFeatures = crashData.features.filter(function (f) {
      return f.properties['lat'] + ',' + f.properties['lng'] === locationKey;
    });

    // Create an object to count fatalities by time of day
    var fatalitiesByTimeOfDay = {
      Morning: 0,
      Afternoon: 0,
      Evening: 0,
      Night: 0,
    };

    sameLocationFeatures.forEach(function (f) {
      var timeOfDay = f.properties['Time of Day'];
      var fatalities = f.properties['Number Fatalities'];
      fatalitiesByTimeOfDay[timeOfDay] += fatalities;
    });

    // Find the time of day with the most fatalities
    var maxFatalities = 0;
    var maxFatalitiesTime = '';

    for (var timeOfDay in fatalitiesByTimeOfDay) {
      if (fatalitiesByTimeOfDay[timeOfDay] > maxFatalities) {
        maxFatalities = fatalitiesByTimeOfDay[timeOfDay];
        maxFatalitiesTime = timeOfDay;
      }
    }

    return maxFatalitiesTime;
  }

  function findMaxFatalitiesSpeedLimit(feature, locationKey) {
    // Filter features at the same location
    var sameLocationFeatures = crashData.features.filter(function (f) {
      return f.properties['lat'] + ',' + f.properties['lng'] === locationKey;
    });

    // Create an object to count fatalities by speed limit
    var fatalitiesBySpeedLimit = {};

    sameLocationFeatures.forEach(function (f) {
      var speedLimit = f.properties['Speed Limit'];
      var fatalities = f.properties['Number Fatalities'];
      fatalitiesBySpeedLimit[speedLimit] = (fatalitiesBySpeedLimit[speedLimit] || 0) + fatalities;
    });

    // Find the speed limit with the most fatalities
    var maxFatalities = 0;
    var maxFatalitiesSpeed = '';

    for (var speedLimit in fatalitiesBySpeedLimit) {
      if (fatalitiesBySpeedLimit[speedLimit] > maxFatalities) {
        maxFatalities = fatalitiesBySpeedLimit[speedLimit];
        maxFatalitiesSpeed = speedLimit;
      }
    }

    return maxFatalitiesSpeed;
  }

  function findMaxFatalitiesGender(feature, locationKey) {
    // Filter features at the same location
    var sameLocationFeatures = crashData.features.filter(function (f) {
      return f.properties['lat'] + ',' + f.properties['lng'] === locationKey;
    });

    // Create an object to count fatalities by gender
    var fatalitiesByGender = {};

    sameLocationFeatures.forEach(function (f) {
      var gender = f.properties['Gender_Fatalities'];
      var fatalities = f.properties['Number Fatalities'];
      fatalitiesByGender[gender] = (fatalitiesByGender[gender] || 0) + fatalities;
    });

    // Find the gender with the most fatalities
    var maxFatalities = 0;
    var maxFatalitiesGender = '';

    for (var gender in fatalitiesByGender) {
      if (fatalitiesByGender[gender] > maxFatalities) {
        maxFatalities = fatalitiesByGender[gender];
        maxFatalitiesGender = gender;
      }
    }

    return maxFatalitiesGender;
  }

  function findMaxFatalitiesAgeGroup(feature, locationKey) {
    // Filter features at the same location
    var sameLocationFeatures = crashData.features.filter(function (f) {
      return f.properties['lat'] + ',' + f.properties['lng'] === locationKey;
    });

    // Create an object to count fatalities by age group
    var fatalitiesByAgeGroup = {};

    sameLocationFeatures.forEach(function (f) {
      var ageGroup = f.properties['Age Group_Fatalities'];
      var fatalities = f.properties['Number Fatalities'];
      fatalitiesByAgeGroup[ageGroup] = (fatalitiesByAgeGroup[ageGroup] || 0) + fatalities;
    });

    // Find the age group with the most fatalities
    var maxFatalities = 0;
    var maxFatalitiesAgeGroup = '';

    for (var ageGroup in fatalitiesByAgeGroup) {
      if (fatalitiesByAgeGroup[ageGroup] > maxFatalities) {
        maxFatalities = fatalitiesByAgeGroup[ageGroup];
        maxFatalitiesAgeGroup = ageGroup;
      }
    }

    return maxFatalitiesAgeGroup;
  }

  // Loop through the crash data and accumulate total fatalities by location
  crashData.features.forEach(function (feature) {
    var locationKey = feature.properties['lat'] + ',' + feature.properties['lng'];
    crashDataByLocation[locationKey] = (crashDataByLocation[locationKey] || 0) + feature.properties['Number Fatalities'];
  });

  // Loop through the accumulated crash data by location and create markers
  for (var locationKey in crashDataByLocation) {
    var [lat, lng] = locationKey.split(',');
    var totalFatalities = crashDataByLocation[locationKey];

    var crashMarker = L.circleMarker([parseFloat(lat), parseFloat(lng)], {
      radius: Math.sqrt(totalFatalities) * 5, // Adjust the scaling factor as needed
      fillColor: 'orange',
      color: 'white',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6,
    });

    // Bind the popup to the marker using the onEachFeature function.
    onEachFeature(crashData.features.find(function (feature) {
      return feature.properties['lat'] + ',' + feature.properties['lng'] === locationKey;
    }), crashMarker);

    // Add the marker to the map.
    crashMarker.addTo(map);
  }
}

// Assemble the API query URL
let geoJSONUrl = "output_geojson.geojson";

// Get the data with D3
d3.json(geoJSONUrl).then(function (crashData) {
  createMarkers(crashData);
});

