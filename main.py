"""
Smart Form AI Backend - Flask Version
Run with: python main.py
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
import bcrypt

load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL', 
    'sqlite:///smartform.db'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

# Initialize database
db = SQLAlchemy(app)
CORS(app)

# ============================================
# DATABASE MODELS
# ============================================

class User(db.Model):
    """User model"""
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text)
    profile_data = db.Column(db.JSON, default={})
    preferences = db.Column(db.JSON, default={
        "tone": "professional",
        "language": "en"
    })
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'bio': self.bio,
            'profile_data': self.profile_data,
            'preferences': self.preferences
        }


class Form(db.Model):
    """Form model"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    status = db.Column(db.String(50), default='draft')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = db.relationship('User', backref='forms')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'status': self.status,
            'fields_count': len(self.fields),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class FormField(db.Model):
    """Form field model"""
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey('form.id'), nullable=False)
    label = db.Column(db.String(255), nullable=False)
    field_type = db.Column(db.String(50), nullable=False)  # text, textarea, dropdown, etc
    placeholder = db.Column(db.String(255))
    character_limit = db.Column(db.Integer)
    position = db.Column(db.Integer, default=0)
    is_required = db.Column(db.Boolean, default=False)
    help_text = db.Column(db.Text)
    
    form = db.relationship('Form', backref='fields')
    
    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'label': self.label,
            'field_type': self.field_type,
            'placeholder': self.placeholder,
            'character_limit': self.character_limit,
            'position': self.position,
            'is_required': self.is_required,
            'help_text': self.help_text
        }


class Submission(db.Model):
    """Submission model"""
    id = db.Column(db.Integer, primary_key=True)
    form_id = db.Column(db.Integer, db.ForeignKey('form.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    submission_data = db.Column(db.JSON, nullable=False)
    status = db.Column(db.String(50), default='submitted')
    time_taken = db.Column(db.Integer)  # in seconds
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    form = db.relationship('Form', backref='submissions')
    user = db.relationship('User', backref='submissions')
    
    def to_dict(self):
        return {
            'id': self.id,
            'form_id': self.form_id,
            'user_id': self.user_id,
            'submission_data': self.submission_data,
            'status': self.status,
            'time_taken': self.time_taken,
            'created_at': self.created_at.isoformat()
        }


# ============================================
# UTILITY FUNCTIONS
# ============================================

def hash_password(password):
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(password, password_hash):
    """Verify password against hash"""
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))


def create_token(user_id, expires_in=24):
    """Create JWT token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=expires_in)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


def verify_token(token):
    """Verify JWT token and return user_id"""
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload.get('user_id')
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def get_current_user():
    """Get current user from Authorization header"""
    auth_header = request.headers.get('Authorization', '')
    
    if not auth_header.startswith('Bearer '):
        return None
    
    try:
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        
        if not user_id:
            return None
        
        return User.query.get(user_id)
    except:
        return None


# ============================================
# AUTH ROUTES
# ============================================

@app.route('/auth/signup', methods=['POST'])
def signup():
    """User signup"""
    try:
        data = request.json
        
        # Validate input
        if not data.get('email') or not data.get('full_name') or not data.get('password'):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create user
        user = User(
            email=data['email'],
            full_name=data['full_name'],
            password_hash=hash_password(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        token = create_token(user.id)
        
        return jsonify({
            'message': 'Signup successful',
            'access_token': token,
            'token_type': 'bearer',
            'user': user.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/auth/login', methods=['POST'])
def login():
    """User login"""
    try:
        data = request.json
        
        # Validate input
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Missing email or password'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        if not user or not verify_password(data['password'], user.password_hash):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        token = create_token(user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': token,
            'token_type': 'bearer',
            'user': user.to_dict()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/auth/logout', methods=['POST'])
def logout():
    """User logout"""
    return jsonify({'message': 'Logout successful'})


# ============================================
# USER ROUTES
# ============================================

@app.route('/users/me', methods=['GET'])
def get_user():
    """Get current user profile"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    return jsonify(user.to_dict())


