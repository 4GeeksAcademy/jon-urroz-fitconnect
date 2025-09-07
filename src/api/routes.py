import stripe
import os
import datetime
import jwt
import re
import logging
from flask import request, jsonify, current_app, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from api.utils import generate_sitemap, APIException
from api.models import db, User, TrainerProfile, Product, Order
from functools import wraps

# Configuración de Stripe (usa tu clave secreta en variable de entorno STRIPE_SECRET_KEY)
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Definir Blueprint antes de cualquier uso
api = Blueprint('api', __name__)

# Endpoint público para ver todos los productos


@api.route('/public-products', methods=['GET'])
def public_products():
    products = Product.query.filter_by(is_active=True).all()
    return jsonify([p.serialize() for p in products]), 200


# Configurar logging básico
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Decorador para requerir autenticación JWT


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        if not token:
            return jsonify({'msg': 'Token requerido'}), 401
        try:
            data = jwt.decode(
                token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['id'])
            if not current_user:
                return jsonify({'msg': 'Usuario no válido'}), 401
        except Exception as e:
            return jsonify({'msg': f'Token inválido: {str(e)}'}), 401
        return f(current_user, *args, **kwargs)
    return decorated


# Webhook de Stripe para actualizar orden tras pago


@api.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET', '')
    event = None
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except Exception as e:
        return jsonify({'msg': f'Webhook error: {str(e)}'}), 400

    # Manejar evento de pago exitoso
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session['metadata'].get('order_id')
        order = Order.query.get(order_id)
        if order:
            order.status = 'paid'
            order.payment_id = session['id']
            db.session.commit()
    return jsonify({'msg': 'Webhook recibido'}), 200


# Endpoint para crear sesión de pago con Stripe
@api.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.get_json()
    name = data.get('name', 'Servicio FitConnect')
    price = data.get('price', 10)
    description = data.get('description', '')
    success_url = data.get('success_url', 'http://localhost:3000/success')
    cancel_url = data.get('cancel_url', 'http://localhost:3000/cancel')
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': name,
                        'description': description
                    },
                    'unit_amount': int(float(price) * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=success_url,
            cancel_url=cancel_url
        )
        return jsonify({'checkout_url': session.url, 'session_id': session.id}), 200
    except Exception as e:
        return jsonify({'msg': str(e)}), 500


"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
# --- CRUD ÓRDENES (CARRITO/COMPRAS) ---

# --- ENDPOINT PARA CREAR TRAINERPROFILE ---


@api.route('/trainer-profile', methods=['POST'])
@token_required
def create_trainer_profile(current_user):
    if current_user.role != 'trainer':
        return jsonify({'msg': 'Solo los entrenadores pueden crear su perfil'}), 403
    if current_user.trainer_profile_id:
        return jsonify({'msg': 'Ya tienes un perfil de entrenador creado'}), 400
    data = request.get_json()
    name = data.get('name')
    specialty = data.get('specialty')
    description = data.get('description')
    price_per_session = data.get('price_per_session')
    if not all([name, specialty, price_per_session]):
        return jsonify({'msg': 'Faltan campos obligatorios (name, specialty, price_per_session)'}), 400
    try:
        price_per_session = float(price_per_session)
        if price_per_session <= 0:
            return jsonify({'msg': 'El precio por sesión debe ser un número positivo'}), 400
    except Exception:
        return jsonify({'msg': 'El precio por sesión debe ser un número válido'}), 400
    profile = TrainerProfile(
        user_id=current_user.id,
        name=name,
        specialty=specialty,
        description=description,
        price_per_session=price_per_session,
        is_active=True
    )
    db.session.add(profile)
    db.session.commit()
    # Actualizar el usuario con el id del perfil
    current_user.trainer_profile_id = profile.id
    db.session.commit()
    return jsonify(profile.serialize()), 201

# --- ENDPOINT PARA CREAR PRODUCT ---


@api.route('/orders', methods=['GET'])
@token_required
def get_orders(current_user):
    orders = Order.query.all()
    return jsonify([o.serialize() for o in orders]), 200


@api.route('/order/<int:order_id>', methods=['GET'])
@token_required
def get_order(current_user, order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"msg": "Orden no encontrada"}), 404
    return jsonify(order.serialize()), 200


@api.route('/order', methods=['POST'])
@token_required
def create_order(current_user):
    data = request.get_json()
    product_id = data.get('product_id')
    amount = data.get('amount')
    if not product_id or amount is None:
        return jsonify({'msg': 'Faltan campos obligatorios (product_id, amount)'}), 400
    try:
        amount = float(amount)
        if amount <= 0:
            return jsonify({'msg': 'El monto debe ser un número positivo'}), 400
    except Exception:
        return jsonify({'msg': 'El monto debe ser un número válido'}), 400
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'msg': 'Producto no encontrado'}), 404
    # Evitar que el usuario compre su propio producto
    trainer_profile = TrainerProfile.query.get(product.trainer_profile_id)
    if trainer_profile and trainer_profile.user_id == current_user.id:
        return jsonify({'msg': 'No puedes comprar tu propio producto'}), 403
    order = Order(
        user_id=current_user.id,
        product_id=product_id,
        amount=amount,
        status='pending',
        payment_id=None
    )
    db.session.add(order)
    db.session.commit()
    return jsonify(order.serialize()), 201


