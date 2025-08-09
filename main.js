// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Firebase Initialization ---
    // Check if firebase is initialized to avoid errors
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error("Firebase is not initialized. Check your config and script tags.");
        return;
    }
    // Initialize Firebase using the config object
    firebase.initializeApp(firebaseConfig);
    // Get a reference to the Firestore database service
    const db = firebase.firestore();

    // --- DOM Element References ---
    // Get the containers where we will display the apps
    const featuredAppsGrid = document.getElementById('featured-apps');
    const allAppsGrid = document.getElementById('all-apps');

    // --- Function to Create an App Card HTML ---
    // This function takes an app object and returns the HTML for its card
    function createAppCard(app) {
        // 'app.id' is the unique document ID from Firestore
        // We'll use this to link to the detail page
        return `
            <a href="app.html?id=${app.id}" class="app-card">
                <div class="app-card-content">
                    <img src="${app.data.iconUrl}" alt="${app.data.name} Icon" class="app-card-icon">
                    <div class="app-card-info">
                        <h3>${app.data.name}</h3>
                        <p>${app.data.category}</p>
                    </div>
                </div>
            </a>
        `;
    }

    // --- Function to Fetch and Display Apps ---
    async function fetchAndDisplayApps() {
        try {
            // Get all documents from the "apps" collection
            const snapshot = await db.collection('apps').orderBy('createdAt', 'desc').get();
            
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
                    id: doc.id,       // The unique ID of the document
                    data: doc.data()  // The actual data (name, category, etc.)
                };

                // Create the HTML for the app card
                const cardHTML = createAppCard(app);

                // Check if the app is featured and add it to the correct section
                if (app.data.isFeatured) {
                    featuredAppsGrid.innerHTML += cardHTML;
                }
                allAppsGrid.innerHTML += cardHTML;
            });

        } catch (error) {
            console.error("Error fetching apps: ", error);
            allAppsGrid.innerHTML = '<p>Could not load apps. Please try again later.</p>';
        }
    }

    // --- Initial Call ---
    // Call the function to load apps when the page loads
    fetchAndDisplayApps();
});
