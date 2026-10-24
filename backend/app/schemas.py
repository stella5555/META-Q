"""Modelos de entrada de la API."""
from pydantic import BaseModel, Field


class QubitRequest(BaseModel):
    p: float = Field(ge=0, le=1, description="Probabilidad de medir 1")
    shots: int = Field(default=5, ge=1, le=100, description="Número de mediciones")
