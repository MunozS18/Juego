# Juego romántico — Para ella

Proyecto pequeño y auto-contenido. Diseñado para abrir en el navegador y regalar un momento romántico.

Cómo usar

- Abre `index.html` en tu navegador (doble clic) para ejecutar localmente.
- O sirve la carpeta con un servidor estático (recomendado) usando Python desde PowerShell:

```powershell
cd "C:\Users\munoz\OneDrive\Documentos\Aplicaciones\para mi novia\Juego"; python -m http.server 8000
```

Luego abre `http://localhost:8000`.

Qué incluye

- `index.html`: UI y estructura (inicio, juego, final).
- `styles.css`: estilos y animaciones CSS (corazones flotantes, transiciones).
- `script.js`: lógica del minijuego (atrapa corazones), temporizador, mensajes personalizados y confetti.

Personalización

- Cambia los textos en `script.js` (array `compliments`) para adaptar mensajes más personales.
- Puedes reemplazar los SVG por imágenes tuyas o añadir música (archivo mp3) y reproducirla en `startGame()`.

Siguientes pasos opcionales

- Añadir música romántica de fondo.
- Añadir fotos personalizadas o cartas en la escena final.
- Subir a GitHub Pages o empaquetar como Electron para un ejecutable.

Disfruta y díselo con cariño.
