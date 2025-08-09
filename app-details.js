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
// ******** YEH FUNCTION POORI TARAH SE UPDATE KIYA GAYA HAI ********
function displayAppDetails(data) {
    const container = document.getElementById('app-detail-container');
    
    // --- Download Button Logic ---
    const downloadButtonHTML = data.apkUrl && data.apkUrl.trim() !== ''
        ? `<a href="${data.apkUrl}" class="download-button" target="_blank" rel="noopener noreferrer">Download APK</a>`
        : `<p class="no-download">Download link not available yet.</p>`;

    // --- Category Logic ---
    // Check karega ki category hai ya nahi, agar hai to hi dikhayega
    const categoryHTML = data.category ? `<p class="app-detail-category">${data.category}</p>` : '';

    // --- Screenshots Logic ---
    // Check karega ki screenshots array hai ya nahi
    const screenshotsHTML = (data.screenshots && data.screenshots.length > 0)
        ? data.screenshots.map(url => `<img src="${url}" alt="App Screenshot">`).join('')
        : '<p>No screenshots available.</p>';
    
    // --- Final HTML ---
    container.innerHTML = `
        <div class="app-detail-header">
            <img src="${data.iconUrl}" alt="${data.name} Icon" class="app-detail-icon">
            <div class="app-detail-title-group">
                <h1>${data.name}</h1>
                ${categoryHTML}
                <span>By Ai Technocrafts</span>
            </div>
        </div>

        <div class="app-detail-actions">
            ${downloadButtonHTML}
        </div>

        <div class="screenshots-gallery">
            <h2>Screenshots</h2>
            <div class="gallery">
                ${screenshotsHTML}
            </div>
        </div>

        <div class="app-description">
            <h2>About this app</h2>
            <p>${data.description || 'No description provided.'}</p>
        </div>
    `;
}
