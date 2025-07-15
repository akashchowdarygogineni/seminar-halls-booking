// Set minimum date to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
    
    // Add form validation
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            const dateInput = document.getElementById('date');
            const timeInput = document.getElementById('time');
            const reasonInput = document.getElementById('reason');
            
            // Validate date is not in the past
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                e.preventDefault();
                alert('Please select a future date for your booking.');
                return;
            }
            
            // Validate time is not in the past if date is today
            if (selectedDate.toDateString() === today.toDateString()) {
                const selectedTime = timeInput.value;
                const currentTime = new Date().toTimeString().slice(0, 5);
                
                if (selectedTime <= currentTime) {
                    e.preventDefault();
                    alert('Please select a future time for today\'s booking.');
                    return;
                }
            }
            
            // Validate reason length
            if (reasonInput.value.trim().length < 10) {
                e.preventDefault();
                alert('Please provide a more detailed reason (at least 10 characters).');
                return;
            }
            
            // Show loading state
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
        });
    }
});

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function() {
            // Scroll to top after form submission
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
        });
    }
});

// Auto-refresh booking status every 30 seconds
setInterval(function() {
    // Only refresh if user is still on the page
    if (document.visibilityState === 'visible') {
        const currentUrl = window.location.href;
        if (currentUrl.includes('/faculty-dashboard')) {
            // Silently check for updates
            fetch('/faculty-dashboard')
                .then(response => response.text())
                .then(html => {
                    // Parse the response to check for new booking statuses
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const newTable = doc.querySelector('.table-container table tbody');
                    const currentTable = document.querySelector('.table-container table tbody');
                    
                    if (newTable && currentTable && newTable.innerHTML !== currentTable.innerHTML) {
                        // Update the table with new data
                        currentTable.innerHTML = newTable.innerHTML;
                        
                        // Show a subtle notification
                        showNotification('Booking status updated!');
                    }
                })
                .catch(error => {
                    console.log('Auto-refresh failed:', error);
                });
        }
    }
}, 30000); // 30 seconds

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);