// logic.js

// Initialize a Chart.js chart
var ctx = document.getElementById('chart-container').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],  // Provide labels based on your data
        datasets: [{
            label: 'Data Label',
            data: [],  // Provide data based on your data
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    },
    options: {
        // Customize chart options (e.g., title, axis labels)
    },
});

// Fetch crash data from your API
fetch('/api/crash-data')
    .then(response => response.json())
    .then(data => {
        // Process the data and populate the visualizations and HTML content
        updateVisualizations(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Function to initialize a Chart.js chart with data
function initializeChart(data) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Data Label',
                data: data.values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            // Customize chart options (e.g., title, axis labels)
        },
    });
}

// Function to initialize a Leaflet map
function initializeMap() {
    var map = L.map('map').setView([latitude, longitude], zoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Add markers, polygons, or other map features
}

// Assuming data is an array of objects representing crash data
data.forEach(item => {
    // Update the code to use the actual data attributes
    const row = table.insertRow();
    const cell1 = row.insertCell(0);
    cell1.textContent = item.property1;
    const cell2 = row.insertCell(1);
    cell2.textContent = item.property2;
    // Add more cells as needed
});

// Event listener for the year filter
yearFilter.addEventListener('change', function() {
    const selectedYear = yearFilter.value;

    // Call a function to update data and visualizations based on the selected year
    updateData(selectedYear);
});

// Function to fetch filtered data based on the selected year
function updateData(selectedYear) {
    fetch(`/api/crash-data?year=${selectedYear}`)
        .then(response => response.json())
        .then(data => {
            // Process the data and update visualizations and HTML content
            updateVisualizations(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to update the Chart.js chart with new data
function updateChart(chart, data) {
    chart.data.labels = data.labels;
    chart.data.datasets[0].data = data.values;
    chart.update();
}

// Function to update the Leaflet map with new data
function updateMap(map, data) {
    // Update the map with new data (e.g., add markers or update their positions)
}

// Fetch data from the API and update the Chart.js chart and Leaflet map
fetch('/api/data')
    .then(response => response.json())
    .then(data => {
        updateChart(myChart, data);
        updateMap(map, data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Event listener for the year filter
yearFilter.addEventListener('change', function() {
    const selectedYear = yearFilter.value;

    // Call a function to update data and refresh visualizations based on the selected year
    updateDataAndVisualizations(selectedYear);
});

// Function to update data and visualizations based on the selected year
function updateDataAndVisualizations(selectedYear) {
    fetch(`/api/data?year=${selectedYear}`)
        .then(response => response.json())
        .then(data => {
            // Filter the data based on the selectedYear
            const filteredData = filterDataByYear(data, selectedYear);

            // Update visualizations with the filtered data
            updateVisualizations(filteredData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to update visualizations with the filtered data
function updateVisualizations(data) {
    // Update charts, maps, or tables with the filtered data
}

// Initialize maps on page load
function initializeMaps() {
    // Create and initialize Leaflet maps
}

// Create and initialize charts on page load
function createCharts() {
    // Create and initialize Chart.js charts
}

// Fetch data and update visualizations on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeMaps();
    createCharts();
    // Fetch data and update maps and charts based on the data
});

// Event listener for the year filter
yearFilter.addEventListener('change', function() {
    updateVisualizations();
});

// Event listener for the state filter
stateFilter.addEventListener('change', function() {
    updateVisualizations();
});

// Function to update visualizations based on user selections
function updateVisualizations() {
    const selectedYear = yearFilter.value;
    const selectedState = stateFilter.value;

    // Fetch data from the Flask API based on user selections
    fetch(`/api/data?year=${selectedYear}&state=${selectedState}`)
        .then(response => response.json())
        .then(data => {
            // Update the visualizations with the fetched data
            updateCharts(data);
            updateMaps(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Function to update Chart.js charts with new data
function updateCharts(data) {
    // Update Chart.js charts with the new data
}

// Function to update Leaflet maps with new data
function updateMaps(data) {
    // Update Leaflet maps with the new data
}


