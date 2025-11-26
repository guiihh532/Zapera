# backend/database.py

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# carrega variáveis do arquivo .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada no .env")

# cria o engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# cria fábrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# base para os modelos
Base = declarative_base()


# dependência do FastAPI: receber uma sessão de banco em cada request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
