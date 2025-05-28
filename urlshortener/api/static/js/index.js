document.addEventListener('DOMContentLoaded', function() {
    const shortenForm = document.getElementById('shortenForm');
    if (shortenForm) {
        shortenForm.addEventListener('submit', handleShortenSubmit);
    }

    const confirmUpdate = document.getElementById('confirmUpdate');
    if (confirmUpdate) {
        confirmUpdate.addEventListener('click', handleUpdate);
    }

    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            new bootstrap.Modal(document.getElementById('deleteModal')).show();
        });
    }

    const confirmDelete = document.getElementById('confirmDelete');
    if (confirmDelete) {
        confirmDelete.addEventListener('click', handleDelete);
    }
});

let currentShortCode = '';

async function handleShortenSubmit(e) {
    e.preventDefault();
    const originalUrl = document.getElementById('originalUrl').value;
    
    try {
        const response = await fetch('/shorten/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ original_url: originalUrl })
        });
        
        if (response.ok) {
            const data = await response.json();
            currentShortCode = data.short_code;
            
            document.getElementById('originalUrlResult').textContent = data.original_url;
            document.getElementById('shortUrlResult').value = `${window.location.origin}/${data.short_code}/`;
            document.getElementById('statsLink').href = `/${data.short_code}/stats/`;
            document.getElementById('resultContainer').style.display = 'block';
            document.getElementById('originalUrl').value = '';
            
            showAlert('URL shortened successfully!');
        } else {
            const errorData = await response.json();
            showAlert(errorData.original_url?.[0] || 'Error shortening URL', 'danger');
        }
    } catch (error) {
        showAlert('Network Error: ' + error.message, 'danger');
    }
}

async function handleUpdate() {
    const updatedUrl = document.getElementById('updatedUrl').value;
    
    try {
        const response = await fetch(`/shorten/${currentShortCode}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ original_url: updatedUrl })
        });
        
        if (response.ok) {
            const data = await response.json();
            document.getElementById('originalUrlResult').textContent = data.original_url;
            document.getElementById('updatedUrl').value = '';
            bootstrap.Modal.getInstance(document.getElementById('updateModal')).hide();
            showAlert('URL updated successfully!');
        } else {
            const errorData = await response.json();
            showAlert(errorData.original_url?.[0] || 'Error updating URL', 'danger');
        }
    } catch (error) {
        showAlert('Network Error: ' + error.message, 'danger');
    }
}

async function handleDelete() {
    try {
        const response = await fetch(`/shorten/${currentShortCode}/delete/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (response.ok) {
            document.getElementById('resultContainer').style.display = 'none';
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
            showAlert('URL deleted successfully!');
        } else {
            const errorData = await response.json();
            showAlert(errorData.detail || 'Error deleting URL', 'danger');
        }
    } catch (error) {
        showAlert('Network Error: ' + error.message, 'danger');
    }
}
// Add this to your existing index.js file, after the DOMContentLoaded event listener

document.addEventListener('DOMContentLoaded', function() {
    // Existing event listeners...
    
    const retrieveForm = document.getElementById('retrieveForm');
    if (retrieveForm) {
        retrieveForm.addEventListener('submit', handleRetrieveSubmit);
    }
});

// Add these new functions to your index.js

async function handleRetrieveSubmit(e) {
    e.preventDefault();
    const shortUrlInput = document.getElementById('shortUrl').value.trim();
    
    // Extract the short code from the input
    const shortCode = extractShortCode(shortUrlInput);
    
    if (!shortCode) {
        alert('Please enter a valid short URL');
        return;
    }

    try {
        const response = await fetch(`/shorten/${shortCode}/retrieve/`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const resultContainer = document.getElementById('retrieveResult');
            const originalUrlElement = document.getElementById('originalUrlRetrieved');
            const goToLink = document.getElementById('goToOriginalUrl');
            
            originalUrlElement.textContent = data.original_url;
            goToLink.href = data.original_url;
            resultContainer.style.display = 'block';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail || 'Failed to retrieve URL'}`);
        }
    } catch (error) {
        alert(`Network Error: ${error.message}`);
    }
}

function extractShortCode(url) {
    // Remove protocol and domain if present
    const cleanedUrl = url.replace(/^(https?:\/\/)?([^\/]+)?\/?/i, '');
    // Remove trailing slash if present
    return cleanedUrl.replace(/\/$/, '');
}