// fetchChapters.js

let allChapters = []; // To store fetched chapters globally
let filteredChapters = []; // To store filtered chapters based on search

// Function to show the loader
function showLoader() {
    document.getElementById('loader').style.display = 'flex'; // Show loader
}

// Function to hide the loader
function hideLoader() {
    document.getElementById('loader').style.display = 'none'; // Hide loader
}

// Function to fetch chapters from the API
async function fetchChapters() {
    showLoader(); // Show the loader when starting to fetch data
    try {
        const response = await fetch('https://bni-data-backend.onrender.com/api/chapters');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        allChapters = await response.json(); // Store fetched chapters in the global variable
        filteredChapters = [...allChapters]; // Initialize filtered chapters to all chapters initially
        displayChapters(filteredChapters); // Display all chapters initially
    } catch (error) {
        console.error('Error fetching chapters:', error);
    } finally {
        hideLoader(); // Hide the loader when done, regardless of success or failure
    }
}

// Function to display chapters in the table
function displayChapters(chapters) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = ''; // Clear previous chapters

    chapters.forEach((chapter, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><b>${chapter.chapter_name}</b></td>
            <td>${chapter.region_id}</td>
            <td><b>${chapter.chapter_membership_fee}</b></td>
            <td>${chapter.chapter_logo}</td>
            <td>${chapter.chapter_meeting_day}</td>
            <td>${chapter.chapter_type}</td>
            <td><b>${chapter.chapter_kitty_fees}</b></td>
            <td>
                <span class="badge bg-${chapter.chapter_status === 'running' ? 'success' : 'danger'}">
                    ${chapter.chapter_status}
                </span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to filter chapters based on search input
function filterChapters(searchTerm) {
    if (searchTerm === '') {
        filteredChapters = [...allChapters]; // Reset filtered chapters to all chapters if search term is empty
    } else {
        filteredChapters = allChapters.filter(chapter =>
            chapter.chapter_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    displayChapters(filteredChapters); // Display filtered chapters
}

// Add event listener for the search input
document.getElementById('searchChapterInput').addEventListener('input', function() {
    const searchTerm = this.value;
    filterChapters(searchTerm); // Call the filter function with the search term
});

// Call fetchChapters on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchChapters();
});
