const socket = io("https://clumsy-reliable-polish.glitch.me", {
  transports: ["polling", "websocket"]
});

// Elementos del DOM
const chat = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const roomInput = document.getElementById("roomInput");
const joinBtn = document.getElementById("joinBtn");

let currentRoom = null;

// Mostrar mensaje en el chat
function addMessage(msg) {
  const p = document.createElement("p");
  p.textContent = msg;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
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

  socket.emit("joinRoom", room);
  addMessage(`Te uniste a la sala "${room}"`);

  messageInput.disabled = false;
  sendBtn.disabled = false;
  joinBtn.disabled = true;
  roomInput.disabled = true;
};

// Enviar mensaje
sendBtn.onclick = () => {
  const msg = messageInput.value.trim();
  if (!msg || !currentRoom) return;

  socket.emit("message", { room: currentRoom, message: msg });
  messageInput.value = "";
  messageInput.focus();
};

// Escuchar mensajes del servidor (solo una vez)
if (!window._messageListenerAdded) {
  socket.on("message", ({ message, from }) => {
    if (from === socket.id) {
      addMessage(`Yo: ${message}`);
    } else {
      addMessage(`Alguien (${from}): ${message}`);
    }
  });
  window._messageListenerAdded = true;
}

// Eventos de conexión/desconexión
socket.on("connect", () => {
  console.log("Conectado al servidor con ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("Error al conectar:", error);
});

socket.on("disconnect", () => {
  console.warn("Desconectado del servidor");
});
