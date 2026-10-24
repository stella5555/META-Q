import streamlit as st
import numpy as np
import datetime
from quantum_logic import dig_tomb, run_radar_monte_carlo

st.set_page_config(page_title="Huaca Cuántica", layout="centered", page_icon="🏺")

st.title("🏺 La Huaca Cuántica (Q-Huaca)")
st.caption("Aprende Probabilidad, Monte Carlo y Superposición Cuántica explorando la huaca diaria.")

# Semilla fija diaria (tipo Wordle)
today_seed = int(datetime.date.today().strftime("%Y%m%d"))
np.random.seed(today_seed)

# Inicialización de estado
if "palas" not in st.session_state:
    st.session_state.palas = 3
    st.session_state.monedas = 30
    st.session_state.tesoros_encontrados = 0
    st.session_state.tumbas_abiertas = [False] * 9
    st.session_state.resultados = [None] * 9
    # Probabilidades ocultas de tesoro para 9 tumbas
    st.session_state.probabilidades = np.random.uniform(0.15, 0.85, 9).round(2)

# Métricas del juego
col_a, col_b, col_c = st.columns(3)
col_a.metric("⛏️ Palas restantes", st.session_state.palas)
col_b.metric("🪙 Monedas (Radar)", st.session_state.monedas)
col_c.metric("🏆 Tesoros hallados", st.session_state.tesoros_encontrados)

st.write("---")
st.subheader("Cuadrante de la Huaca (9 Tumbas)")

# Cuadrícula 3x3 de tumbas
for row in range(3):
    cols = st.columns(3)
    for col in range(3):
        idx = row * 3 + col
        with cols[col]:
            prob = st.session_state.probabilidades[idx]
            brillo = int(prob * 100)
            
            if st.session_state.tumbas_abiertas[idx]:
                if st.session_state.resultados[idx]:
                    st.success("💎 ¡Tesoro!")
                else:
                    st.error("🪨 Vacía")
            else:
                st.info(f"✨ Brillo: {brillo}%")
                
                # Botón de cavar (Medición del qubit)
                if st.button(f"Cavar #{idx+1}", key=f"dig_{idx}", disabled=st.session_state.palas <= 0):
                    encontrado = dig_tomb(prob)
                    st.session_state.tumbas_abiertas[idx] = True
                    st.session_state.resultados[idx] = encontrado
                    st.session_state.palas -= 1
                    if encontrado:
                        st.session_state.tesoros_encontrados += 1
                    st.rerun()
                
                # Botón de radar (Monte Carlo experimental)
                if st.button(f"📡 Radar (-10🪙)", key=f"radar_{idx}", disabled=st.session_state.monedas < 10):
                    positivos, total = run_radar_monte_carlo(prob, shots=10)
                    st.session_state.monedas -= 10
                    st.toast(f"Tumba #{idx+1}: {positivos}/{total} señales detectadas en Monte Carlo")
                    st.rerun()

st.write("---")
# Explicación pedagógica visible para el jurado
with st.expander("🎓 ¿Cómo funciona la ciencia detrás de este juego?"):
    st.markdown("""
    * **Brillo = Ángulo de Rotación ($\theta$):** Define la probabilidad teórica de encontrar el tesoro antes de cavar.
    * **Cavar = Medición Cuántica:** Mientras no cavas, el qubit está en superposición. Al cavar, el circuito colapsa a $|0\rangle$ (vacía) o $|1\rangle$ (tesoro).
    * **Radar = Simulación Monte Carlo:** Realiza muestreos repetidos rápidos para obtener una aproximación empírica de la probabilidad sin alterar el estado final.
    """)