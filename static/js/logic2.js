// Create a functions for Side bar to open full length page 
function w3_open() {
    document.getElementById("main").style.marginLeft = "22%";
    document.getElementById("mySidebar").style.width = "22%";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
  }
  function w3_close() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
  }

//  Create an event listener for scrolling the header - choosing year
window.addEventListener('scroll', function () {
    const scrollableDiv = document.getElementById('scrollableDiv'); // Get the div you want to make sticky
    const header = document.querySelector('.sticky-header'); // Get the header element you want to make sticky
    const headerHeight = header.clientHeight; // Calculate the height of the header

    if (window.scrollY >= scrollableDiv.offsetTop - headerHeight) {
        header.classList.add('sticky'); // Add the 'sticky' class to the header
        // Add margin to the content to prevent it from abruptly jumping up
        scrollableDiv.style.marginTop = headerHeight + 'px';
    } else {
        header.classList.remove('sticky'); // Remove the 'sticky' class from the header
        // Remove the margin to allow the content to return to its original position
        scrollableDiv.style.marginTop = '0';
    }
});


// Create an event listener for Year changes in the dropdown
document.addEventListener('DOMContentLoaded', function () {
    const yearDropdown = document.getElementById('yearDropdown');
    const roadUserChartCtx = document.getElementById('roadUserChart').getContext('2d');
    const fatalitiesChartCtx = document.getElementById('fatalitiesChart').getContext('2d');
    const stateChartCtx = document.getElementById('stateChart').getContext('2d');
    const ageGroupChartCtx = document.getElementById('ageGroupChart').getContext('2d');
    const eachStateChartCtx = document.getElementById('eachStateChart').getContext('2d');
    const genderChartCtx = document.getElementById('genderChart').getContext('2d');
    
    // Define the list of states
    const statesArray = ['WA', 'NSW', 'Qld', 'NT', 'Vic', 'SA', 'Tas', 'ACT'];
    
    // Initialize chart variables
    let roadUserChart, fatalitiesChart, stateChart, stateYearChart, ageGroupChart, genderChart;
    

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
                updateCharts(data, year);
            }).catch(error => {
                handleError(error);
            }).finally(() => {
                showLoading(false);
            });
    }

    // Fetch the data you want to display in the summary table
    fetch('/data').then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
        })
        .then(data => {
        // Call the summaryTable & statYear Chart function with the fetched data as static graphs
        summaryTable(data);
        updateStateYearChart(statesArray, data)
}       )
    .catch(error => {
        handleError(error);
    });
    
    function updateCharts(data, year) {
        roadUserChart = updateRoadUserChart(roadUserChart, data);
        fatalitiesChart = updateFatalitiesChart(fatalitiesChart, data);
        stateChart = updateStateChart(stateChart, data);
        ageGroupChart = updateAgeGroupChart(ageGroupChart, data, year);
        genderChart = updateGenderChart(genderChart, data, year);  
        
    }
    
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
                x: {
                    title: {
                        text: 'Day of the Week', 
                        display: true, 
                    }
                },
                y: {
                    title: {
                        text: 'Number of Fatalities', 
                        display: true,
                    },
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

                x: {
                    title: {
                        text: 'Speed Limit (km/h)',
                        display: true, 
                    },
                },

                y: {
                    title: { 
                        text: 'Number of Fatalities', 
                        display: true,
                    }, 
                    
                    beginAtZero: true, 
                }
            }
        }
    });
} else {
    // Update chart data
    chart.data.datasets[0].data = fatalitiesData;
    chart.update();
}
return chart; 
}


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
                x: {
                    title: {
                        text: 'State',
                        display: true,} 
                },
                y: {
                    title: {
                        text: 'Number of Fatalities',
                        display: true,
                    },
                    beginAtZero: true,
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


// Function to update the state year chart
function updateStateYearChart(states, data) {
    const colors = [
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)',
        'rgb(54, 162, 235)',
        'rgb(147, 112, 219)',
        'rgb(204, 85, 0)',
        'rgb(0, 0, 139)',
    ];

    const stateCounts = {};

    states.forEach(state => {
        stateCounts[state] = {};
    });

    data.forEach(record => {
        const state = record['State'];
        const year = record['Year'];

        // Initialize the state count object for the current state and year
        if (!stateCounts[state][year]) {
            stateCounts[state][year] = 0;
        }

        // Increment the count for the current state and year
        stateCounts[state][year]++;
    });

    // Prepare datasets for the chart
    const datasets = states.map((state, index) => {
        const years = Object.keys(stateCounts[state]).map(Number).sort((a, b) => a - b);
        const values = years.map(year => stateCounts[state][year]);

        return {
            label: state,
            data: values,
            borderColor: colors, // Default color for lines
            backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent background
            borderWidth: 2,
        };
    });

    // Extract unique years for labels and sort them in ascending order
    const uniqueYears = [...new Set(data.map(entry => entry['Year']))].map(Number).sort((a, b) => a - b);

    letChart = new Chart(eachStateChartCtx, {
        type: 'line',
        data: {
            labels: uniqueYears,
            datasets: datasets,
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                    },
                    min: uniqueYears[0],
                    max: uniqueYears[uniqueYears.length - 1],
                    beginAtZero: true,
                },
                y: {
                    min: 0,
                    max: 400,
                    title: {
                        display: true,
                        text: 'Number of Fatalities',
                    },
                    beginAtZero: true,
                },
            },
        },
    });
}


// New function for the Age Group pie chart
function updateAgeGroupChart(chart, data) {
    // Calculate age group counts
    const ageGroupsCounts = {};

    data.forEach(record => {
        const age = record["Age Group"];
        if (!ageGroupsCounts[age]) {
            ageGroupsCounts[age] = 0;
        }
        ageGroupsCounts[age]++;
    });

    // Define the specific order for sorting the labels
    const labelOrder = [
        '0_to_16',
        '17_to_25',
        '26_to_39',
        '40_to_64',
        '65_to_74',
        '75_or_older'];
    
    // Prepare the chart data 
    const labels = labelOrder.filter(label => ageGroupsCounts[label]);
    const dataValues = labels.map(label => ageGroupsCounts[label]);

    // Check if there is an existing Chart instance on this canvas
    if (chart) {
        // Destroy the existing instance before creating a new one
        chart.destroy();
    }


    // Create the new pie chart
    const newChart = new Chart(ageGroupChartCtx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    data: dataValues
                },
            ],
        },
    });
    
    return newChart; // Return the updated chart instance
}

// Create a fatalities by Gender Chart 
function updateGenderChart(chart, data) {
    // Calculate gender counts
    const genderCounts = {};

    data.forEach(record => {
        const gender = record["Gender"];
        if (!genderCounts[gender]) {
            genderCounts[gender] = 0;
        }
        genderCounts[gender]++;
    });

    // Prepare the chart data 
    const labels = Object.keys(genderCounts);
    const dataValues = labels.map(label => genderCounts[label]);

    // Check if there is an existing Chart instance on this canvas
    if (chart) {
        // Destroy the existing instance before creating a new one
        chart.destroy();
    }

    // Create the new pie chart
    let newChart = new Chart(genderChartCtx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [
                {
                    data: dataValues
                },
            ],
        },
    });

    return newChart; // Return the updated chart instance
}


// New Function for Summary Table
function summaryTable(data) {
    const states = ['WA', 'NSW', 'Qld', 'NT', 'Vic', 'SA', 'Tas', 'ACT'];
    const stateCounts = {};

    // Initialize state counts
    states.forEach(state => {
        stateCounts[state] = 0;
    });

    data.forEach(record => {
        const state = record['State'];
        const fatalities = record['Number of Fatalities'];

        if (states.includes(state)) {
            stateCounts[state] += fatalities;
        }
    });

    // Create an array of objects for sorting
    const stateData = Object.keys(stateCounts).map(state => ({
        state,
        count: stateCounts[state],
    }));

    // Sort the stateData array by count in descending order
    stateData.sort((a, b) => b.count - a.count);

    const tableBody = document.querySelector("#summary-table tbody");

    // Loop through sorted state data and populate the table
    stateData.forEach(stateItem => {
        const row = document.createElement("tr");
        const stateCell = document.createElement("td");
        const countCell = document.createElement("td");

        stateCell.textContent = stateItem.state;
        countCell.textContent = stateItem.count;

        row.appendChild(stateCell);
        row.appendChild(countCell);
        tableBody.appendChild(row);
    });
}


// Function to handle errors 
function handleError(error) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = `Error: ${error.message}`;
    errorElement.style.display = 'block';
}
//Loading screen function 
function showLoading(show) {
    const loadingText = document.getElementById('loadingText');
    loadingText.style.display = show ? 'block' : 'none';
    if (show) {
        // Optional: Hide the error message when loading new data
        document.getElementById('error').style.display = 'none';
    }
}
});
