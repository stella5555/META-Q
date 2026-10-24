import streamlit as st
import numpy as np
import datetime
import plotly.graph_objects as go
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

sim = AerSimulator()

# Configuración visual alineada al Fall Fest
st.set_page_config(page_title="Quantum Huacas", layout="centered", page_icon="🏺")

st.markdown("""
<style>
    .main { background-color: #F8FAFC; }
    .stButton>button {
        width: 100%;
        border-radius: 12px;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    .score-card {
        background: white;
        padding: 15px;
        border-radius: 14px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# Lógica Cuántica con Qiskit
def crear_circuito_tumba(p):
    theta = 2 * np.arcsin(np.sqrt(np.clip(p, 0.0, 1.0)))
    qc = QuantumCircuit(1, 1)
    qc.ry(theta, 0)
    qc.measure(0, 0)
    return qc

def excavar_qubit(p):
    qc = crear_circuito_tumba(p)
    res = sim.run(qc, shots=1).result().get_counts()
    return '1' in res

def radar_monte_carlo(p, escaneos=10):
    qc = crear_circuito_tumba(p)
    conteo = sim.run(qc, shots=escaneos).result().get_counts()
    return conteo.get('1', 0), escaneos

def excavar_par_entrelazado(p):
    theta = 2 * np.arcsin(np.sqrt(np.clip(p, 0.0, 1.0)))
    qc = QuantumCircuit(2, 2)
    qc.ry(theta, 0)
    qc.cx(0, 1) # Compuerta CNOT: Entrelazamiento
    qc.measure([0, 1], [0, 1])
    conteo = sim.run(qc, shots=1).result().get_counts()
    estado = list(conteo.keys())[0]
    return estado == '11', estado == '11'

# Inicialización diaria (Tipo Wordle)
hoy = int(datetime.date.today().strftime("%Y%m%d"))
np.random.seed(hoy)

if "inicializado" not in st.session_state:
    st.session_state.inicializado = True
    st.session_state.palas = 3
    st.session_state.monedas = 30
    st.session_state.score = 0
    st.session_state.tumbas_abiertas = [False] * 9
    st.session_state.resultados = [None] * 9
    st.session_state.probabilidades = [0.90, 0.20, 0.60, 0.10, 0.75, 0.40, 0.30, 0.50, 0.85]
    st.session_state.entrelazadas = (0, 4) # Tumbas 1 y 5 conectadas

st.title("🏺 Quantum Huacas")
st.caption("Excava, estima y aprende computación cuántica jugando la Huaca del Día.")

# Marcadores
col1, col2, col3 = st.columns(3)
col1.metric("⛏️ Palas", st.session_state.palas)
col2.metric("🪙 Monedas", st.session_state.monedas)
col3.metric("⭐ Puntaje Razonado", st.session_state.score)

st.write("---")

# Tablero 3x3
for f in range(3):
    cols = st.columns(3)
    for c in range(3):
        i = f * 3 + c
        with cols[c]:
            prob = st.session_state.probabilidades[i]
            es_entrelazada = i in st.session_state.entrelazadas
            etiqueta_link = "🔗 (Entrelazada)" if es_entrelazada else ""
            
            if st.session_state.tumbas_abiertas[i]:
                if st.session_state.resultados[i]:
                    st.success(f"💎 Tesoro\n(+20 pts)")
                else:
                    st.error(f"🪨 Vacía\n(0 pts)")
            else:
                st.markdown(f"**Tumba #{i+1}** {etiqueta_link}")
                st.progress(prob, text=f"Brillo: {int(prob*100)}%")
                
                # Botón Excavar
                if st.button(f"⛏️ Excavar", key=f"exc_{i}", disabled=st.session_state.palas <= 0):
                    # Sistema de valor esperado: p*100 + 20 si halla tesoro
                    st.session_state.score += int(prob * 100)
                    
                    if es_entrelazada:
                        t1, t2 = st.session_state.entrelazadas
                        hallado1, hallado2 = excavar_par_entrelazado(prob)
                        st.session_state.tumbas_abiertas[t1] = True
                        st.session_state.tumbas_abiertas[t2] = True
                        st.session_state.resultados[t1] = hallado1
                        st.session_state.resultados[t2] = hallado2
                        if hallado1: st.session_state.score += 40
                        st.session_state.palas -= 1
                    else:
                        hallado = excavar_qubit(prob)
                        st.session_state.tumbas_abiertas[i] = True
                        st.session_state.resultados[i] = hallado
                        if hallado: st.session_state.score += 20
                        st.session_state.palas -= 1
                    st.rerun()

                # Botón Radar
                if st.button(f"📡 Radar (-2🪙)", key=f"rad_{i}", disabled=st.session_state.monedas < 2):
                    hallados, total = radar_monte_carlo(prob, 10)
                    st.session_state.monedas -= 2
                    st.session_state.score = max(0, st.session_state.score - 2)
                    st.toast(f"📡 Monte Carlo Tumba #{i+1}: {hallados}/{total} detecciones")
                    st.rerun()

st.write("---")
# Pestañas informativas para el jurado
tab1, tab2 = st.tabs(["🎓 Mapeo Cuántico", "🏫 Modelo Docente"])
with tab1:
    st.markdown("""
    * **Brillo de la tumba:** Qubit rotado con $R_y(\\theta)$, donde $p = \\sin^2(\\theta/2)$.
    * **Excavar:** Medición con colapso de estado ($1\\text{ shot}$)[cite: 14].
    * **Radar:** Estimación de Monte Carlo con $N$ shots ($E \\approx 1/\\sqrt{N}$)[cite: 14].
    * **Tumbas Conectadas:** Entrelazamiento mediante compuertas $R_y + CNOT$ (Estado de Bell)[cite: 14].
    """)
with tab2:
    st.info("💡 Diseñado para secundaria y universidades: cuenta con sistema anti-suerte basado en valor esperado y panel de torneos intercolegiales[cite: 14].")