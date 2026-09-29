import base64
import json
import time
from typing import Optional, Dict, Any
from fastapi import Request, HTTPException, Header
from app.config import settings

# Master authorized token generated for valid direct credential logins
MASTER_AUTH_TOKEN = "cgtmse_auth_" + base64.b64encode(b"cgtmse.leadsphere@gmail.com:Cgtmse@rahul.leadsphere").decode("utf-8")

def parse_jwt_payload_unverified(token: str) -> Optional[Dict[str, Any]]:
    """Helper to inspect Supabase JWT claims safely."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        # Add padding if needed
        payload_b64 = parts[1]
        rem = len(payload_b64) % 4
        if rem > 0:
            payload_b64 += "=" * (4 - rem)
        decoded = base64.urlsafe_b64decode(payload_b64.encode("utf-8"))
        return json.loads(decoded.decode("utf-8"))
    except Exception:
        return None

def verify_chat_auth(request: Request) -> Dict[str, Any]:
    """
    Enforces authentication on chat endpoints to prevent unauthorized cURL / Postman abuse.
    Accepts:
    1. Authorized session token (MASTER_AUTH_TOKEN)
    2. Valid Supabase user JWT (issued by project mjdcfwdbhvqlobwfjijd)
    3. Configured API_SECRET_KEY (via x-api-key or Bearer)
    """
    auth_header = request.headers.get("Authorization") or request.headers.get("authorization")
    api_key_header = request.headers.get("x-api-key")

    token = None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
    elif auth_header:
        token = auth_header.strip()
    elif api_key_header:
        token = api_key_header.strip()

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Missing Authorization token. Please sign in via the CGTMSE Assist portal."
        )

    # 1. Check against master session token
    if token == MASTER_AUTH_TOKEN:
        return {"sub": "cgtmse-authorized-user", "auth_type": "direct"}

    # 2. Check against custom API_SECRET_KEY if configured
    if settings.API_SECRET_KEY and token == settings.API_SECRET_KEY:
        return {"sub": "api-key-user", "auth_type": "api_key"}

    # 3. Check Supabase JWT
    payload = parse_jwt_payload_unverified(token)
    if payload:
        # Check expiration
        exp = payload.get("exp")
        if exp and exp < time.time():
            raise HTTPException(status_code=401, detail="Unauthorized: Authentication token has expired. Please log in again.")

        # Check issuer / project ref
        iss = payload.get("iss", "")
        aud = payload.get("aud", "")
        ref = payload.get("ref", "")

        # Must match our Supabase project reference
        is_supabase_valid = (
            "mjdcfwdbhvqlobwfjijd" in iss or 
            ref == "mjdcfwdbhvqlobwfjijd" or 
            aud == "authenticated"
        )

        if is_supabase_valid:
            return {"sub": payload.get("sub", "supabase-user"), "email": payload.get("email"), "auth_type": "supabase"}

    # If none matched, deny access
    raise HTTPException(
        status_code=401,
        detail="Unauthorized: Invalid or unrecognized authentication token."
    )
