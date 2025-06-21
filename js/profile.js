// Artisan Profile Page Logic
let currentArtisan = null;
let map;

async function loadArtisanProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const artisanId = urlParams.get('id');
    
    if (!artisanId) {
        window.location.href = 'artisans.html';
        return;
    }

    const docRef = doc(db, "artisans", artisanId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        currentArtisan = {
            id: docSnap.id,
            ...docSnap.data()
        };
        displayArtisanProfile();
    } else {
        document.getElementById('profile-main').innerHTML = `
            <div class="error-message">
                <h2>Artisan Not Found</h2>
                <p>The artisan you're looking for doesn't exist or may have been removed.</p>
                <a href="artisans.html" class="btn-back">Browse Artisans</a>
            </div>
        `;
    }
}

function displayArtisanProfile() {
    const artisan = currentArtisan;
    
    // Main profile header
    document.getElementById('profile-main').innerHTML = `
        <div class="profile-image">
            <img src="${artisan.imageUrl || 'images/default-artisan.jpg'}" alt="${artisan.shopName}">
        </div>
        <div class="profile-info">
            <h2>${artisan.shopName}</h2>
            <p class="craft-type">${artisan.craftType}</p>
            <p class="location"><img src="images/icon-pin.png" alt="Location"> ${artisan.location}</p>
            <div class="rating">
                <span class="stars">★★★★★</span>
                <span class="review-count">(12 reviews)</span>
            </div>
        </div>
    `;
    
    // Description and contact
    document.getElementById('artisan-description').textContent = 
        artisan.description || 'No description provided.';
    document.getElementById('artisan-contact').innerHTML = `
        ${artisan.contact ? `<strong>Phone:</strong> ${artisan.contact}<br>` : ''}
        ${artisan.email ? `<strong>Email:</strong> ${artisan.email}<br>` : ''}
        ${artisan.website ? `<strong>Website:</strong> <a href="${artisan.website}" target="_blank">Visit Site</a>` : ''}
    `;
    
    // Initialize map if coordinates exist
    if (artisan.location && artisan.location.latitude && artisan.location.longitude) {
        initMap(artisan.location.latitude, artisan.location.longitude);
    }
    
    // Load gallery (placeholder - would come from Firestore in real app)
    const galleryGrid = document.getElementById('gallery-grid');
    for (let i = 0; i < 6; i++) {
        galleryGrid.innerHTML += `
            <div class="gallery-item">
                <img src="images/gallery-placeholder-${i % 3 + 1}.jpg" alt="Artisan's work ${i + 1}">
            </div>
        `;
    }
}

function initMap(lat, lng) {
    const location = { lat, lng };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: location,
        styles: [
            {
                "featureType": "poi",
                "stylers": [{"visibility": "off"}]
            }
        ]
    });
    
    new google.maps.Marker({
        position: location,
        map: map,
        title: currentArtisan.shopName,
        icon: {
            url: "images/map-marker.png",
            scaledSize: new google.maps.Size(40, 40)
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadArtisanProfile);