# backend/kestra_client.py

import os
import httpx

# URL do Kestra – já está rodando em localhost:8080
KESTRA_URL = os.getenv("KESTRA_URL", "http://localhost:8080")
KESTRA_NAMESPACE = "prod.zapera"


async def executar_flow_whatsapp_start(data: dict) -> dict:
    """
    Executa o flow 'zapera_whatsapp_start' no Kestra,
    passando os dados como inputs.
    """
    url = f"{KESTRA_URL}/api/v1/namespaces/{KESTRA_NAMESPACE}/flows/zapera_whatsapp_start/executions"

    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.post(url, json={"inputs": data})

    if resp.status_code >= 300:
        raise RuntimeError(
            f"Erro ao chamar fluxo Kestra: {resp.status_code} - {resp.text}"
        )

    return resp.json()
