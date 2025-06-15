const socket = io("https://clumsy-reliable-polish.glitch.me");

const generateLinkButton = document.getElementById("generate-link");
const chatLinkParagraph = document.getElementById("chat-link");
const chatSection = document.getElementById("chat-section");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");

let roomId = null;

// Generar enlace único
generateLinkButton.addEventListener("click", () => {
  roomId = crypto.randomUUID(); // Genera un identificador único
  const chatLink = `${window.location.origin}?room=${roomId}`;
  chatLinkParagraph.innerHTML = `Comparte este enlace: <a href="${chatLink}" target="_blank">${chatLink}</a>`;
  joinRoom(roomId);
});

// Unirse a un room
function joinRoom(room) {
  roomId = room;
  chatSection.style.display = "block";
  socket.emit("join", roomId);
}

// Enviar mensaje
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message) {
    socket.emit("message", { roomId, message });
    addMessage("Yo", message);
    messageInput.value = "";
  }
});

// Recibir mensajes
socket.on("message", (data) => {
  addMessage("Otro", data.message);
});

// Mostrar mensajes en el chat
function addMessage(user, message) {
  const messageElement = document.createElement("p");
  messageElement.innerHTML = `<strong>${user}:</strong> ${message}`;
  messagesDiv.appendChild(messageElement);
}

// Procesar parámetros de URL
const params = new URLSearchParams(window.location.search);
if (params.has("room")) {
  joinRoom(params.get("room"));
}
