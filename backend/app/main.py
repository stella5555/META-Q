"""API de META-Q (FastAPI): expone el motor cuántico y sirve el frontend."""
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import quantum
from .schemas import QubitRequest

FRONTEND = Path(__file__).resolve().parents[2] / "frontend"

app = FastAPI(title="META-Q · Laboratorio Q")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/api/salud")
def salud():
    return {"ok": True, "motor": "qiskit-aer"}


@app.post("/api/medir")
def medir(req: QubitRequest):
    """Medir un qubit una vez (shots=1)."""
    return quantum.excavar(req.p)


@app.post("/api/escanear")
def escanear(req: QubitRequest):
    """Medir el mismo circuito N veces: Monte Carlo."""
    return quantum.radar(req.p, req.shots)


@app.post("/api/entrelazados")
def entrelazados(req: QubitRequest):
    """Medir dos qubits entrelazados (RY + CNOT)."""
    return quantum.excavar_conectada(req.p)


app.mount("/", StaticFiles(directory=FRONTEND, html=True), name="frontend")
