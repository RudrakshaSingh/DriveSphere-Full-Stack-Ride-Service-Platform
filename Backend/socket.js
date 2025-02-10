const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");
const messageModel = require('./models/message.model');

let io;

function initializeSocket(server) {
	io = socketIo(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log(`Client connected: ${socket.id}`);

		socket.on("join", async (data) => {
			const { userId, userType } = data;
			console.log("userid", userId, "usertype", userType);

			if (userType === "user") {
				await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
			} else if (userType === "captain") {
				await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
			}
			socket.on("send_message", async (messageData) => {
				console.log("Received message:", messageData);
				try {
					const { rideId, recipientId, content, timestamp } = messageData;
					console.log("rr".recipientId);
					
					// Save message to database
					const newMessage = await messageModel.create({
						rideId,
						senderId: userId,
						recipientId,
						content,
						timestamp: timestamp,
					});
	
					// Find recipient's socket ID
					let recipientSocketId;
					const userRecipient = await userModel.findById(recipientId);
					const captainRecipient = await captainModel.findById(recipientId);
	
					recipientSocketId = userRecipient?.socketId || captainRecipient?.socketId;
					console.log("New Message:", newMessage);
	
					if (recipientSocketId) {
						console.log(`Sending to socket: ${recipientSocketId}`);
						io.to(recipientSocketId).emit("receive_message", {
							...messageData,
							senderId: userId,
							isSender: false,
						});
					} else {
						console.log("Recipient socket ID not found");
					}
				} catch (error) {
					console.error("Error handling message:", error);
					socket.emit("error", "Failed to send message");
				}
			});
			socket.on("clear-chat-message", async (data) => {
				const { rideId } = data;
				await messageModel.deleteMany({ rideId });
				console.log("Chat cleared successfully");
			});
		});

		socket.on("update-location-captain", async (data) => {
			const { userId, location } = data;
			if (!location || !location.longitude || !location.latitude) {
				return socket.emit("error", { message: "Invalid location data" });
			}
			await captainModel.findByIdAndUpdate(userId, {
				location: {
					longitude: location.longitude,
					latitude: location.latitude,
				},
			});
		});

		

		socket.on("disconnect", () => {
			console.log(`Client disconnected: ${socket.id}`);
		});
	});
}

function sendMessageToSocketId(socketId, messageObject) {
	if (io) {
		console.log("Sending message event", messageObject.event);

		io.to(socketId).emit(messageObject.event, messageObject.data);
	} else {
		console.log("Socket.io not initialized.");
	}
}

module.exports = { initializeSocket, sendMessageToSocketId };
