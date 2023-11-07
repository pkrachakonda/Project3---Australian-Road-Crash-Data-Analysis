// dashboard.logic.js

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


