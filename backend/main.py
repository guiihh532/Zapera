# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine, get_db
import models
import schemas

app = FastAPI(title="Zapera Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ajuste conforme necessário para segurança
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# cria as tabelas se ainda não existirem
Base.metadata.create_all(bind=engine)

# troca de bcrypt para pbkdf2_sha256
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    if password is None:
        raise ValueError("Senha não pode ser vazia")
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if plain_password is None:
        return False
    return pwd_context.verify(plain_password, hashed_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if plain_password is None:
        return False
    plain_password = plain_password[:72]  # mesmo corte na hora de verificar
    return pwd_context.verify(plain_password, hashed_password)


@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Zapera backend rodando!"}

@app.post("/usuarios", response_model=schemas.UsuarioOut, status_code=status.HTTP_201_CREATED)
def criar_usuario(usuario_in: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    existente = db.query(models.Usuario).filter(models.Usuario.email == usuario_in.email).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe um usuário com esse e-mail."
        )

    # proteção extra, caso algo passe da validação
    if len(usuario_in.senha) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Senha muito longa. Use no máximo 72 caracteres."
        )

    usuario = models.Usuario(
        nome=usuario_in.nome,
        email=usuario_in.email,
        senha_hash=hash_password(usuario_in.senha),
        status_conta="TRIAL_ATIVO",
    )

    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return usuario

@app.get("/usuarios/{usuario_id}", response_model=schemas.UsuarioOut)
def obter_usuario(usuario_id: str, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return usuario


@app.patch("/usuarios/{usuario_id}/telefone", response_model=schemas.UsuarioOut)
def atualizar_telefone(
    usuario_id: str,
    payload: schemas.UsuarioUpdateTelefone,
    db: Session = Depends(get_db),
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    usuario.telefone_whatsapp = payload.telefone_whatsapp
    db.add(usuario)
    db.commit()
    db.refresh(usuario)

    return usuario


@app.post("/login")
def login(usuario_login: schemas.UsuarioLogin, db: Session = Depends(get_db)):
    usuario = (
        db.query(models.Usuario)
        .filter(models.Usuario.email == usuario_login.email)
        .first()
    )
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas (usuário não encontrado).",
        )

    if not verify_password(usuario_login.senha, usuario.senha_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas (senha incorreta).",
        )

    return {
        "message": "Login realizado com sucesso.",
        "usuario_id": str(usuario.id),
        "status_conta": usuario.status_conta,
    }
