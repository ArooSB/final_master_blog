from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Change this to a secure key in production
CORS(app)

# Initialize Flask-Login and Flask-Bcrypt
login_manager = LoginManager()
login_manager.init_app(app)
bcrypt = Bcrypt(app)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

# Hardcoded data
POSTS = [
    {"id": 1, "title": "First post", "content": "This is the first post."},
    {"id": 2, "title": "Second post", "content": "This is the second post."},
]
COMMENTS = []
users = {}

class User(UserMixin):
    def __init__(self, username):
        self.id = username

@login_manager.user_loader
def load_user(user_id):
    return User(user_id) if user_id in users else None

@app.route('/api/v1/posts', methods=['GET'])
@limiter.limit("5 per minute")
def get_posts():
    sort_field = request.args.get('sort')
    sort_direction = request.args.get('direction', 'asc')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))

    if sort_direction not in ['asc', 'desc']:
        return jsonify({"message": "Invalid direction parameter. Use 'asc' or 'desc'."}), 400

    if sort_field and sort_field not in ['title', 'content']:
        return jsonify({"message": "Invalid sort field. Use 'title' or 'content'."}), 400

    if sort_field:
        POSTS.sort(key=lambda post: post.get(sort_field, '').lower(), reverse=(sort_direction == 'desc'))

    start = (page - 1) * per_page
    end = start + per_page
    paginated_posts = POSTS[start:end]

    return jsonify(paginated_posts)

@app.route('/api/v1/posts', methods=['POST'])
@login_required
def add_post():
    data = request.get_json()
    if not data or 'title' not in data or 'content' not in data:
        return jsonify({"message": "Missing 'title' or 'content'"}), 400

    new_id = max(post['id'] for post in POSTS) + 1
    new_post = {"id": new_id, "title": data['title'], "content": data['content']}
    POSTS.append(new_post)
    return jsonify(new_post), 201

@app.route('/api/v1/posts/<int:id>', methods=['DELETE'])
@login_required
def delete_post(id):
    global POSTS
    post_to_delete = next((post for post in POSTS if post['id'] == id), None)
    if post_to_delete is None:
        return jsonify({"message": f"Post with id {id} not found."}), 404

    POSTS = [post for post in POSTS if post['id'] != id]
    return jsonify({"message": f"Post with id {id} has been deleted successfully."}), 200

@app.route('/api/v1/posts/<int:id>', methods=['PUT'])
@login_required
def update_post(id):
    post_to_update = next((post for post in POSTS if post['id'] == id), None)
    if post_to_update is None:
        return jsonify({"message": f"Post with id {id} not found."}), 404

    data = request.get_json()
    if 'title' in data:
        post_to_update['title'] = data['title']
    if 'content' in data:
        post_to_update['content'] = data['content']

    return jsonify(post_to_update), 200

@app.route('/api/v1/posts/search', methods=['GET'])
def search_posts():
    title_query = request.args.get('title', '').lower()
    content_query = request.args.get('content', '').lower()
    filtered_posts = [post for post in POSTS if
                      (title_query in post['title'].lower() if title_query else True) and
                      (content_query in post['content'].lower() if content_query else True)]
    return jsonify(filtered_posts)

@app.route('/api/v1/users/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"message": "Username and password required."}), 400
    if username in users:
        return jsonify({"message": "User already exists."}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users[username] = hashed_password
    return jsonify({"message": "User registered successfully."}), 201

@app.route('/api/v1/users/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        user_password = users.get(username)
        if not user_password or not bcrypt.check_password_hash(user_password, password):
            return jsonify({"message": "Invalid credentials."}), 401
        user = User(username)
        login_user(user)
        return jsonify({"message": "Login successful."})
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/api/v1/users/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful."})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003, debug=True)
