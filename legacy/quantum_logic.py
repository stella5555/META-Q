import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

simulator = AerSimulator()

def create_tomb_circuit(probability):
    """
    Crea un circuito de 1 qubit donde el estado |1> representa encontrar el tesoro.
    Se usa una rotación Ry con un ángulo theta calculado según la probabilidad deseada.
    """
    qc = QuantumCircuit(1, 1)
    # P(|1>) = sin^2(theta / 2) -> theta = 2 * arcsin(sqrt(prob))
    theta = 2 * np.arcsin(np.sqrt(np.clip(probability, 0.0, 1.0)))
    qc.ry(theta, 0)
    qc.measure(0, 0)
    return qc

def dig_tomb(probability):
    """
    Simula cavar en la tumba: ejecuta una medición (1 shot) colapsando la superposición.
    Retorna True si hay tesoro (|1>), False si está vacía (|0>).
    """
    qc = create_tomb_circuit(probability)
    result = simulator.run(qc, shots=1).result()
    counts = result.get_counts()
    return counts.get('1', 0) == 1

def run_radar_monte_carlo(probability, shots=10):
    """
    Simula el radar: corre 'shots' simulaciones de Monte Carlo sin cavar,
    permitiendo al usuario estimar la probabilidad empírica.
    """
    qc = create_tomb_circuit(probability)
    result = simulator.run(qc, shots=shots).result()
    counts = result.get_counts()
    positives = counts.get('1', 0)
    return positives, shots

def dig_entangled_tombs():
    """
    Crea un estado de Bell (|00> + |11>) / sqrt(2) para dos tumbas entrelazadas.
    Ambas tendrán tesoro o ambas estarán vacías simultáneamente.
    """
    qc = QuantumCircuit(2, 2)
    qc.h(0)
    qc.cx(0, 1)
    qc.measure([0, 1], [0, 1])
    result = simulator.run(qc, shots=1).result()
    counts = result.get_counts()
    measured = list(counts.keys())[0] # '00' o '11'
    return measured == '11', measured == '11'