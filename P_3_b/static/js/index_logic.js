// index_logic.js

// Initialize a Chart.js chart
var ctx = document.getElementById('myChart').getContext('2d');
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


    