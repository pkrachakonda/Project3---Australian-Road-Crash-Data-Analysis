document.addEventListener('DOMContentLoaded', function() {
    const yearDropdown = document.getElementById('yearDropdown');
    const roadUserChartCtx = document.getElementById('roadUserChart').getContext('2d');
    const fatalitiesChartCtx = document.getElementById('fatalitiesChart').getContext('2d');
    const stateChartCtx = document.getElementById('stateChart').getContext('2d');

    // Initialize chart variables
    let roadUserChart, fatalitiesChart, stateChart;

    // Fetch years and populate year dropdown
    fetch('/years').then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    }).then(years => {
        if (!Array.isArray(years)) throw new Error('Data format is not an array');
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearDropdown.appendChild(option);
        });
        // Call this function initially to load all data
        fetchDataAndUpdateCharts('all');
    }).catch(error => {
        handleError(error);
    });

    // Event listener for year dropdown change
    yearDropdown.addEventListener('change', (event) => {
        fetchDataAndUpdateCharts(event.target.value);
    });

    function fetchDataAndUpdateCharts(year) {
        showLoading(true);
        fetch(`/data?year=${year}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) throw new Error('Data format is not an array');
                updateCharts(data);
            }).catch(error => {
                handleError(error);
            }).finally(() => {
                showLoading(false);
            });
    }

    function updateCharts(data) {
        roadUserChart = updateRoadUserChart(roadUserChart, data);
        fatalitiesChart = updateFatalitiesChart(fatalitiesChart, data);
        stateChart = updateStateChart(stateChart, data);
    }

// Functions to update the charts with the chart instance check
// Update the Road User chart
function updateRoadUserChart(chart, data) {
        // Filter out unique road user types
        const roadUserTypes = ['Passenger', 'Driver', 'Motorcycle rider', 'Motorcycle pillion passenger', 'Pedestrian', 'Pedal cyclist'];
    
        // Initialize an object to hold day-wise counts for each road user type
        const roadUserCounts = {};
        roadUserTypes.forEach(type => {
        roadUserCounts[type] = {'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 'Thursday': 0, 'Friday': 0, 'Saturday': 0, 'Sunday': 0};
        });
    
        // Count the occurrences of road user types on each day of the week
        data.forEach(record => {
        if(roadUserTypes.includes(record['Road User'])) {
            roadUserCounts[record['Road User']][record['Dayweek']]++;
        }
        });
    
        // Prepare datasets for the chart
        const datasets = roadUserTypes.map(type => {
        return {
            label: type,
            data: Object.values(roadUserCounts[type]),
        };
        });
    
        // Check if the chart instance exists
        if (!chart) {
            chart = new Chart(roadUserChartCtx, {
                // Chart initialisation
                type: 'bar',
                data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            datasets: datasets,
        },
        options: {
            // Chart customisation options
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
} else {
    // Update chart data
    chart.data.datasets = datasets;
    chart.update();
}
return chart; // Return the updated chart instance
}

// Functions to update the charts with the chart instance check
// Update the Fatalities chart
function updateFatalitiesChart(chart, data) {
        // Group data by Speed Limit
        const fatalitiesBySpeed = {};
    
        // Initialise speed limit groups
        data.forEach(record => {
        const speedLimit = record['Speed Limit'];
        if(!(speedLimit in fatalitiesBySpeed)) {
            fatalitiesBySpeed[speedLimit] = [];
        }
        fatalitiesBySpeed[speedLimit].push(record['Number of Fatalities']);
        });
    
        // Sum fatalities by speed limit
        const speedLimits = Object.keys(fatalitiesBySpeed);
        const fatalitiesData = speedLimits.map(speed => {
        return fatalitiesBySpeed[speed].reduce((a, b) => a + b, 0);
        });
    
        // Check if the chart instance exists
        if (!chart) {
            chart = new Chart(fatalitiesChartCtx, {
                // Chart initialisation
                type: 'bar',
                data: {
            labels: speedLimits,
            datasets: [{
            label: 'Number of Fatalities',
            data: fatalitiesData,
            // Add more properties for chart formatting here
            }]
        },
        options: {
            // Chart customisation options
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
} else {
    // Update chart data
    chart.data.datasets[0].data = fatalitiesData;
    chart.update();
}
return chart; // Return the updated chart instance
}

// Functions to update the charts with the chart instance check
// Update the State chart
function updateStateChart(chart, data) {
        // Initialise state counts
        const states = ['WA', 'NSW', 'Qld', 'NT', 'Vic', 'SA', 'Tas', 'ACT'];
        const stateCounts = {
        'Day': {},
        'Night': {}
        };
        states.forEach(state => {
        stateCounts['Day'][state] = 0;
        stateCounts['Night'][state] = 0;
        });
    
        // Count occurrences per state and time of day
        data.forEach(record => {
        stateCounts[record['Time of Day']][record['State']]++;
        });
    
        // Prepare datasets for the chart
        const datasets = Object.keys(stateCounts).map(timeOfDay => {
        return {
            label: timeOfDay,
            data: states.map(state => stateCounts[timeOfDay][state]),
            // Add more properties for chart formatting here
        };
        });
    
        // Check if the chart instance exists
        if (!chart) {
            chart = new Chart(stateChartCtx, {
                // Chart initialisation
                type: 'bar',
                data: {
            labels: states,
            datasets: datasets,
        },
        options: {
            // Chart customisation options go here
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
        });
    } else {
        // Update chart data
        chart.data.datasets = datasets;
        chart.update();
    }
    return chart; // Return the updated chart instance
}
  
function handleError(error) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = `Error: ${error.message}`;
    errorElement.style.display = 'block';
}

function showLoading(show) {
    const loadingText = document.getElementById('loadingText');
    loadingText.style.display = show ? 'block' : 'none';
    if (show) {
        // Optional: Hide the error message when loading new data
        document.getElementById('error').style.display = 'none';
    }
}
});
