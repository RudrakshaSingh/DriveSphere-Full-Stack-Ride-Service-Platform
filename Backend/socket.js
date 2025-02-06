const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

let io;

function initializeSocket(server) {
	console.log("socket1");

	io = socketIo(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log(`Client connected: ${socket.id}`);

		socket.on("join", async (data) => {
			console.log("socket2");

			const { userId, userType } = data;

			if (userType === "user") {
				await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
			} else if (userType === "captain") {
				await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
			}
		});

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`);
		});
	});
}

function sendMessageToSocketId(socketId, message) {
	if (io) {
		console.log("socket3");

		io.to(socketId).emit("message", message);
	} else {
		console.log("Socket.io not initialized.");
	}
}

module.exports = { initializeSocket, sendMessageToSocketId };
