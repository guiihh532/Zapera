# backend/app/services/kestra_client.py
import httpx

KESTRA_BASE_URL = "https://seu-kestra/api"  # ajustar
KESTRA_API_KEY = "..."  # segredos via env var

async def start_flow(flow_namespace: str, flow_id: str, inputs: dict):
    url = f"{KESTRA_BASE_URL}/executions"
    payload = {
        "namespace": flow_namespace,
        "flowId": flow_id,
        "inputs": inputs,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=payload, headers={
            "Authorization": f"Bearer {KESTRA_API_KEY}"
        })
    resp.raise_for_status()
    return resp.json()
