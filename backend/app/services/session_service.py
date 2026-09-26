import time
from typing import Dict, List, Any

class SessionManager:
    """
    Manages in-memory multi-turn conversational history keyed by sessionId.
    Keeps a sliding window of recent messages for context.
    """
    def __init__(self, max_history: int = 10, ttl_seconds: int = 86400):
        self.sessions: Dict[str, Dict[str, Any]] = {}
        self.max_history = max_history
        self.ttl_seconds = ttl_seconds

    def add_message(self, session_id: str, role: str, content: str):
        if not session_id:
            return

        now = time.time()
        self._cleanup(now)

        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "messages": [],
                "last_active": now
            }

        session = self.sessions[session_id]
        session["last_active"] = now
        session["messages"].append({"role": role, "content": content})

        # Trim to sliding window
        if len(session["messages"]) > self.max_history * 2:
            session["messages"] = session["messages"][-self.max_history * 2:]

    def get_history(self, session_id: str) -> List[Dict[str, str]]:
        if not session_id or session_id not in self.sessions:
            return []

        session = self.sessions[session_id]
        session["last_active"] = time.time()
        return session["messages"]

    def _cleanup(self, now: float):
        # Prune expired sessions
        expired_keys = [
            k for k, v in self.sessions.items()
            if now - v["last_active"] > self.ttl_seconds
        ]
        for k in expired_keys:
            del self.sessions[k]

session_manager = SessionManager()
