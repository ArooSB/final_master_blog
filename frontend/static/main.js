// Function to load posts with sorting and pagination options
async function loadPosts() {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    const sortField = document.getElementById('sort-field').value;
    const sortDirection = document.getElementById('sort-direction').value;
    const pageNumber = document.getElementById('page-number').value || 1;
    const postsPerPage = document.getElementById('posts-per-page').value || 10;

    let queryParams = [];
    if (sortField) queryParams.push(`sort=${encodeURIComponent(sortField)}`);
    if (sortDirection) queryParams.push(`direction=${encodeURIComponent(sortDirection)}`);
    if (pageNumber) queryParams.push(`page=${encodeURIComponent(pageNumber)}`);
    if (postsPerPage) queryParams.push(`per_page=${encodeURIComponent(postsPerPage)}`);

    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    try {
        const response = await fetch(`${apiBaseUrl}/posts${queryString}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Function to add a new post
async function addPost() {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) {
        alert('Please enter both title and content.');
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const newPost = await response.json();
        alert(`Post added with ID: ${newPost.id}`);
        loadPosts(); // Reload posts to include the new post
    } catch (error) {
        console.error('Error adding post:', error);
    }
}

// Function to update a post
async function updatePost() {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    const postId = document.getElementById('update-post-id').value;
    const newTitle = document.getElementById('update-title').value;
    const newContent = document.getElementById('update-content').value;

    if (!postId) {
        alert('Please enter the Post ID.');
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newTitle || undefined,
                content: newContent || undefined
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const updatedPost = await response.json();
        alert(`Post updated: ${JSON.stringify(updatedPost)}`);
        loadPosts(); // Reload posts to include the updated post
    } catch (error) {
        console.error('Error updating post:', error);
    }
}

// Function to delete a post
async function deletePost(id) {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    if (!confirm('Are you sure you want to delete this post?')) {
        return;
    }
    try {
        const response = await fetch(`${apiBaseUrl}/posts/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        alert(result.message);
        loadPosts(); // Reload posts to reflect the deletion
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

// Function to search posts
async function searchPosts() {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    const titleSearch = document.getElementById('search-title').value;
    const contentSearch = document.getElementById('search-content').value;

    let queryParams = [];
    if (titleSearch) queryParams.push(`title=${encodeURIComponent(titleSearch)}`);
    if (contentSearch) queryParams.push(`content=${encodeURIComponent(contentSearch)}`);

    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

    try {
        const response = await fetch(`${apiBaseUrl}/posts/search${queryString}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        console.error('Error searching posts:', error);
    }
}

// Function to display posts
function displayPosts(posts) {
    const postContainer = document.getElementById('post-container');
    postContainer.innerHTML = ''; // Clear existing posts
    if (posts.length === 0) {
        postContainer.innerHTML = '<p>No posts available.</p>';
    } else {
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <button onclick="deletePost(${post.id})">Delete</button>
            `;
            postContainer.appendChild(postElement);
        });
    }
}

// Function to register a new user
async function register() {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

// Function to login a user
async function login() {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        alert(result.message);
        loadPosts(); // Load posts after login if necessary
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

// Function to logout the user
async function logout() {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    try {
        const response = await fetch(`${apiBaseUrl}/users/logout`, {
            method: 'POST',
            credentials: 'include' // Ensure cookies are sent
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        alert(result.message);
        loadPosts(); // Load posts after logout if necessary
    } catch (error) {
        console.error('Error logging out:', error);
    }
}
