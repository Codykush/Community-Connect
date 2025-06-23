document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.btn-search');
    const artisanCards = Array.from(document.querySelectorAll('.artisan-card'));
    const craftFilter = document.getElementById('craftFilter');
    const locationFilter = document.getElementById('locationFilter');
    const sortBy = document.getElementById('sortBy');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbersContainer = document.querySelector('.page-numbers');
    
    // State
    let currentPage = 1;
    const itemsPerPage = 9;
    let filteredArtisans = [...artisanCards];
    
    // Initialize the application
    function init() {
        setupEventListeners();
        updateDisplay();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // Search input with debounce
        let searchTimer;
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    filterArtisans();
                }, 300);
            });
        }
        
        // Search button
        if (searchButton) {
            searchButton.addEventListener('click', filterArtisans);
        }
        
        // Filter and sort controls
        [craftFilter, locationFilter, sortBy].forEach(control => {
            if (control) {
                control.addEventListener('change', filterArtisans);
            }
        });
        
        // Pagination controls
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
        }
    }

    // Initialize the page
    function initPage() {
        // Set up initial state
        updateActivePage(1);
        filterAndSortArtisans();
        setupEventListeners();
        
        // Show first page by default
        showPage(1);
    }


    // Filter artisans based on current filters
    function filterArtisans() {
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const selectedCraft = craftFilter ? craftFilter.value.toLowerCase() : '';
        const selectedLocation = locationFilter ? locationFilter.value.toLowerCase() : '';
        
        // Filter cards based on search and filters
        filteredArtisans = artisanCards.filter(card => {
            if (!card) return false;
            
            // Get card data
            const cardCraft = card.getAttribute('data-craft') || '';
            const cardLocation = card.getAttribute('data-location') || '';
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const craft = card.querySelector('.craft')?.textContent.toLowerCase() || '';
            const location = card.querySelector('.location')?.textContent.toLowerCase() || '';
            
            // Check search term against relevant fields
            const matchesSearch = !searchTerm || 
                name.includes(searchTerm) || 
                craft.includes(searchTerm) ||
                location.includes(searchTerm) ||
                cardCraft.includes(searchTerm) ||
                cardLocation.includes(searchTerm);
            
            // Check craft filter
            const matchesCraft = !selectedCraft || 
                cardCraft === selectedCraft || 
                craft === selectedCraft;
            
            // Check location filter
            const matchesLocation = !selectedLocation || 
                cardLocation === selectedLocation || 
                location === selectedLocation;
            
            return matchesSearch && matchesCraft && matchesLocation;
        });
        
        // Update the display
        currentPage = 1;
        updateDisplay();
    }

    // Update the display with filtered and paginated results
    function updateDisplay() {
        // Hide all cards first
        artisanCards.forEach(card => card.style.display = 'none');
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedArtisans = filteredArtisans.slice(startIndex, endIndex);
        
        // Show only the cards for the current page
        paginatedArtisans.forEach(card => {
            if (card) card.style.display = 'block';
        });
        
        // Update pagination controls
        updatePagination();
    }

    // Navigate to a specific page
    function goToPage(page) {
        const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage);
        
        // Validate page number
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        
        currentPage = page;
        updateDisplay();
    }
    
    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage);
        
        // Update previous/next buttons
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage <= 1;
        }
        
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage >= totalPages;
        }
        
        // Update page numbers
        if (pageNumbersContainer) {
            let pageNumbersHTML = '';
            const maxVisiblePages = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            // Previous button
            pageNumbersHTML += `
                <button class="page-number ${currentPage === 1 ? 'disabled' : ''}" 
                        onclick="document.querySelector('.pagination button:first-child').click()">
                    &laquo;
                </button>`;
            
            // Page numbers
            for (let i = startPage; i <= endPage; i++) {
                pageNumbersHTML += `
                    <button class="page-number ${i === currentPage ? 'active' : ''}" 
                            onclick="document.dispatchEvent(new CustomEvent('goToPage', { detail: ${i} }))">
                        ${i}
                    </button>`;
            }
            
            // Next button
            pageNumbersHTML += `
                <button class="page-number ${currentPage === totalPages ? 'disabled' : ''}" 
                        onclick="document.querySelector('.pagination button:last-child').click()">
                    &raquo;
                </button>`;
            
            pageNumbersContainer.innerHTML = pageNumbersHTML;
        }
    }
    
    // Initialize the application
    init();

    // Update pagination UI with ellipsis and better mobile support
    function updatePaginationUI() {
        const totalPages = Math.max(1, Math.ceil(filteredArtisans.length / itemsPerPage));
        
        if (!pageNumbersContainer) return;
        
        // Update pagination numbers with ellipsis for better UX
        let paginationHTML = '';
        const maxVisiblePages = window.innerWidth < 768 ? 3 : 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust if we're at the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // Previous page button
        if (currentPage > 1) {
            paginationHTML += `
                <button class="page-nav" data-page="${currentPage - 1}" aria-label="Previous page">
                    <i class="fas fa-chevron-left"></i>
                </button>`;
        } else {
            paginationHTML += `
                <button class="page-nav disabled" disabled aria-disabled="true" aria-label="Previous page">
                    <i class="fas fa-chevron-left"></i>
                </button>`;
        }
        
        // Always show first page
        if (startPage > 1) {
            paginationHTML += `
                <button class="page-number" data-page="1" ${currentPage === 1 ? 'disabled' : ''}>
                    1
                </button>`;
                
            if (startPage > 2) {
                paginationHTML += `
                <span class="ellipsis" aria-hidden="true">...</span>`;
            }
        }
        
        // Page numbers in current range
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage;
            paginationHTML += `
                <button class="page-number ${isActive ? 'active' : ''}" 
                        data-page="${i}" 
                        ${isActive ? 'aria-current="page"' : ''}
                        ${isActive ? 'disabled' : ''}>
                    ${i}
                </button>`;
        }
        
        // Always show last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `
                <span class="ellipsis" aria-hidden="true">...</span>`;
            }
            
            paginationHTML += `
                <button class="page-number" data-page="${totalPages}" ${currentPage === totalPages ? 'disabled' : ''}>
                    ${totalPages}
                </button>`;
        }
        
        // Next page button
        if (currentPage < totalPages) {
            paginationHTML += `
                <button class="page-nav" data-page="${currentPage + 1}" aria-label="Next page">
                    <i class="fas fa-chevron-right"></i>
                </button>`;
        } else {
            paginationHTML += `
                <button class="page-nav disabled" disabled aria-disabled="true" aria-label="Next page">
                    <i class="fas fa-chevron-right"></i>
                </button>`;
        }
        
        // Update pagination container
        pageNumbersContainer.innerHTML = paginationHTML;
        
        // Update prev/next button states
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage === 1;
            prevPageBtn.classList.toggle('disabled', currentPage === 1);
            prevPageBtn.setAttribute('aria-disabled', currentPage === 1 ? 'true' : 'false');
        }
        
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage >= totalPages;
            nextPageBtn.classList.toggle('disabled', currentPage >= totalPages);
            nextPageBtn.setAttribute('aria-disabled', currentPage >= totalPages ? 'true' : 'false');
        }
        
        // Add event listeners to pagination elements
        document.querySelectorAll('.page-number:not(.active), .page-nav:not(.disabled)').forEach(element => {
            if (element.tagName === 'BUTTON') {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = parseInt(element.getAttribute('data-page'));
                    if (!isNaN(page) && page !== currentPage) {
                        currentPage = page;
                        showPage(currentPage);
                        updatePaginationUI();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            }
        });
    }
    
    // Update URL parameters to maintain state on page refresh
    function updateURLParams() {
        if (!window.history.replaceState) return;
        
        const params = new URLSearchParams(window.location.search);
        
        // Update or remove page parameter
        if (currentPage > 1) {
            params.set('page', currentPage);
        } else {
            params.delete('page');
        }
        
        // Update or remove search parameter
        if (searchInput && searchInput.value) {
            params.set('q', searchInput.value);
        } else {
            params.delete('q');
        }
        
        // Update or remove filter parameters
        if (craftFilter && craftFilter.value) {
            params.set('craft', craftFilter.value);
        } else {
            params.delete('craft');
        }
        
        if (locationFilter && locationFilter.value) {
            params.set('location', locationFilter.value);
        } else {
            params.delete('location');
        }
        
        // Update or remove sort parameter
        if (sortBy && sortBy.value !== 'featured') {
            params.set('sort', sortBy.value);
        } else {
            params.delete('sort');
        }
        
        // Update URL without page reload
        const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        window.history.replaceState({ path: newURL }, '', newURL);
    }
    
    // Parse URL parameters on page load
    function parseURLParams() {
        const params = new URLSearchParams(window.location.search);
        
        // Set search input
        if (searchInput && params.has('q')) {
            searchInput.value = params.get('q');
        }
        
        // Set filters
        if (craftFilter && params.has('craft')) {
            craftFilter.value = params.get('craft');
        }
        
        if (locationFilter && params.has('location')) {
            locationFilter.value = params.get('location');
        }
        
        // Set sort
        if (sortBy && params.has('sort')) {
            sortBy.value = params.get('sort');
        }
        
        // Set page
        if (params.has('page')) {
            const page = parseInt(params.get('page'), 10);
            if (!isNaN(page) && page > 0) {
                currentPage = page;
            }
        }
    }
    
    // Handle window resize for responsive adjustments with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updatePaginationUI();
        }, 250);
    });
    
    // Set up all event listeners
    function setupEventListeners() {
        // Search input with debounce
        let searchTimer;
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    filterAndSortArtisans();
                }, 300);
            });
            
            // Clear search button
            const clearSearch = document.createElement('button');
            clearSearch.className = 'clear-search';
            clearSearch.innerHTML = '<i class="fas fa-times"></i>';
            clearSearch.setAttribute('aria-label', 'Clear search');
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                filterAndSortArtisans();
                searchInput.focus();
            });
            searchInput.parentNode.insertBefore(clearSearch, searchInput.nextSibling);
        }
        
        // Search button
        if (searchButton) {
            searchButton.addEventListener('click', filterAndSortArtisans);
        }
        
        // Filter and sort controls
        [craftFilter, locationFilter, sortBy].forEach(control => {
            if (control) {
                control.addEventListener('change', filterAndSortArtisans);
            }
        });
        
        // Pagination controls
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    goToPage(currentPage - 1);
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => {
                if (currentPage < Math.ceil(filteredArtisans.length / itemsPerPage)) {
                    goToPage(currentPage + 1);
                }
            });
        }
        
        // Handle clicks on dynamically generated page numbers
        document.addEventListener('click', (e) => {
            const pageNum = e.target.closest('.page-number');
            if (pageNum && pageNum.dataset.page) {
                e.preventDefault();
                goToPage(parseInt(pageNum.dataset.page, 10));
            }
        });
        
        // Keyboard navigation for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    if (currentPage > 1) {
                        goToPage(currentPage - 1);
                    }
                    break;
                case 'ArrowRight':
                    if (currentPage < Math.ceil(filteredArtisans.length / itemsPerPage)) {
                        goToPage(currentPage + 1);
                    }
                    break;
                case 'Home':
                    if (e.ctrlKey && currentPage > 1) {
                        goToPage(1);
                    }
                    break;
                case 'End':
                    if (e.ctrlKey) {
                        const lastPage = Math.ceil(filteredArtisans.length / itemsPerPage);
                        if (currentPage < lastPage) {
                            goToPage(lastPage);
                        }
                    }
                    break;
            }
        });
    }
    
    // Navigate to specific page
    function goToPage(page) {
        const totalPages = Math.ceil(filteredArtisans.length / itemsPerPage);
        if (page < 1 || page > totalPages) return;
        
        currentPage = page;
        showPage(currentPage);
        updateActivePage(currentPage);
    }
    
    // Initialize the page
    parseURLParams();
    initPage();
    
    // Expose functions to global scope if needed
    window.artisansApp = {
        filterAndSortArtisans,
        goToPage,
        currentPage: () => currentPage,
        totalPages: () => Math.ceil(filteredArtisans.length / itemsPerPage)
    };

    // Handle window resize with debounce
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updatePaginationUI();
        }, 250);
    });
});