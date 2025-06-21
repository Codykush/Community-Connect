// Artisan Directory Logic
let allArtisans = [];
let filteredArtisans = [];
let currentPage = 1;
const artisansPerPage = 9;

async function loadArtisans() {
    const querySnapshot = await getDocs(collection(db, "artisans"));
    allArtisans = [];
    querySnapshot.forEach((doc) => {
        allArtisans.push({
            id: doc.id,
            ...doc.data()
        });
    });
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const locationFilter = document.getElementById('location-filter').value;
    const craftFilter = document.getElementById('craft-filter').value;
    const sortBy = document.getElementById('sort-by').value;

    filteredArtisans = allArtisans.filter(artisan => {
        const matchesSearch = artisan.shopName.toLowerCase().includes(searchTerm) || 
                            artisan.craftType.toLowerCase().includes(searchTerm);
        const matchesLocation = !locationFilter || artisan.location === locationFilter;
        const matchesCraft = !craftFilter || artisan.craftType === craftFilter;
        
        return matchesSearch && matchesLocation && matchesCraft;
    });

    // Sorting
    switch(sortBy) {
        case 'name':
            filteredArtisans.sort((a, b) => a.shopName.localeCompare(b.shopName));
            break;
        case 'location':
            filteredArtisans.sort((a, b) => a.location.localeCompare(b.location));
            break;
        default: // newest first
            filteredArtisans.sort((a, b) => b.timestamp - a.timestamp);
    }

    updateResultsCount();
    displayArtisans();
}

function updateResultsCount() {
    const count = filteredArtisans.length;
    document.getElementById('results-count').textContent = 
        `${count} Artisan${count !== 1 ? 's' : ''} Found`;
}

function displayArtisans() {
    const grid = document.getElementById('artisan-grid');
    grid.innerHTML = '';

    const startIdx = (currentPage - 1) * artisansPerPage;
    const endIdx = startIdx + artisansPerPage;
    const paginatedArtisans = filteredArtisans.slice(startIdx, endIdx);

    if (paginatedArtisans.length === 0) {
        grid.innerHTML = '<div class="no-results">No artisans match your filters. Try adjusting your search.</div>';
    } else {
        paginatedArtisans.forEach(artisan => {
            grid.innerHTML += `
                <div class="artisan-card animate-pop-in">
                    <img src="${artisan.imageUrl || 'images/default-artisan.jpg'}" alt="${artisan.shopName}">
                    <div class="artisan-info">
                        <h4>${artisan.shopName}</h4>
                        <p class="craft-type">${artisan.craftType}</p>
                        <p class="location"><img src="images/icon-pin.png" alt="Location"> ${artisan.location}</p>
                        <a href="artisan-profile.html?id=${artisan.id}">View Profile</a>
                    </div>
                </div>
            `;
        });
    }

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredArtisans.length / artisansPerPage);
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages || totalPages === 0;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadArtisans();
    
    document.getElementById('apply-filters').addEventListener('click', () => {
        currentPage = 1;
        applyFilters();
    });
    
    document.getElementById('search-input').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            currentPage = 1;
            applyFilters();
        }
    });
    
    document.getElementById('sort-by').addEventListener('change', applyFilters);
    
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayArtisans();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredArtisans.length / artisansPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayArtisans();
        }
    });
});