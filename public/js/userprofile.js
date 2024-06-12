var followForm = document.getElementById('followForm');
var followButton = document.getElementById('followButton');


followForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission
    toggleFollow('{{user.id}}');
});

function toggleFollow(userId) {
    if (followButton.innerText === 'Follow') {
        followButton.innerText = 'Unfollow';
        // Implement logic to follow the user
        // Example: Send a request to your backend to follow the user with ID userId
    } else {
        followButton.innerText = 'Follow';
        // Implement logic to unfollow the user
        // Example: Send a request to your backend to unfollow the user with ID userId
    }
}
