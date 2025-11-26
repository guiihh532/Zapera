from pydantic import BaseModel, EmailStr, ConfigDict, constr
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr


class UsuarioCreate(UsuarioBase):
    senha: constr(min_length=8, max_length=200)


class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: constr(min_length=8, max_length=200)


# NOVOS SCHEMAS PARA TELEFONE

class UsuarioTelefoneBase(BaseModel):
    nome: str
    numero: str
    is_principal: bool = False


class UsuarioTelefoneCreate(UsuarioTelefoneBase):
    pass


class UsuarioTelefoneUpdate(BaseModel):
    nome: Optional[str] = None
    numero: Optional[str] = None
    is_principal: Optional[bool] = None


class UsuarioTelefoneOut(UsuarioTelefoneBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class UsuarioOut(UsuarioBase):
    id: UUID
    telefone_whatsapp: Optional[str] = None
    status_conta: str
    data_criacao: datetime

    # NOVO: lista de telefones vinculados
    telefones: List[UsuarioTelefoneOut] = []

    model_config = ConfigDict(from_attributes=True)


class UsuarioUpdateTelefone(BaseModel):
    telefone_whatsapp: str
