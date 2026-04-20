from app.database import Base, SessionLocal, engine
from app.models.user import User
from app.utils.security import hash_password


DEFAULT_PASSWORD = "1234abcD"
DEFAULT_USERS = (
    {"name": "Admin", "email": "admin@gmail.com", "role": "admin"},
    {"name": "Teacher", "email": "teacher@gmail.com", "role": "teacher"},
)


def seed_users() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    created_emails: list[str] = []
    skipped_emails: list[str] = []

    try:
        for user_data in DEFAULT_USERS:
            email = user_data["email"].lower()
            existing_user = db.query(User).filter(User.email == email).first()

            if existing_user is not None:
                skipped_emails.append(email)
                continue

            db.add(
                User(
                    name=user_data["name"],
                    email=email,
                    password=hash_password(DEFAULT_PASSWORD),
                    role=user_data["role"],
                    is_active=True,
                )
            )
            created_emails.append(email)

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    print("Seed completed.")
    print(f"Created: {', '.join(created_emails) if created_emails else 'none'}")
    print(f"Skipped: {', '.join(skipped_emails) if skipped_emails else 'none'}")


if __name__ == "__main__":
    seed_users()
