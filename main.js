// --- Step 1: Import necessary functions from Firebase and our config ---

// Import the 'initializeApp' function from the Firebase app SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
// Import Firestore functions from the Firestore SDK
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
// Import our Firebase config from the local file
import { firebaseConfig } from './firebase-config.js';


// --- Step 2: Initialize Firebase and Firestore ---

// Initialize Firebase with our config. This is the app instance.
const app = initializeApp(firebaseConfig);
// Get a reference to the Firestore database service
const db = getFirestore(app);


// --- Step 3: Wait for the DOM to be ready ---
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element References ---
    const featuredAppsGrid = document.getElementById('featured-apps');
    const allAppsGrid = document.getElementById('all-apps');

        // --- Function to Create an App Card HTML ---
    function createAppCard(app) {
        // Hum check karenge ki category hai ya nahi. Agar nahi hai, to khaali chhod denge.
        const categoryHTML = app.data.category ? `<p>${app.data.category}</p>` : '';

        return `
            <a href="app.html?id=${app.id}" class="app-card">
                <div class="app-card-content">
                    <img src="${app.data.iconUrl}" alt="${app.data.name} Icon" class="app-card-icon">
                    <div class="app-card-info">
                        <h3>${app.data.name}</h3>
                        ${categoryHTML}  
                    </div>
                </div>
            </a>
        `;
    }

    // --- Function to Fetch and Display Apps (Updated for Modular SDK) ---
    async function fetchAndDisplayApps() {
        try {
            // Create a query to get apps from the "apps" collection, ordered by creation time
            const appsQuery = query(collection(db, "apps"), orderBy("createdAt", "desc"));
            // Execute the query
            const snapshot = await getDocs(appsQuery);
            
            // Clear the loading message
            featuredAppsGrid.innerHTML = '';
            allAppsGrid.innerHTML = '';

            if (snapshot.empty) {
                allAppsGrid.innerHTML = '<p>No apps found.</p>';
                return;
            }

            // Loop through each app document
            snapshot.forEach(doc => {
                const app = {
                    id: doc.id,
                    data: doc.data()
                };

                const cardHTML = createAppCard(app);

                if (app.data.isFeatured) {
                    featuredAppsGrid.innerHTML += cardHTML;
                }
                allAppsGrid.innerHTML += cardHTML;
            });

        } catch (error) {
            console.error("Error fetching apps: ", error);
            // This will show the error in the browser console, which is very helpful
            allAppsGrid.innerHTML = `<p>Error: ${error.message}. Check the console for more details.</p>`;
        }
    }

    // --- Initial Call ---
    fetchAndDisplayApps();
});

