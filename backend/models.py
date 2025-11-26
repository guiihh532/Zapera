# backend/models.py

from sqlalchemy import Column, String, DateTime, text, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

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
    telefone_whatsapp = Column(String, nullable=True)  # legado, pode ficar por enquanto
    status_conta = Column(String, nullable=False, server_default="TRIAL_ATIVO")
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())

    # NOVO: relação com telefones
    telefones = relationship(
        "UsuarioTelefone",
        back_populates="usuario",
        cascade="all, delete-orphan",
    )


class UsuarioTelefone(Base):
    __tablename__ = "usuarios_telefones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(
        UUID(as_uuid=True),
        ForeignKey("usuarios.id", ondelete="CASCADE"),
        nullable=False,
    )
    nome = Column(String, nullable=False)         # ex: "Principal", "Suporte", "Pessoal"
    numero = Column(String, nullable=False)       # ex: "+55 45 99999-0000"
    is_principal = Column(Boolean, nullable=False, server_default=text("false"))
    data_criacao = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="telefones")
