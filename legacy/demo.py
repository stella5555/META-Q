import streamlit as st
import numpy as np
import datetime
import os
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

# Configuración inicial de la página
st.set_page_config(page_title="Quantum Huacas", layout="centered", page_icon="🏺")

# Inyección de CSS para estilo Cozy / Pixel Art (Paleta Oficial de la Hackathon)
st.markdown("""
<style>
    /* Fondo principal celeste pastel */
    .stApp { background-color: #D8E9F8; }
    
    /* Tipografía y color base */
    h1, h2, h3, p, span { color: #111827 !important; font-family: 'Poppins', sans-serif; }
    
    /* Tarjetas de tumbas flotantes */
    .tumba-card {
        background-color: #FFFFFF;
        border-radius: 16px;
        padding: 15px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        text-align: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 2px solid #B8A9E6;
        margin-bottom: 15px;
    }
    .tumba-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 20px rgba(0,0,0,0.15);
    }
    
    /* Botones principales estilo Rosa Chicle */
    .stButton>button {
        background-color: #FF69B4;
        color: white !important;
        border-radius: 12px;
        border: none;
        font-weight: bold;
        transition: background-color 0.3s;
        width: 100%;
    }
    .stButton>button:hover {
        background-color: #FF1493;
        border: none;
    }
    
    /* Cuadro de diálogo del personaje */
    .dialog-box {
        background-color: #FFFFFF;
        border-left: 6px solid #FF69B4;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-weight: 500;
    }
</style>
""", unsafe_allow_html=True)

# Simulador Cuántico
sim = AerSimulator()

def crear_circuito_tumba(p):
    theta = 2 * np.arcsin(np.sqrt(np.clip(p, 0.0, 1.0)))
    qc = QuantumCircuit(1, 1)
    qc.ry(theta, 0)
    qc.measure(0, 0)
    return qc

def excavar_qubit(p):
    qc = crear_circuito_tumba(p)
    return '1' in sim.run(qc, shots=1).result().get_counts()

def radar_monte_carlo(p, escaneos=10):
    qc = crear_circuito_tumba(p)
    return sim.run(qc, shots=escaneos).result().get_counts().get('1', 0), escaneos

def excavar_par_entrelazado(p):
    theta = 2 * np.arcsin(np.sqrt(np.clip(p, 0.0, 1.0)))
    qc = QuantumCircuit(2, 2)
    qc.ry(theta, 0)
    qc.cx(0, 1)
    qc.measure([0, 1], [0, 1])
    estado = list(sim.run(qc, shots=1).result().get_counts().keys())[0]
    return estado == '11', estado == '11'

# Inicialización de estado
np.random.seed(int(datetime.date.today().strftime("%Y%m%d")))

if "palas" not in st.session_state:
    st.session_state.palas = 3
    st.session_state.monedas = 30
    st.session_state.score = 0
    st.session_state.tumbas_abiertas = [False] * 9
    st.session_state.resultados = [None] * 9
    st.session_state.probabilidades = [0.90, 0.20, 0.60, 0.10, 0.75, 0.40, 0.30, 0.50, 0.85]
    st.session_state.entrelazadas = (0, 4)
    st.session_state.mensaje_inti = "¡Hola! Cada cofre esconde un qubit en superposición. ¡Usa tus palas y el radar cuántico con sabiduría!"

# Función para cargar imágenes con respaldo de emojis
def renderizar_imagen(nombre_archivo, emoji_fallback, width=100):
    ruta = os.path.join("assets", nombre_archivo)
    if os.path.exists(ruta):
        st.image(ruta, width=width, use_container_width=True)
    else:
        st.markdown(f"<div style='font-size: 50px;'>{emoji_fallback}</div>", unsafe_allow_html=True)

# Encabezado y Diálogo
col_logo, col_dialogo = st.columns([1, 4])
with col_logo:
    # AQUI CAMBIAMOS A .gif
    renderizar_imagen("personaje_normal.gif", "🐹", width=80)
with col_dialogo:
    st.markdown(f"<div class='dialog-box'>🗣️ {st.session_state.mensaje_inti}</div>", unsafe_allow_html=True)

# Marcadores
c1, c2, c3 = st.columns(3)
c1.metric("⛏️ Palas Restantes", st.session_state.palas)
c2.metric("🪙 Monedas (Radar)", st.session_state.monedas)
c3.metric("⭐ Puntaje", st.session_state.score)

st.write("---")

# Tablero Visual 3x3
for f in range(3):
    cols = st.columns(3)
    for c in range(3):
        i = f * 3 + c
        with cols[c]:
            prob = st.session_state.probabilidades[i]
            es_entrelazada = i in st.session_state.entrelazadas
            link_badge = "🔗" if es_entrelazada else ""
            
            # Contenedor visual de la tumba
            st.markdown(f"<div class='tumba-card'>", unsafe_allow_html=True)
            
            if st.session_state.tumbas_abiertas[i]:
                if st.session_state.resultados[i]:
                    # AQUI CAMBIAMOS A tesoro_abierto.jpg
                    renderizar_imagen("tesoro_abierto.jpg", "💎")
                    st.success("¡Tesoro!")
                else:
                    # AQUI CAMBIAMOS A tierra_vacia.jpg
                    renderizar_imagen("tierra_vacia.jpg", "🪨")
                    st.error("Vacía")
            else:
                # AQUI CAMBIAMOS A tesoro_cerrado.jpg
                renderizar_imagen("tesoro_cerrado.jpg", "🟫")
                st.markdown(f"**Tumba {i+1} {link_badge}**")
                st.progress(prob, text=f"Brillo: {int(prob*100)}%")
                
                c_btn1, c_btn2 = st.columns(2)
                with c_btn1:
                    if st.button("⛏️", key=f"exc_{i}", help="Excavar (Medición)", disabled=st.session_state.palas <= 0):
                        st.session_state.score += int(prob * 100)
                        if es_entrelazada:
                            t1, t2 = st.session_state.entrelazadas
                            h1, h2 = excavar_par_entrelazado(prob)
                            st.session_state.tumbas_abiertas[t1], st.session_state.tumbas_abiertas[t2] = True, True
                            st.session_state.resultados[t1], st.session_state.resultados[t2] = h1, h2
                            if h1: st.session_state.score += 40
                            st.session_state.mensaje_inti = "¡Increíble! Colapsaste un estado entrelazado. Ambas tumbas reaccionaron al instante."
                        else:
                            hallado = excavar_qubit(prob)
                            st.session_state.tumbas_abiertas[i] = True
                            st.session_state.resultados[i] = hallado
                            if hallado: st.session_state.score += 20
                            st.session_state.mensaje_inti = "¡Pum! Medición ejecutada. La superposición ha colapsado."
                        st.session_state.palas -= 1
                        st.rerun()
                
                with c_btn2:
                    if st.button("📡", key=f"rad_{i}", help="Radar (-2🪙)", disabled=st.session_state.monedas < 2):
                        h, t = radar_monte_carlo(prob, 10)
                        st.session_state.monedas -= 2
                        st.session_state.score = max(0, st.session_state.score - 2)
                        st.session_state.mensaje_inti = f"Radar completado (Monte Carlo): {h} señales en {t} escaneos rápidos."
                        st.rerun()
            
            st.markdown("</div>", unsafe_allow_html=True)