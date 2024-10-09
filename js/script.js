const apiUrl = 'https://bni-data-backend.onrender.com/api/members';
const chaptersApiUrl = 'https://bni-data-backend.onrender.com/api/chapters'; // API for fetching chapters

let chaptersMap = {};
let allMembers = []; // To store fetched members globally
let filteredMembers = []; // To store filtered members based on search
let currentPage = 1; // Current page number
const entriesPerPage = 30; // Number of entries per page

// Show the loader
function showLoader() { 
  document.getElementById('loader').style.display = 'flex';
}

// Hide the loader
function hideLoader() {
  document.getElementById('loader').style.display = 'none';
}

// Function to fetch chapters and store them in a map
async function fetchChapters() {
  try {
    const response = await fetch(chaptersApiUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const chapters = await response.json();
    chapters.forEach(chapter => {
      chaptersMap[chapter.chapter_id] = chapter.chapter_name;
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
  }
}

// Function to fetch members data
async function fetchMembers() {
  showLoader(); // Show the loader
  try {
    // Fetch chapters first
    await fetchChapters();

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    
    allMembers = await response.json(); // Store fetched members in the global variable
    filteredMembers = [...allMembers]; // Initialize filtered members to all members initially

    // Display the first page of members
    displayMembers(filteredMembers.slice(0, entriesPerPage)); // Display only the first 30 entries
    setupPagination(filteredMembers.length); // Setup pagination for all members initially
  } catch (error) {
    console.error('There was a problem fetching the members data:', error);
  } finally {
    hideLoader(); // Hide the loader when done
  }
}

// Function to display members in the table
function displayMembers(members) {
  const tableBody = document.querySelector('.table tbody');
  
  // Clear existing rows
  tableBody.innerHTML = '';

  // Loop through the members and create table rows
  members.forEach((member, index) => {
    const fullName = `${member.member_first_name} ${member.member_last_name || ''}`;
    
    // Format induction date
    const formattedDate = member.member_induction_date ? member.member_induction_date.substring(0, 10) : 'N/A';
    
    // Get chapter name from chaptersMap using chapter_id
    const chapterName = chaptersMap[member.chapter_id] || 'N/A';

    const row = document.createElement('tr');
    row.classList.add('order-list');
    
    // Add table cells with member data
    row.innerHTML = `
      <td>${(currentPage - 1) * entriesPerPage + index + 1}</td> <!-- Adjust for pagination -->
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <span class="avatar avatar-sm me-2 avatar-rounded">
            <img src="https://bniconnectglobal.com/web/open/networkViewProfileImage/667047103355150001b6ca93.jpg" alt="" />
          </span>
          ${fullName}
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${member.member_email_address}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">${member.member_phone_number}</td>
      <td class="text-center" style="border: 1px solid grey;">
        <b>${member.member_category || 'N/A'}</b>
      </td>
      <td class="fw-semibold" style="color:#d01f2f;">${chapterName}</td>
      <td class="fw-semibold" style="border: 1px solid grey;">${formattedDate}</td>
      <td style="border: 1px solid grey;">
        <span class="badge bg-${member.member_status === 'active' ? 'success' : 'danger'}">
          ${member.member_status}
        </span>
      </td>
    `;
    
    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Function to filter members based on search input
function filterMembers(searchTerm) {
  if (searchTerm === '') {
    filteredMembers = [...allMembers]; // Reset filtered members to all members if search term is empty
    currentPage = 1; // Reset to the first page when search term is cleared
  } else {
    filteredMembers = allMembers.filter(member => {
      const fullName = `${member.member_first_name} ${member.member_last_name}`.toLowerCase();
      const email = member.member_email_address.toLowerCase();
      const phone = member.member_phone_number;
      
      // Check if search term matches any of the fields (name, email, or phone)
      return fullName.includes(searchTerm.toLowerCase()) || 
             email.includes(searchTerm.toLowerCase()) || 
             phone.includes(searchTerm);
    });
  }

  displayMembers(filteredMembers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)); // Display current page members
  setupPagination(filteredMembers.length); // Update pagination based on filtered results
}

// Add event listener for the search input
document.getElementById('searchInput').addEventListener('input', function() {
  const searchTerm = this.value;
  filterMembers(searchTerm); // Call the filter function with the search term
});

// Function to setup pagination
function setupPagination(totalMembers) {
  const paginationElement = document.querySelector('.pagination');
  paginationElement.innerHTML = ''; // Clear existing pagination
  
  const totalPages = Math.ceil(totalMembers / entriesPerPage);

  // Previous button
  const prevPage = document.createElement('li');
  prevPage.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevPage.innerHTML = `<a class="page-link" href="javascript:void(0)">Previous</a>`;
  prevPage.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displayMembers(filteredMembers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage));
      setupPagination(filteredMembers.length);
    }
  };
  paginationElement.appendChild(prevPage);
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageItem = document.createElement('li');
    pageItem.className = `page-item ${currentPage === i ? 'active' : ''}`;
    pageItem.innerHTML = `<a class="page-link" href="javascript:void(0)">${i}</a>`;
    pageItem.onclick = () => {
      currentPage = i;
      displayMembers(filteredMembers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage));
      setupPagination(filteredMembers.length);
    };
    paginationElement.appendChild(pageItem);
  }

  // Next button
  const nextPage = document.createElement('li');
  nextPage.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  nextPage.innerHTML = `<a class="page-link" href="javascript:void(0)">Next</a>`;
  nextPage.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayMembers(filteredMembers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage));
      setupPagination(filteredMembers.length);
    }
  };
  paginationElement.appendChild(nextPage);
}

// Function to fetch and display chapters
async function loadChapters() {
  showLoader();
  try {
    const response = await fetch(chaptersApiUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const chapters = await response.json();
    displayChapters(chapters);
  } catch (error) {
    console.error('There was a problem fetching the chapters data:', error);
  } finally {
    hideLoader();
  }
}

// Function to display chapters in the table
function displayChapters(chapters) {
  const tableBody = document.getElementById('chaptersTableBody');
  tableBody.innerHTML = ''; // Clear existing rows

  chapters.forEach((chapter, index) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <div class="ms-2">
            <p class="fw-semibold mb-0 d-flex align-items-center">
              <a href="#">${chapter.chapter_name}</a>
            </p>
          </div>
        </div>
      </td>
      <td style="border: 1px solid grey;">
        <div class="d-flex align-items-center">
          <b>${chapter.region_name}</b>
        </div>
      </td>
      <td style="border: 1px solid grey;">${chapter.chapter_id}</td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Call fetchMembers on page load
window.onload = fetchMembers;
