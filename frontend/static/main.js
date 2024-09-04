// Fetch the API base URL from the input field
const apiBaseUrlInput = document.getElementById('api-base-url');

// Function to load posts from the server
function loadPosts() {
    const apiBaseUrl = apiBaseUrlInput.value;
    const sortField = document.getElementById('sort-field').value;
    const sortDirection = document.getElementById('sort-direction').value;
    const pageNumber = document.getElementById('page-number').value;
    const postsPerPage = document.getElementById('posts-per-page').value;

    fetch(`${apiBaseUrl}/posts?sort=${sortField}&direction=${sortDirection}&page=${pageNumber}&per_page=${postsPerPage}`)
        .then(response => response.json())
        .then(posts => {
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
                postContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error loading posts:', error));
}

// Function to add a new post
function addPost() {
    const apiBaseUrl = apiBaseUrlInput.value;
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    fetch(`${apiBaseUrl}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAuthToken() // Add auth token if needed
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Post added:', data);
        loadPosts();
    })
    .catch(error => console.error('Error adding post:', error));
}

// Function to update an existing post
function updatePost() {
    const apiBaseUrl = apiBaseUrlInput.value;
    const postId = document.getElementById('update-post-id').value;
    const title = document.getElementById('update-title').value;
    const content = document.getElementById('update-content').value;

    fetch(`${apiBaseUrl}/posts/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAuthToken() // Add auth token if needed
        },
        body: JSON.stringify({ title, content })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Post updated:', data);
        loadPosts();
    })
    .catch(error => console.error('Error updating post:', error));
}

// Function to search for posts
function searchPosts() {
    const apiBaseUrl = apiBaseUrlInput.value;
    const title = document.getElementById('search-title').value;
    const content = document.getElementById('search-content').value;

    fetch(`${apiBaseUrl}/posts/search?title=${title}&content=${content}`)
        .then(response => response.json())
        .then(posts => {
            const postContainer = document.getElementById('post-container');
            postContainer.innerHTML = '';
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post';
                postElement.innerHTML = `<h2>${post.title}</h2><p>${post.content}</p>`;
                postContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error searching posts:', error));
}

// Function to register a new user
function register() {
    const apiBaseUrl = apiBaseUrlInput.value;
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    fetch(`${apiBaseUrl}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('User registered:', data);
    })
    .catch(error => console.error('Error registering user:', error));
}

// Function to log in a user
function login() {
    const apiBaseUrl = apiBaseUrlInput.value;
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch(`${apiBaseUrl}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('User logged in:', data);
        // Store auth token or user info if needed
    })
    .catch(error => console.error('Error logging in user:', error));
}

// Function to log out a user
function logout() {
    const apiBaseUrl = apiBaseUrlInput.value;

    fetch(`${apiBaseUrl}/users/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAuthToken() // Add auth token if needed
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('User logged out:', data);
    })
    .catch(error => console.error('Error logging out user:', error));
}

// Utility function to get auth token (if applicable)
function getAuthToken() {
    // Implement token retrieval logic if you're using tokens
    return '';
}
