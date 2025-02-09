const socketIo = require("socket.io");
const userModel = require("./models/user.model");
const captainModel = require("./models/captain.model");

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
            console.log("userid",userId,"usertype",userType);
            

			if (userType === "user") {
				await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
			} else if (userType === "captain") {
				await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
			}
		});

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;
            if (!location || !location.longitude || !location.latitude) {
                return socket.emit('error', { message: 'Invalid location data' });
            }
            await captainModel.findByIdAndUpdate(userId, {
                location: {
                    longitude: location.longitude,
                    latitude: location.latitude,
                }
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
