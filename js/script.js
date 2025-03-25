document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const NOTIFICATION_DURATION = 5000;
    const REDIRECT_DELAY = 1500;
    const API_SIMULATION_DELAY = 2000;
    const DEFAULT_MAP_CENTER = { lat: 40.7128, lng: -74.0060 };
    const MAP_STYLES = [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }
    ];
    const ANIMATION_DELAY = 300;

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            // Toggle active class for animation
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
    
    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links li a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Dashboard sidebar toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Dashboard navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav li a');
    const contentSections = document.querySelectorAll('.content-section');
    
    if (sidebarLinks.length > 0 && contentSections.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                sidebarLinks.forEach(l => {
                    l.parentElement.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                // Hide all content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show the selected content section
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).classList.add('active');
            });
        });
    }
    
    // Remove duplicate constants section
    // Notification system
    // Enhanced notification system
    const notificationQueue = [];
    let isNotificationActive = false;
    
    // Fix processNotificationQueue function
    function processNotificationQueue() {
        if (notificationQueue.length === 0) {
            isNotificationActive = false;
            return;
        }
        
        isNotificationActive = true;
        const { message, type } = notificationQueue.shift();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'error' ? 'fa-exclamation-circle' : 
                          type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('active');
        }, ANIMATION_DELAY);
        
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(notification);
                processNotificationQueue();
            }, ANIMATION_DELAY);
        }, NOTIFICATION_DURATION);
    }

    // Update simulateLogin timeouts
    window.simulateLogin = function(email, password) {
        showNotification('Logging in...', 'info');
        
        setTimeout(() => {
            if (email.includes('coach')) {
                showNotification('Login successful! Redirecting to Coach Dashboard...', 'success');
                setTimeout(() => {
                    window.location.href = 'pages/coach-dashboard.html';
                }, REDIRECT_DELAY);
            } else if (email.includes('organizer')) {
                showNotification('Login successful! Redirecting to Organizer Dashboard...', 'success');
                setTimeout(() => {
                    window.location.href = 'pages/organizer-dashboard.html';
                }, 1500);
            } else if (email.includes('player')) {
                showNotification('Login successful! Redirecting to Player Dashboard...', 'success');
                setTimeout(() => {
                    window.location.href = 'pages/player-dashboard.html';
                }, 1500);
            } else {
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        }, 2000);
    };

    // Update simulateRegistration timeouts
    window.simulateRegistration = function(name, email, password, userType) {
        showNotification('Creating your account...', 'info');
        
        setTimeout(() => {
            showNotification('Registration successful! Please check your email to verify your account.', 'success');
            setTimeout(() => {
                const loginTabBtn = document.querySelector('[data-tab="login"]');
                if (loginTabBtn) {
                    loginTabBtn.click();
                }
            }, REDIRECT_DELAY);
        }, API_SIMULATION_DELAY);
    };

    // Update simulateOAuthLogin timeouts
    window.simulateOAuthLogin = function(provider) {
        showNotification(`Successfully authenticated with ${provider}!`, 'success');
        
        setTimeout(() => {
            showNotification('Redirecting to dashboard...', 'info');
            setTimeout(() => {
                window.location.href = 'pages/player-dashboard.html';
            }, REDIRECT_DELAY);
        }, REDIRECT_DELAY);
    };
});

// Function to initialize Google Maps
// Enhanced Map initialization
function initMap() {
    try {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        const map = new google.maps.Map(mapContainer, {
            center: DEFAULT_MAP_CENTER,
            zoom: 12,
            styles: MAP_STYLES
        });
        
        // Add markers for matches (in a real app, these would come from an API)
        const matches = [
            {
                position: { lat: 40.7128, lng: -74.0060 },
                title: 'Downtown Soccer Match',
                info: 'Saturday, 3:00 PM - Central Park Field 1'
            },
            {
                position: { lat: 40.7328, lng: -73.9860 },
                title: 'Midtown Basketball Tournament',
                info: 'Sunday, 10:00 AM - Midtown Courts'
            },
            {
                position: { lat: 40.6928, lng: -74.0260 },
                title: 'Brooklyn Baseball Game',
                info: 'Saturday, 1:00 PM - Prospect Park Field'
            }
        ];
        
        // Create an info window to share between markers
        const infoWindow = new google.maps.InfoWindow();
        const markers = [];
        
        matches.forEach(matchData => {
            try {
                const marker = new google.maps.Marker({
                    position: matchData.position,
                    map: map,
                    title: matchData.title,
                    animation: google.maps.Animation.DROP
                });
                
                markers.push(marker);
                
                marker.addListener('click', () => {
                    infoWindow.setContent(`
                        <div class="map-info-window">
                            <h3>${matchData.title}</h3>
                            <p>${matchData.info}</p>
                            <button class="btn primary-btn map-btn">Join Match</button>
                        </div>
                    `);
                    infoWindow.open(map, marker);
                });
            } catch (markerError) {
                console.error('Error creating marker:', markerError);
            }
        });
        
        const searchInput = document.getElementById('location-search');
        if (searchInput) {
            try {
                const autocomplete = new google.maps.places.Autocomplete(searchInput);
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (!place.geometry) {
                        showNotification('Location not found', 'warning');
                        return;
                    }
                    
                    map.setCenter(place.geometry.location);
                    map.setZoom(14);
                    
                    new google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        title: place.name,
                        animation: google.maps.Animation.DROP
                    });
                });
            } catch (searchError) {
                console.error('Error initializing search:', searchError);
                showNotification('Search functionality unavailable', 'error');
            }
        }
    } catch (mapError) {
        console.error('Error initializing map:', mapError);
        showNotification('Unable to load the map', 'error');
    }
}