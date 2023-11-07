// //  Print data in console 
// d3.json("Visualisation_data.json").then(function(data) {
//     console.log(data);
// });

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


// // Function to initialize a Leaflet map
// function initializeMap() {
//     var map = L.map('map').setView([latitude, longitude], zoomLevel);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);



// Assuming data is an array of objects representing crash data
for (let i = 0; i < data.length; i++) {
    // Access the data item for the current iteration
    const item = data[i];

    // Create a new row in the table
    const row = table.insertRow();

    // Insert cells and populate them with data
    const cell1 = row.insertCell(0);
    cell1.textContent = item.property1;
    const cell2 = row.insertCell(1);
    cell2.textContent = item.property2;
    // Add more cells and properties as needed
}

// Event listener for the year filter
stateFilter.addEventListener('change', function() {
    const selectedState = stateFilter.value;

    // Call a function to update data and visualizations based on the selected year
    updateData(selectedState);
});

// Function to fetch filtered data based on the selected year
function updateData(selectedState) {
    fetch(`/api/crash-data?state=${selectedState}`)
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



    d3.json("Visualisation_data.json").then(function(data) {
        data = [data]
        // Create function to plot the age
        function createAgeGraph(data) {
            // Create an object to store age group counts
            const ageGroupCounts = {};
        
            // Loop through the JSON data to count age groups
            for (let i = 0; i < data.length; i++) {
                const ageGroup = data[i][1]["Age Group"];
        
                // Check if the age group is already in ageGroupCounts
                if (!ageGroupCounts[ageGroup]) {
                    ageGroupCounts[ageGroup] = 1;
                } else {
                    ageGroupCounts[ageGroup] += 1;
                }
            };
        
            // Extract unique age groups and their counts
            const uniqueAgeGroups = Object.keys(ageGroupCounts);
            const counts = uniqueAgeGroups.map(ageGroup => ageGroupCounts[ageGroup]);
            
            console.log("Unique Age Groups:", uniqueAgeGroups);
            console.log("Counts:", counts);
    
            // Prepare data for Plotly
            const trace1 = {
                x: uniqueAgeGroups,
                y: counts,
                type: 'bar',
                transforms: [
                    {
                        type: 'sort',
                        target: 'y',
                        order: 'descending'
                    }
                ]
            };
        
            const data1 = [trace1];
            const layout = {
                title: "Fatalities per Age Group"
            };
        
            // Create the plot after processing the data
            Plotly.newPlot("map", data1, layout);
        }
        
        
    
        // Call the createAgeGraph function with the data
        createAgeGraph(data);
    });
     