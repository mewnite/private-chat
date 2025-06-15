const socket = io("https://elite-tinted-radius.glitch.me", {
  transports: ["polling", "websocket"], // Permite múltiples transportes
});

console.log("Transporte usado:", socket.io.engine.transport.name);

// Elementos del DOM
const chat = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const roomInput = document.getElementById("roomInput");
const joinBtn = document.getElementById("joinBtn");

let currentRoom = null;

// Agregar mensajes al chat
function addMessage(msg) {
  const p = document.createElement("p");
  p.textContent = msg;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight; // Desplazar al final del chat
}

// Unirse a una sala
joinBtn.onclick = () => {
  const room = roomInput.value.trim();
  if (!room) {
    alert("Por favor poné un nombre para la sala");
    return;
  }
  currentRoom = room;

  // Eliminar listeners duplicados
  socket.off("message");

  // Suscribirse al evento de mensajes solo una vez
  socket.on("message", ({ message, from }) => {
    if (from === socket.id) {
      addMessage(`Yo: ${message}`);
    } else {
      addMessage(`Alguien (${from}): ${message}`);
    }
  });

  // Unirse a la sala
  socket.emit("joinRoom", room);
  addMessage(`Te uniste a la sala "${room}"`);
  messageInput.disabled = false;
  sendBtn.disabled = false;
  joinBtn.disabled = true;
  roomInput.disabled = true;
};

// Enviar mensajes
sendBtn.onclick = () => {
  const msg = messageInput.value.trim();
  if (!msg || !currentRoom) return;

  // Emitir mensaje al servidor
  socket.emit("message", { room: currentRoom, message: msg });

  // No agregar mensaje localmente, el servidor se encargará de retornarlo
  messageInput.value = "";
  messageInput.focus();
};

// Listeners para conexión/desconexión
socket.on("connect", () => {
  console.log("Conectado al servidor con ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Error al conectar:", error);
});

socket.on("disconnect", () => {
  console.warn("Desconectado del servidor");
});
