from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # Tipo de usuario: 'user' o 'trainer'
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="user")
    # Relación con perfil de entrenador (si aplica)
    trainer_profile_id: Mapped[int] = mapped_column(nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "role": self.role,
            "trainer_profile_id": self.trainer_profile_id,
            # do not serialize the password, its a security breach
        }


# Perfil de entrenador (más detalles que User)
class TrainerProfile(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    specialty: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    price_per_session: Mapped[float] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "specialty": self.specialty,
            "description": self.description,
            "price_per_session": self.price_per_session,
            "is_active": self.is_active
        }


# Producto: en este caso, un "producto" es un entrenador (servicio)
class Product(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    trainer_profile_id: Mapped[int] = mapped_column(nullable=False)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)
    price: Mapped[float] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "trainer_profile_id": self.trainer_profile_id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "is_active": self.is_active
        }


# Orden de compra (reserva de sesión o compra de "producto")
class Order(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(nullable=False)
    product_id: Mapped[int] = mapped_column(nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="pending")
    payment_id: Mapped[str] = mapped_column(
        String(120), nullable=True)  # Para Stripe

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "amount": self.amount,
            "status": self.status,
            "payment_id": self.payment_id
        }