@api.route('/order/<int:order_id>', methods=['PUT'])
@token_required
def update_order(current_user, order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"msg": "Orden no encontrada"}), 404
    data = request.get_json()
    order.status = data.get('status', order.status)
    order.payment_id = data.get('payment_id', order.payment_id)
    db.session.commit()
    return jsonify(order.serialize()), 200


@api.route('/order/<int:order_id>', methods=['DELETE'])
@token_required
def delete_order(current_user, order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"msg": "Orden no encontrada"}), 404
    db.session.delete(order)
    db.session.commit()
    return jsonify({"msg": "Orden eliminada"}), 200


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# Registro de usuario o entrenador
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # 'user' o 'trainer'
    # Validaciones básicas
    if not email or not password or role not in ['user', 'trainer']:
        return jsonify({"msg": "Faltan campos obligatorios o rol inválido"}), 400
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"msg": "Email inválido"}), 400
    if len(password) < 6:
        return jsonify({"msg": "La contraseña debe tener al menos 6 caracteres"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El email ya está registrado"}), 400
    # Validaciones específicas para entrenadores
    if role == 'trainer':
        name = data.get('name')
        specialty = data.get('specialty')
        price_per_session = data.get('price_per_session')
        if not all([name, specialty, price_per_session]):
            return jsonify({"msg": "Faltan campos obligatorios para el perfil de entrenador (name, specialty, price_per_session)"}), 400
        try:
            price_per_session = float(price_per_session)
            if price_per_session <= 0:
                return jsonify({"msg": "El precio por sesión debe ser un número positivo"}), 400
        except Exception:
            return jsonify({"msg": "El precio por sesión debe ser un número válido"}), 400
    hashed_password = generate_password_hash(password)
    user = User(email=email, password=hashed_password,
                is_active=True, role=role)
    db.session.add(user)
    db.session.commit()
    # Si es entrenador, crear perfil
    if role == 'trainer':
        profile = TrainerProfile(user_id=user.id, name=data.get('name', ''), specialty=data.get('specialty', ''), description=data.get(
            'description', ''), price_per_session=float(data.get('price_per_session', 0.0)), is_active=True)
        db.session.add(profile)
        db.session.commit()
        user.trainer_profile_id = profile.id
        db.session.commit()
    return jsonify({"msg": "Registro exitoso", "user": user.serialize()}), 201


# Login de usuario o entrenador
@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        logger.warning(
            f"Intento de login sin email o password desde IP: {request.remote_addr}")
        return jsonify({"msg": "Faltan campos obligatorios"}), 400
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        logger.warning(
            f"Intento de login con email inválido: {email} desde IP: {request.remote_addr}")
        return jsonify({"msg": "Email inválido"}), 400
    if len(password) < 6:
        logger.warning(
            f"Intento de login con password corto para email: {email} desde IP: {request.remote_addr}")
        return jsonify({"msg": "La contraseña debe tener al menos 6 caracteres"}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        logger.warning(
            f"Login fallido para email: {email} desde IP: {request.remote_addr}")
        return jsonify({"msg": "Credenciales incorrectas"}), 401
    logger.info(
        f"Login exitoso para email: {email} desde IP: {request.remote_addr}")
    token = jwt.encode({
        'id': user.id,
        'role': user.role,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
    }, current_app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({"token": token, "user": user.serialize()}), 200


# --- CRUD USUARIOS ---
@api.route('/users', methods=['GET'])
# @token_required
def get_users():
    # Obtener todos los usuarios de la base de datos
    users = db.session.execute(db.select(User)).scalars().all()
    return jsonify([user.serialize() for user in users]), 200


@api.route('/user/<int:user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    if current_user.id != user_id:
        return jsonify({'msg': 'No tienes permiso para ver este usuario'}), 403
    return jsonify(current_user.serialize()), 200


@api.route('/user/<int:user_id>', methods=['PUT'])
@token_required
def update_user(current_user, user_id):
    if current_user.id != user_id:
        return jsonify({'msg': 'No tienes permiso para editar este usuario'}), 403
    data = request.get_json()
    current_user.email = data.get('email', current_user.email)
    if data.get('password'):
        current_user.password = generate_password_hash(data['password'])
    db.session.commit()
    return jsonify(current_user.serialize()), 200


@api.route('/user/<int:user_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, user_id):
    if current_user.id != user_id:
        return jsonify({'msg': 'No tienes permiso para eliminar este usuario'}), 403
    db.session.delete(current_user)
    db.session.commit()
    return jsonify({"msg": "Usuario eliminado"}), 200


# --- CRUD PERFILES DE ENTRENADOR ---
@api.route('/trainers', methods=['GET'])
@token_required
def get_trainers(current_user):
    if current_user.role != 'trainer':
        return jsonify({'msg': 'Solo los entrenadores pueden acceder a esta información'}), 403
    trainers = TrainerProfile.query.filter_by(user_id=current_user.id).all()
    return jsonify([t.serialize() for t in trainers]), 200


@api.route('/trainer/<int:trainer_id>', methods=['GET'])
@token_required
def get_trainer(current_user, trainer_id):
    trainer = TrainerProfile.query.get(trainer_id)
    if not trainer:
        return jsonify({"msg": "Entrenador no encontrado"}), 404
    if current_user.role != 'trainer' or trainer.user_id != current_user.id:
        return jsonify({'msg': 'No tienes permiso para ver este perfil'}), 403
    return jsonify(trainer.serialize()), 200


@api.route('/trainer/<int:trainer_id>', methods=['PUT'])
@token_required
def update_trainer(current_user, trainer_id):
    trainer = TrainerProfile.query.get(trainer_id)
    if not trainer:
        return jsonify({"msg": "Entrenador no encontrado"}), 404
    if current_user.role != 'trainer' or trainer.user_id != current_user.id:
        return jsonify({'msg': 'No tienes permiso para editar este perfil'}), 403
    data = request.get_json()
    trainer.name = data.get('name', trainer.name)
    trainer.specialty = data.get('specialty', trainer.specialty)
    trainer.description = data.get('description', trainer.description)
    trainer.price_per_session = data.get(
        'price_per_session', trainer.price_per_session)
    db.session.commit()
    return jsonify(trainer.serialize()), 200


@api.route('/trainer/<int:trainer_id>', methods=['DELETE'])
@token_required
def delete_trainer(current_user, trainer_id):
    trainer = TrainerProfile.query.get(trainer_id)
    if not trainer:
        return jsonify({"msg": "Entrenador no encontrado"}), 404
    if current_user.role != 'trainer' or trainer.user_id != current_user.id:
        return jsonify({'msg': 'No tienes permiso para eliminar este perfil'}), 403
    db.session.delete(trainer)
    db.session.commit()
    return jsonify({"msg": "Entrenador eliminado"}), 200


# --- CRUD PRODUCTOS (SERVICIOS DE ENTRENADOR) ---
@api.route('/products', methods=['GET'])
@token_required
def get_products(current_user):
    if current_user.role != 'trainer':
        return jsonify({'msg': 'Solo los entrenadores pueden ver sus productos'}), 403
    products = Product.query.filter_by(
        trainer_profile_id=current_user.trainer_profile_id).all()
    return jsonify([p.serialize() for p in products]), 200


@api.route('/product/<int:product_id>', methods=['GET'])
@token_required
def get_product(current_user, product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404
    if current_user.role != 'trainer' or product.trainer_profile_id != current_user.trainer_profile_id:
        return jsonify({'msg': 'No tienes permiso para ver este producto'}), 403
    return jsonify(product.serialize()), 200


@api.route('/product', methods=['POST'])
@token_required
def create_product(current_user):
    if current_user.role != 'trainer' or not current_user.trainer_profile_id:
        return jsonify({'msg': 'Solo entrenadores con perfil pueden crear productos'}), 403
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    price = data.get('price')
    if not title or price is None:
        return jsonify({'msg': 'Faltan campos obligatorios (title, price)'}), 400
    try:
        price = float(price)
        if price <= 0:
            return jsonify({'msg': 'El precio debe ser un número positivo'}), 400
    except Exception:
        return jsonify({'msg': 'El precio debe ser un número válido'}), 400
    product = Product(
        trainer_profile_id=current_user.trainer_profile_id,
        title=title,
        description=description,
        price=price,
        is_active=True
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.serialize()), 201


@api.route('/product/<int:product_id>', methods=['PUT'])
@token_required
def update_product(current_user, product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404
    if current_user.role != 'trainer' or product.trainer_profile_id != current_user.trainer_profile_id:
        return jsonify({'msg': 'No tienes permiso para editar este producto'}), 403
    data = request.get_json()
    product.title = data.get('title', product.title)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    db.session.commit()
    return jsonify(product.serialize()), 200


@api.route('/product/<int:product_id>', methods=['DELETE'])
@token_required
def delete_product(current_user, product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404
    if current_user.role != 'trainer' or product.trainer_profile_id != current_user.trainer_profile_id:
        return jsonify({'msg': 'No tienes permiso para eliminar este producto'}), 403
    db.session.delete(product)
    db.session.commit()
    return jsonify({"msg": "Producto eliminado"}), 200
