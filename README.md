Web Application Features
User Authentication:

Account Creation:
Users can create an account using an email address, password, and other necessary information.
These accounts are classified as "regular" accounts.
"Moderator" accounts must be added or modified manually in the database using a tool like SQLiteStudio.
Login and Logout:
Users can log into their accounts using their email and password.
All pages of the web application should allow only logged-in users to access them.
A logout option should be available on all pages of the application.
Profile Management:

Profile Viewing:
The profile page displays the name of the user whose profile is being viewed.
If the logged-in user is viewing another user's profile, a "follow" button will be visible.
The "follow" button allows users to follow or unfollow another user's posts, with this action being directly reflected in the database using a "follows" table.
If the user is a "moderator", they will see a delete button for each post, allowing them to delete posts. This functionality is restricted to moderator accounts only.
Post Management:

Post Viewing:
The post viewing page displays posts only from the profiles that the logged-in user follows.
If the logged-in user is a "moderator", they will see a delete button for each post, enabling them to delete posts.
View All Posts:
Users can view all posts made on the application, sorted in descending chronological order (newest posts at the top).
Each post must display:
The name of the user who posted it.
The date and time of the post.
The content of the post.
The number of "likes" (though the "like" feature is not yet implemented).
Users can add new posts, which will initially be attributed to a default user (e.g., user with ID 1) until user management is implemented.
Client-Side and Server-Side Validation:
All data sent by the client and received by the server must be validated on both ends to ensure data integrity and security.
User Search:

Search Functionality:
Users can search for other users by name, with partial matches returning relevant results (e.g., searching "ev" could return "Evelyne," "Marie-Eve," or "Levie").
Clicking on a user's name in the search results redirects to that user's profile page.
If no matches are found, a message should indicate that there are no results for the search.
Like the post management, all search-related data must be validated both client-side and server-side.
