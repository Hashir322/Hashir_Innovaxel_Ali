document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    // Event delegation for action buttons
    document.addEventListener('click', function(e) {
        // Update button handler
        if (e.target.classList.contains('update-btn')) {
            const shortCode = e.target.dataset.shortcode;
            const originalUrl = e.target.dataset.originalurl;
            
            document.getElementById('updatedUrl').value = originalUrl;
            document.getElementById('shortCodeInput').value = shortCode;
            updateModal.show();
        }
        
        // Delete button handler
        if (e.target.classList.contains('delete-btn')) {
            const shortCode = e.target.dataset.shortcode;
            document.getElementById('deleteShortCodeInput').value = shortCode;
            deleteModal.show();
        }
    });

    // Update confirmation handler
    document.getElementById('confirmUpdate')?.addEventListener('click', async function() {
        const updatedUrl = document.getElementById('updatedUrl').value;
        const shortCode = document.getElementById('shortCodeInput').value;
        
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
        const shortCode = document.getElementById('deleteShortCodeInput').value;
        
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
                location.reload();
            } else {
                const errorData = await response.json();
                showAlert(errorData.detail || 'Failed to delete URL', 'danger');
            }
        } catch (error) {
            showAlert('Network Error: ' + error.message, 'danger');
        }
    });
});