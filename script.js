const socket = io("https://your-replit-backend.repl.co");
let username = prompt("Enter your name:");
socket.emit('new-user', username);

const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");
const userList = document.getElementById("userList");
const fileInput = document.getElementById("fileInput");

function sendMessage() {
  const msg = messageInput.value;
  if (msg.trim() !== "") {
    socket.emit('chat-message', { name: username, message: msg });
    messageInput.value = "";
  }
}

socket.on('chat-message', data => {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${data.name}</strong>: ${data.message}`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('user-list', users => {
  userList.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user.name;
    userList.appendChild(li);
  });
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  fetch("https://your-replit-backend.repl.co/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    socket.emit("file-message", {
      name: username,
      file: data.file,
      original: data.original
    });
  });
});

socket.on("file-message", data => {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${data.name}</strong>: 
    <a href="${data.file}" target="_blank">📎 ${data.original}</a>`;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});