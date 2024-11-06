const map = L.map('map').setView([51.505, -0.09], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker;
const markers = L.layerGroup().addTo(map);
let lastSearchQuery = ''; // Variable to track the last search query
const recentSearches = []; // Array to hold recent searches

// Function to send webhook notification by calling the server's endpoint
function sendWebhookNotification(action, location, timestamp) {
    const webhookUrl = 'http://localhost:3000/send-webhook'; // Local server endpoint
    const payload = {
        action: action,
        timestamp: timestamp,
        location: location, // Added location to the payload
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        console.log('Webhook notification sent:', response);
        if (!response.ok) {
            console.error('Webhook response was not ok:', response.statusText);
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data from webhook:', data);
        // Add the search to the recent searches array
        recentSearches.push({ location, timestamp });
        updateNotificationBell();
    })
    .catch(error => console.error('Error sending webhook notification:', error));
}

// Function to update the notification bell with recent searches
function updateNotificationBell() {
    const notificationBell = document.getElementById('notificationBell');
    const notificationPopup = document.getElementById('notificationPopup');

    // Clear current notification content
    notificationPopup.innerHTML = '';

    // Display a new notification in the bell icon if there are recent searches
    if (recentSearches.length > 0) {
        notificationPopup.style.display = 'block';

        // Create a list of recent searches
        recentSearches.forEach((search, index) => {
            const listItem = document.createElement('div');
            listItem.classList.add('notification-item');
            listItem.innerHTML = `<strong>Location:</strong> ${search.location} <br><strong>Time:</strong> ${search.timestamp}`;
            notificationPopup.appendChild(listItem);
        });

        // Display a message if there are no recent searches
    } else {
        notificationPopup.style.display = 'none';
    }
}

// Function to search for a location based on user input
window.searchLocation = function() {
    const searchQuery = document.getElementById('locationSearch').value.trim();
    console.log('Search query:', searchQuery); // Log the search query

    if (!searchQuery) {
        alert('Please enter a location to search.');
        return;
    }

    if (searchQuery === lastSearchQuery) {
        alert('You have already searched for this location.');
        return;
    }

    lastSearchQuery = searchQuery;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
        .then(response => {
            if (!response.ok) {
                console.error('Nominatim response was not ok:', response.statusText);
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Search results:', data);
            
            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];
                map.setView([lat, lon], 13);
                
                if (marker) {
                    markers.removeLayer(marker);
                }
                marker = L.marker([lat, lon]).addTo(markers)
                    .bindPopup(display_name)
                    .openPopup();

                const action = `Location searched: ${display_name} (Lat: ${lat}, Lon: ${lon})`;
                const timestamp = new Date().toLocaleString(); // Get the current timestamp
                console.log('Preparing to send webhook notification...');
                sendWebhookNotification(action, display_name, timestamp); // Send location and timestamp as well
            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching location:', error);
            alert('Error fetching location: ' + error.message);
        });
};
