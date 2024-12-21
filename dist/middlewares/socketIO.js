"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIO = void 0;
function socketIO(io) {
    let clientUUID = {};
    io.on('connection', (socket) => {
        const uuid = socket.handshake.query.uuid;
        if (uuid) {
            clientUUID[socket.id] = uuid;
            io.emit('client-connected', clientUUID);
            socket.on('disconnect', () => {
                if (clientUUID[socket.id]) {
                    const uuid = clientUUID[socket.id];
                    delete clientUUID[socket.id];
                    // Check if there are any other sockets still connected with the same UUID
                    const isUUIDStillConnected = Object.values(clientUUID).includes(uuid);
                    if (!isUUIDStillConnected) {
                        io.emit('client-disconnected', uuid);
                    }
                }
            });
        }
        ;
    });
    return (req, res, next) => {
        res.locals.io = io;
        next();
    };
}
exports.socketIO = socketIO;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0SU8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZXMvc29ja2V0SU8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsU0FBZ0IsUUFBUSxDQUFDLEVBQVU7SUFFbEMsSUFBSSxVQUFVLEdBQTJCLEVBQUUsQ0FBQztJQUU1QyxFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBRTlCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN6QyxJQUFJLElBQUksRUFBRSxDQUFDO1lBRVYsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFjLENBQUM7WUFFdkMsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUV4QyxNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7Z0JBQzVCLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO29CQUMzQixNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO29CQUNsQyxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRTdCLDBFQUEwRTtvQkFDMUUsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDdEUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7d0JBQzNCLEVBQUUsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3RDLENBQUM7Z0JBQ0YsQ0FBQztZQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUFBLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtRQUMxRCxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxFQUFFLENBQUM7SUFDUixDQUFDLENBQUM7QUFDSCxDQUFDO0FBaENELDRCQWdDQyJ9