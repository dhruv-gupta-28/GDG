document.addEventListener('DOMContentLoaded', function() {
    const API_URL = '/api';

    // Handle dashboard link click
    const dashboardLink = document.getElementById('dashboard-link');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(e) {
            e.preventDefault();
            const userType = localStorage.getItem('userType');
            const token = localStorage.getItem('token');

            if (!token) {
                showNotification('Please login first', 'error');
                return;
            }

            switch(userType) {
                case 'coach':
                    window.location.href = '/pages/coach-dashboard.html';
                    break;
                case 'player':
                    window.location.href = '/pages/player-dashboard.html';
                    break;
                case 'organizer':
                    window.location.href = '/pages/organizer-dashboard.html';
                    break;
                default:
                    showNotification('Invalid user type', 'error');
            }
        });
    }

    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Show the selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validate form
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Store token and user type
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userType', data.userType);

                    // Redirect based on user type
                    switch(data.userType) {
                        case 'coach':
                            window.location.href = '/pages/coach-dashboard.html';
                            break;
                        case 'player':
                            window.location.href = '/pages/player-dashboard.html';
                            break;
                        case 'organizer':
                            window.location.href = '/pages/organizer-dashboard.html';
                            break;
                        default:
                            showNotification('Invalid user type', 'error');
                            return;
                    }
                } else {
                    showNotification(data.msg || 'Login failed', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                showNotification('An error occurred during login', 'error');
            }
        });
    }
    
    // Register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const userType = document.querySelector('input[name="user-type"]:checked').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Validate form
            if (!name || !email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            if (!termsAccepted) {
                showNotification('Please accept the terms and conditions', 'error');
                return;
            }
            
            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password, userType })
                });

                const data = await response.json();

                if (response.ok) {
                    showNotification('Registration successful! Please login.', 'success');
                    // Switch to login tab
                    document.querySelector('[data-tab="login"]').click();
                } else {
                    showNotification(data.msg || 'Registration failed', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                showNotification('An error occurred during registration', 'error');
            }
        });
    }
    
    // OAuth button clicks
    const oauthButtons = document.querySelectorAll('.oauth-btn');
    oauthButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'google' : 
                           this.classList.contains('facebook') ? 'facebook' : 'apple';
            
            // Redirect to OAuth provider
            window.location.href = `${API_URL}/auth/${provider}`;
        });
    });
    
    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type');
            
            // Toggle password visibility
            passwordInput.setAttribute('type', type === 'password' ? 'text' : 'password');
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });

    // Helper function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
});