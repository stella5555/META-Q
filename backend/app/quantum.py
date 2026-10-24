"""Motor cuántico de Quantum Huacas: cada tumba es un circuito de Qiskit."""
import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

sim = AerSimulator()


def angulo(p: float) -> float:
    """Mapeo clave: probabilidad clásica p -> ángulo de RY, porque P(1) = sin^2(theta/2)."""
    p = min(max(p, 0.0), 1.0)
    return float(2 * np.arcsin(np.sqrt(p)))


def tumba(p: float) -> QuantumCircuit:
    """Una tumba = 1 qubit girado con RY y medido."""
    qc = QuantumCircuit(1, 1)
    qc.ry(angulo(p), 0)
    qc.measure(0, 0)
    return qc


def tumbas_conectadas(p: float) -> QuantumCircuit:
    """Dos tumbas entrelazadas: RY + CNOT. Solo pueden salir '00' o '11'."""
    qc = QuantumCircuit(2, 2)
    qc.ry(angulo(p), 0)
    qc.cx(0, 1)
    qc.measure([0, 1], [0, 1])
    return qc


def ejecutar(qc: QuantumCircuit, shots: int) -> dict:
    return sim.run(qc, shots=shots).result().get_counts()


def excavar(p: float) -> dict:
    """Excavar = medir 1 vez (shots=1)."""
    counts = ejecutar(tumba(p), 1)
    return {"tesoro": counts.get("1", 0) == 1, "counts": counts, "theta": angulo(p)}


def radar(p: float, shots: int = 5) -> dict:
    """Radar = Monte Carlo: medir el mismo circuito N veces."""
    counts = ejecutar(tumba(p), shots)
    return {"counts": counts, "tesoros": counts.get("1", 0), "shots": shots, "theta": angulo(p)}


def excavar_conectada(p: float) -> dict:
    counts = ejecutar(tumbas_conectadas(p), 1)
    bits = next(iter(counts))
    return {"tesoro": bits == "11", "counts": counts, "theta": angulo(p)}
