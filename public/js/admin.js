function showRejectForm(bookingId) {
    const modal = document.getElementById('rejectModal');
    const form = document.getElementById('rejectForm');
    
    form.action = `/update-booking/${bookingId}`;
    modal.style.display = 'block';
    
    document.getElementById('adminReason').focus();
}

function closeRejectModal() {
    const modal = document.getElementById('rejectModal');
    modal.style.display = 'none';
    
    // Clear the form
    document.getElementById('adminReason').value = '';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('rejectModal');
    if (event.target === modal) {
        closeRejectModal();
    }
}

// Handle form submissions with loading states
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Processing...';
                submitButton.disabled = true;
                
                // Re-enable after 3 seconds as fallback
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    });
});

// Add confirmation for delete actions
document.addEventListener('DOMContentLoaded', function() {
    const deleteButtons = document.querySelectorAll('.btn-danger');
    
    deleteButtons.forEach(button => {
        if (button.textContent.includes('Delete')) {
            button.addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to delete this faculty member? This action cannot be undone.')) {
                    e.preventDefault();
                }
            });
        }
    });
});

function createPasswordFeedback() {
    const feedback = document.createElement('div');
    feedback.id = 'password-feedback';
    feedback.className = 'password-feedback';
    document.getElementById('password').parentNode.appendChild(feedback);
    return feedback;
}

function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length === 0) {
        return { isValid: false, message: '' };
    }

    if (password.length < minLength) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    if (!hasUpperCase) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!hasLowerCase) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!hasNumbers) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }

    if (!hasSpecialChar) {
        return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: 'Password is strong ✓' };
}