# backend/models.py

from sqlalchemy import Column, String, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )
    nome = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    senha_hash = Column(String, nullable=False)
    telefone_whatsapp = Column(String, nullable=True)
    status_conta = Column(String, nullable=False, server_default="TRIAL_ATIVO")
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())
