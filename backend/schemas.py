from pydantic import BaseModel, EmailStr, ConfigDict, constr
from typing import Optional
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

class UsuarioOut(UsuarioBase):
    id: UUID
    telefone_whatsapp: Optional[str] = None
    status_conta: str
    data_criacao: datetime

    model_config = ConfigDict(from_attributes=True)

class UsuarioUpdateTelefone(BaseModel):
    telefone_whatsapp: str