@app.route('/users/me', methods=['PUT'])
def update_user():
    """Update user profile"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'bio' in data:
            user.bio = data['bio']
        if 'profile_data' in data:
            user.profile_data = data['profile_data']
        if 'preferences' in data:
            user.preferences = data['preferences']
        
        db.session.commit()
        
        return jsonify({'message': 'User updated successfully', 'user': user.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# FORM ROUTES
# ============================================

@app.route('/forms', methods=['POST'])
def create_form():
    """Create new form"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.json
        
        form = Form(
            user_id=user.id,
            title=data.get('title', 'Untitled Form'),
            description=data.get('description'),
            category=data.get('category'),
            status='draft'
        )
        
        db.session.add(form)
        db.session.commit()
        
        return jsonify({
            'message': 'Form created successfully',
            'form': form.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/forms', methods=['GET'])
def list_forms():
    """List user's forms"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        forms = Form.query.filter_by(user_id=user.id).order_by(Form.created_at.desc()).all()
        
        return jsonify([form.to_dict() for form in forms])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/forms/<int:form_id>', methods=['GET'])
def get_form(form_id):
    """Get specific form"""
    try:
        form = Form.query.get(form_id)
        if not form:
            return jsonify({'error': 'Form not found'}), 404
        
        return jsonify({
            'id': form.id,
            'user_id': form.user_id,
            'title': form.title,
            'description': form.description,
            'category': form.category,
            'status': form.status,
            'fields': [field.to_dict() for field in form.fields],
            'created_at': form.created_at.isoformat(),
            'updated_at': form.updated_at.isoformat()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/forms/<int:form_id>', methods=['PUT'])
def update_form(form_id):
    """Update form"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        form = Form.query.filter_by(id=form_id, user_id=user.id).first()
        if not form:
            return jsonify({'error': 'Form not found'}), 404
        
        data = request.json
        
        if 'title' in data:
            form.title = data['title']
        if 'description' in data:
            form.description = data['description']
        if 'category' in data:
            form.category = data['category']
        if 'status' in data:
            form.status = data['status']
        
        form.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({'message': 'Form updated', 'form': form.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/forms/<int:form_id>', methods=['DELETE'])
def delete_form(form_id):
    """Delete form"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        form = Form.query.filter_by(id=form_id, user_id=user.id).first()
        if not form:
            return jsonify({'error': 'Form not found'}), 404
        
        db.session.delete(form)
        db.session.commit()
        
        return jsonify({'message': 'Form deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# FORM FIELDS ROUTES
# ============================================

@app.route('/forms/<int:form_id>/fields', methods=['POST'])
def add_field(form_id):
    """Add field to form"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        form = Form.query.filter_by(id=form_id, user_id=user.id).first()
        if not form:
            return jsonify({'error': 'Form not found'}), 404
        
        data = request.json
        
        field = FormField(
            form_id=form_id,
            label=data.get('label', 'Untitled Field'),
            field_type=data.get('field_type', 'text'),
            placeholder=data.get('placeholder'),
            character_limit=data.get('character_limit'),
            position=data.get('position', 0),
            is_required=data.get('is_required', False),
            help_text=data.get('help_text')
        )
        
        db.session.add(field)
        db.session.commit()
        
        return jsonify({
            'message': 'Field added',
            'field': field.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/forms/<int:form_id>/fields/<int:field_id>', methods=['PUT'])
def update_field(form_id, field_id):
    """Update form field"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        form = Form.query.filter_by(id=form_id, user_id=user.id).first()
        if not form:
            return jsonify({'error': 'Form not found'}), 404
        
        field = FormField.query.filter_by(id=field_id, form_id=form_id).first()
        if not field:
            return jsonify({'error': 'Field not found'}), 404
        
        data = request.json
        
        if 'label' in data:
            field.label = data['label']
        if 'field_type' in data:
            field.field_type = data['field_type']
        if 'placeholder' in data:
            field.placeholder = data['placeholder']
        if 'character_limit' in data:
            field.character_limit = data['character_limit']
        if 'is_required' in data:
            field.is_required = data['is_required']
        if 'help_text' in data:
            field.help_text = data['help_text']
        
        db.session.commit()
        
        return jsonify({'message': 'Field updated', 'field': field.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/forms/<int:form_id>/fields/<int:field_id>', methods=['DELETE'])
def delete_field(form_id, field_id):
    """Delete form field"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        form = Form.query.filter_by(id=form_id, user_id=user.id).first()
        if not form:
            return jsonify({'error': 'Form not found'}), 404
        
        field = FormField.query.filter_by(id=field_id, form_id=form_id).first()
        if not field:
            return jsonify({'error': 'Field not found'}), 404
        
        db.session.delete(field)
        db.session.commit()
        
        return jsonify({'message': 'Field deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# SUBMISSION ROUTES
# ============================================

@app.route('/forms/<int:form_id>/submit', methods=['POST'])
def submit_form(form_id):
    """Submit form"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        form = Form.query.get(form_id)
        if not form:
            return jsonify({'error': 'Form not found'}), 404
        
        data = request.json
        
        submission = Submission(
            form_id=form_id,
            user_id=user.id,
            submission_data=data.get('submission_data', {}),
            time_taken=data.get('time_taken'),
            status='submitted'
        )
        
        db.session.add(submission)
        db.session.commit()
        
        return jsonify({
            'message': 'Form submitted successfully',
            'submission': submission.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/submissions', methods=['GET'])
def list_submissions():
    """List user's submissions"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        submissions = Submission.query.filter_by(user_id=user.id).order_by(
            Submission.created_at.desc()
        ).all()
        
        return jsonify([submission.to_dict() for submission in submissions])
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/submissions/<int:submission_id>', methods=['GET'])
def get_submission(submission_id):
    """Get specific submission"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        submission = Submission.query.filter_by(
            id=submission_id,
            user_id=user.id
        ).first()
        
        if not submission:
            return jsonify({'error': 'Submission not found'}), 404
        
        return jsonify(submission.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# ANALYTICS ROUTES
# ============================================

@app.route('/analytics/dashboard', methods=['GET'])
def get_dashboard():
    """Get dashboard statistics"""
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        forms_created = len(user.forms)
        submissions_sent = len(user.submissions)
        
        return jsonify({
            'forms_created': forms_created,
            'submissions_sent': submissions_sent,
            'time_saved_minutes': submissions_sent * 5,
            'active_forms': len([f for f in user.forms if f.status == 'active']),
            'ai_suggestions_used': 0
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================
# ROOT & HEALTH CHECK
# ============================================

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'Welcome to Smart Form AI Backend',
        'version': '1.0.0',
        'status': 'active'
    })


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'Smart Form AI API'})


# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500


# ============================================
# CREATE TABLES & RUN
# ============================================

def create_app():
    """Create and initialize the app"""
    with app.app_context():
        db.create_all()
        print("✅ Database tables created successfully")
    return app


if __name__ == '__main__':
    app = create_app()
    
    print("\n" + "="*50)
    print("🚀 Starting Smart Form AI Backend")
    print("="*50)
    print(f"📡 Server: http://0.0.0.0:8000")
    print(f"📚 API Docs: http://localhost:8000/api/docs (when added)")
    print("🔑 Press CTRL+C to stop\n")
    
    app.run(
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 8000)),
        debug=True
    )
