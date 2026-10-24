# META-Q · Laboratorio Q

Juego educativo (EdTech) donde el estudiante es practicante en un laboratorio cuántico. Enseña distribuciones de probabilidad, Monte Carlo y entrelazamiento con su equivalente cuántico. Cada qubit del juego es un circuito real de Qiskit.

IBM Quantum Hackathon 2026 · Qiskit Fall Fest Perú · Reto EdTech.

## Estructura

```
META-Q/
├── backend/
│   ├── app/
│   │   ├── main.py        # API FastAPI + sirve el frontend
│   │   ├── quantum.py     # Motor cuántico (Qiskit + Aer)
│   │   └── schemas.py     # Modelos de entrada
│   └── requirements.txt
├── frontend/
│   ├── index.html         # Pantallas del juego
│   ├── css/styles.css     # Estilo pixel art
│   ├── js/game.js         # Lógica del juego y llamadas a la API
│   └── assets/            # Imágenes y sprites
├── docs/                  # PPT, documento y capturas
├── legacy/                # Primera versión en Streamlit
├── requirements.txt       # Usado por Render
└── render.yaml            # Despliegue
```

## Correr en local

```bash
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Abrir http://localhost:8000

## API

| Endpoint | Qué hace en Qiskit |
|---|---|
| `POST /api/medir` `{"p":0.9}` | RY(θ) + medición, shots=1 |
| `POST /api/escanear` `{"p":0.7,"shots":5}` | Mismo circuito, shots=N (Monte Carlo) |
| `POST /api/entrelazados` `{"p":0.5}` | RY + CNOT en 2 qubits |

## Mapeo clásico - cuántico

| Estadística | Computación cuántica |
|---|---|
| Distribución de Bernoulli (p) | `ry(2*arcsin(sqrt(p)))` |
| Muestreo | Medición (shots=1) |
| Monte Carlo | Medición repetida (shots=N) |
| Eventos correlacionados | Entrelazamiento (`cx`) |

## Despliegue

Render: conectar el repo; usa `render.yaml` (start: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`).

## Limitaciones

Corre en simulador Aer. Niveles 4 y 5, modo clase y ranking en línea están diseñados, no implementados; el ranking usa datos de ejemplo.
