document.addEventListener('DOMContentLoaded', function() {
    // Get the short code from the current URL
    const pathParts = window.location.pathname.split('/');
    const shortCode = pathParts[1];
    
    // Initialize modals
    const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    // Update button handler
    document.getElementById('updateBtn')?.addEventListener('click', function() {
        const originalUrl = document.getElementById('originalUrl').value;
        document.getElementById('updatedUrl').value = originalUrl;
        document.getElementById('shortCodeInput').value = shortCode;
        updateModal.show();
    });

    // Delete button handler
    document.getElementById('deleteBtn')?.addEventListener('click', function() {
        document.getElementById('deleteShortCodeInput').value = shortCode;
        deleteModal.show();
    });

    // Update confirmation handler
    document.getElementById('confirmUpdate')?.addEventListener('click', async function() {
        const updatedUrl = document.getElementById('updatedUrl').value;
        
        if (!updatedUrl) {
            showAlert('Please enter a valid URL', 'danger');
            return;
        }

        try {
            const response = await fetch(`/shorten/${shortCode}/update/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ original_url: updatedUrl })
            });
            
            if (response.ok) {
                updateModal.hide();
                location.reload();
            } else {
                const errorData = await response.json();
                showAlert(errorData.original_url?.[0] || 'Failed to update URL', 'danger');
            }
        } catch (error) {
            showAlert('Network Error: ' + error.message, 'danger');
        }
    });

    // Delete confirmation handler
    document.getElementById('confirmDelete')?.addEventListener('click', async function() {
        try {
            const response = await fetch(`/shorten/${shortCode}/delete/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                deleteModal.hide();
                window.location.href = '/dashboard/';
            } else {
                const errorData = await response.json();
                showAlert(errorData.detail || 'Failed to delete URL', 'danger');
            }
        } catch (error) {
            showAlert('Network Error: ' + error.message, 'danger');
        }
    });

    // Copy button handler
    document.querySelector('.btn-outline-secondary')?.addEventListener('click', function() {
        copyToClipboard('originalUrl');
    });
});