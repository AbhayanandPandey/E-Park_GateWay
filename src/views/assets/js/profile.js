// Toggle edit mode for profile
document.getElementById('edit-profile-btn').addEventListener('click', function () {
    let username = document.getElementById('username');
    let isEditable = username.readOnly;

    // Toggle read-only status
    username.readOnly = !isEditable;

    // Change button text
    this.textContent = isEditable ? 'Save Profile' : 'Edit Profile';
    if(this.textContent==='save Profile')
    {
//   fetch('/profile', { method: 'POST' })

    }

    // If saving, you can add an Ajax call or form submission to save the changes
    if (!isEditable) {
        // Save the updated profile information (For demonstration, just log it)
        console.log('Profile updated:', username.value, email.value);
    }
});
