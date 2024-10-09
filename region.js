const apiUrl = 'https://bni-data-backend.onrender.com/api/regions';

let allRegions = []; // To store fetched regions globally
let filteredRegions = []; // To store filtered regions based on search
let entriesPerPage = 10; // Number of entries to display per page
let currentPage = 1; // For pagination

// Show the loader
function showLoader() { 
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'flex'; // Make sure loader displays as a flexbox if required
  } else {
    console.error('Loader element not found!');
  }
}

// Hide the loader
function hideLoader() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = 'none'; // Hide the loader
  } else {
    console.error('Loader element not found!');
  }
}

// Function to fetch regions data
async function fetchRegions() {
  showLoader(); // Show the loader
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network response was not ok');

    allRegions = await response.json(); // Store fetched regions in the global variable
    filteredRegions = [...allRegions]; // Initialize filtered regions to all regions initially

    // Display the first page of regions
    displayRegions(filteredRegions.slice(0, entriesPerPage)); // Display only the first 10 entries
  } catch (error) {
    console.error('There was a problem fetching the regions data:', error);
  } finally {
    hideLoader(); // Hide the loader when done
  }
}

// Function to display regions in the table
function displayRegions(regions) {
  const tableBody = document.getElementById('chaptersTableBody');
  
  // Clear existing rows
  tableBody.innerHTML = '';

  // Loop through the regions and create table rows
  regions.forEach((region, index) => {
    const row = document.createElement('tr');
    row.classList.add('order-list');
    
    // Add table cells with region data
    row.innerHTML = `
      <td>${(currentPage - 1) * entriesPerPage + index + 1}</td> <!-- Adjust for pagination -->
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${region.region_name}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${region.region_headoffice_address || 'N/A'}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <span class="badge bg-${region.region_status === 'active' ? 'success' : 'danger'}">
          ${region.region_status}
        </span>
      </td>
    `;
    
    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Function to filter regions based on search input
function filterRegions() {
  const searchValue = document.getElementById('searchChapterInput').value.toLowerCase();

  // Filter regions based on the search value
  filteredRegions = allRegions.filter(region => 
    region.region_name.toLowerCase().includes(searchValue)
  );

  // Display the filtered regions
  displayRegions(filteredRegions.slice(0, entriesPerPage)); // Display only the first entriesPerPage results
}

// Add event listener to the search input
document.getElementById('searchChapterInput').addEventListener('input', filterRegions);

// Call fetchRegions on page load
window.onload = fetchRegions;
