// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load featured artisans
async function loadFeaturedArtisans() {
    const querySnapshot = await getDocs(collection(db, "artisans"));
    const featuredSection = document.getElementById("featured-artisans");
    featuredSection.innerHTML = "";
    
    querySnapshot.forEach((doc) => {
        const artisan = doc.data();
        featuredSection.innerHTML += `
            <div class="artisan-card animate-pop-in delay-${Math.floor(Math.random() * 3) + 1}">
                <img src="${artisan.imageUrl || 'images/default-artisan.jpg'}" alt="${artisan.shopName}">
                <div class="artisan-info">
                    <h4>${artisan.shopName}</h4>
                    <p>${artisan.craftType} • ${artisan.location}</p>
                    <a href="artisan-profile.html?id=${doc.id}">Visit Shop</a>
                </div>
            </div>
        `;
    });
}

// Header scroll effect
window.addEventListener("scroll", function() {
    const header = document.querySelector(".main-header");
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    loadFeaturedArtisans();
    
    // Set current year in footer
    document.querySelector('.copyright p').innerHTML = 
        `&copy; ${new Date().getFullYear()} ArtisanConnect. All rights reserved.`;
});