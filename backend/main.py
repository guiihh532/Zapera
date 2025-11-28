# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from typing import List as ListType
from kestra_client import executar_flow_whatsapp_start
import os

from database import Base, engine, get_db
import models
import schemas

WHATSAPP_API_VERSION = os.getenv("WHATSAPP_API_VERSION", "v22.0")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN", "")

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


# -------- TELEFONES VINCULADOS --------

@app.get(
    "/usuarios/{usuario_id}/telefones",
    response_model=ListType[schemas.UsuarioTelefoneOut],
)
def listar_telefones(usuario_id: str, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    return usuario.telefones


@app.post(
    "/usuarios/{usuario_id}/telefones",
    response_model=schemas.UsuarioTelefoneOut,
    status_code=status.HTTP_201_CREATED,
)
def criar_telefone(
    usuario_id: str,
    telefone_in: schemas.UsuarioTelefoneCreate,
    db: Session = Depends(get_db),
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # se for o primeiro telefone, pode forçar como principal
    if len(usuario.telefones) == 0:
        telefone_in.is_principal = True

    # se marcou como principal, desmarca todos os outros
    if telefone_in.is_principal:
        for t in usuario.telefones:
            t.is_principal = False

    telefone = models.UsuarioTelefone(
        usuario_id=usuario.id,
        nome=telefone_in.nome,
        numero=telefone_in.numero,
        is_principal=telefone_in.is_principal,
    )

    db.add(telefone)
    db.commit()
    db.refresh(telefone)

    # opcional: sincronizar campo legado
    if telefone.is_principal:
        usuario.telefone_whatsapp = telefone.numero
        db.add(usuario)
        db.commit()

    return telefone


@app.patch(
    "/usuarios/{usuario_id}/telefones/{telefone_id}",
    response_model=schemas.UsuarioTelefoneOut,
)
def atualizar_telefone_multi(
    usuario_id: str,
    telefone_id: int,
    telefone_update: schemas.UsuarioTelefoneUpdate,
    db: Session = Depends(get_db),
):
    telefone = (
        db.query(models.UsuarioTelefone)
        .filter(
            models.UsuarioTelefone.id == telefone_id,
            models.UsuarioTelefone.usuario_id == usuario_id,
        )
        .first()
    )
    if not telefone:
        raise HTTPException(status_code=404, detail="Telefone não encontrado.")

    if telefone_update.nome is not None:
        telefone.nome = telefone_update.nome
    if telefone_update.numero is not None:
        telefone.numero = telefone_update.numero

    if telefone_update.is_principal is not None:
        if telefone_update.is_principal:
            # desmarca outros
            outros = (
                db.query(models.UsuarioTelefone)
                .filter(
                    models.UsuarioTelefone.usuario_id == usuario_id,
                    models.UsuarioTelefone.id != telefone_id,
                )
                .all()
            )
            for t in outros:
                t.is_principal = False
            telefone.is_principal = True
        else:
            telefone.is_principal = False

    db.add(telefone)
    db.commit()
    db.refresh(telefone)

    # opcional: sincronizar campo legado
    if telefone.is_principal:
        usuario = (
            db.query(models.Usuario)
            .filter(models.Usuario.id == usuario_id)
            .first()
        )
        if usuario:
            usuario.telefone_whatsapp = telefone.numero
            db.add(usuario)
            db.commit()

    return telefone


@app.delete(
    "/usuarios/{usuario_id}/telefones/{telefone_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remover_telefone(
    usuario_id: str,
    telefone_id: int,
    db: Session = Depends(get_db),
):
    telefone = (
        db.query(models.UsuarioTelefone)
        .filter(
            models.UsuarioTelefone.id == telefone_id,
            models.UsuarioTelefone.usuario_id == usuario_id,
        )
        .first()
    )
    if not telefone:
        raise HTTPException(status_code=404, detail="Telefone não encontrado.")

    db.delete(telefone)
    db.commit()
    return

@app.post("/whatsapp/start")
async def iniciar_whatsapp(
    payload: schemas.WhatsAppStartRequest,
    db: Session = Depends(get_db),
):
    """
    Inicia o contato do bot com o usuário via WhatsApp,
    chamando o flow do Kestra.
    """

    # 1) Validar configs mínimas do WhatsApp
    if not WHATSAPP_API_VERSION or not WHATSAPP_PHONE_NUMBER_ID or not WHATSAPP_TOKEN:
        raise HTTPException(
            status_code=500,
            detail="Configurações do WhatsApp não definidas no servidor.",
        )

    # 2) Buscar usuário
    usuario = (
        db.query(models.Usuario)
        .filter(models.Usuario.id == payload.usuario_id)
        .first()
    )
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # 3) Descobrir qual telefone usar
    numero_raw = None

    if payload.telefone_id is not None:
        telefone = (
            db.query(models.UsuarioTelefone)
            .filter(
                models.UsuarioTelefone.id == payload.telefone_id,
                models.UsuarioTelefone.usuario_id == usuario.id,
            )
            .first()
        )
        if not telefone:
            raise HTTPException(status_code=404, detail="Telefone não encontrado.")
        numero_raw = telefone.numero
    else:
        telefone_principal = (
            db.query(models.UsuarioTelefone)
            .filter(
                models.UsuarioTelefone.usuario_id == usuario.id,
                models.UsuarioTelefone.is_principal == True,
            )
            .first()
        )
        if telefone_principal:
            numero_raw = telefone_principal.numero

    if not numero_raw:
        raise HTTPException(
            status_code=400,
            detail="Nenhum telefone configurado para este usuário.",
        )

    # 4) Normalizar número – só dígitos (ideal é você já salvar como 55DDDNUMBER)
    numero = "".join(filter(str.isdigit, numero_raw))

    # 5) Montar inputs para o flow do Kestra
    data_inputs = {
        "usuario_id": str(usuario.id),
        "telefone_id": str(payload.telefone_id) if payload.telefone_id else "",
        "nome_usuario": usuario.nome,
        "numero": numero,
        "whatsapp_api_version": WHATSAPP_API_VERSION,
        "whatsapp_phone_number_id": WHATSAPP_PHONE_NUMBER_ID,
        "whatsapp_token": WHATSAPP_TOKEN,
    }

    # 6) Chamar o Kestra
    try:
        execution = await executar_flow_whatsapp_start(data_inputs)
    except Exception as e:
        print("Erro ao chamar fluxo Kestra:", e)
        raise HTTPException(
            status_code=502,
            detail=f"Erro ao chamar fluxo Kestra: {str(e)}",
        )

    return {
        "message": "Ativação enviada ao Kestra com sucesso.",
        "execution_id": execution.get("id"),
    }
