// --- Step 1: Import necessary functions ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

// --- Step 2: Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Step 3: Get App ID from URL and Fetch Data ---
document.addEventListener('DOMContentLoaded', async () => {
    
    // Get the container
    const container = document.getElementById('app-detail-container');

    try {
        // Get the App ID from the URL (e.g., ?id=XXXXX)
        const urlParams = new URLSearchParams(window.location.search);
        const appId = urlParams.get('id');

        if (!appId) {
            throw new Error("No App ID found in URL.");
        }

        // Create a reference to the specific app document in Firestore
        const appRef = doc(db, "apps", appId);
        // Fetch the document
        const docSnap = await getDoc(appRef);

        if (docSnap.exists()) {
            // If the document exists, get its data
            const appData = docSnap.data();
            
            // Update the page title
            document.title = `${appData.name} - Ai Technocrafts Store`;
            
            // Display the details on the page
            displayAppDetails(appData);

        } else {
            // doc.data() will be undefined in this case
            throw new Error("App not found!");
        }

    } catch (error) {
        console.error("Error fetching app details:", error);
        container.innerHTML = `<p class="error-text">Error: ${error.message}</p>`;
    }
});


// --- Function to display the fetched data in HTML ---
function displayAppDetails(data) {
    const container = document.getElementById('app-detail-container');
    
    // Check if apkUrl exists before creating the download button
    const downloadButtonHTML = data.apkUrl 
        ? `<a href="${data.apkUrl}" class="download-button" target="_blank" rel="noopener noreferrer">Download APK</a>`
        : `<p class="no-download">Download link not available yet.</p>`;

    container.innerHTML = `
        <div class="app-detail-header">
            <img src="${data.iconUrl}" alt="${data.name} Icon" class="app-detail-icon">
            <div class="app-detail-title-group">
                <h1>${data.name}</h1>
                <p>${data.category}</p>
                <span>By Ai Technocrafts</span>
            </div>
        </div>

        <div class="app-detail-actions">
            ${downloadButtonHTML}
        </div>

        <!-- Screenshots Section (We'll make this dynamic later) -->
        <div class="screenshots-gallery">
            <h2>Screenshots</h2>
            <div class="gallery">
                <img src="https://via.placeholder.com/200x400.png?text=Screenshot+1" alt="Screenshot 1">
                <img src="https://via.placeholder.com/200x400.png?text=Screenshot+2" alt="Screenshot 2">
                <img src="https://via.placeholder.com/200x400.png?text=Screenshot+3" alt="Screenshot 3">
            </div>
        </div>

        <div class="app-description">
            <h2>About this app</h2>
            <p>${data.description || 'No description provided.'}</p>
        </div>
    `;
}
