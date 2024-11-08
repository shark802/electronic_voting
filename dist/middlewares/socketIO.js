"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIO = void 0;
function socketIO(io) {
    let clientUUID = {};
    io.on('connection', (socket) => {
        const uuid = socket.handshake.query.uuid;
        if (uuid) {
            const uuidExist = Object.values(clientUUID).find((value) => {
                return value === uuid;
            });
            if (!uuidExist) {
                clientUUID[socket.id] = uuid;
                io.emit('client-connected', clientUUID);
            }
            socket.on('disconnect', () => {
                if (clientUUID[socket.id]) {
                    io.emit('client-disconnected', clientUUID[socket.id]);
                    delete clientUUID[socket.id];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0SU8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbWlkZGxld2FyZXMvc29ja2V0SU8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsU0FBZ0IsUUFBUSxDQUFDLEVBQVU7SUFFbEMsSUFBSSxVQUFVLEdBQTJCLEVBQUUsQ0FBQztJQUU1QyxFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO1FBRTlCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN6QyxJQUFJLElBQUksRUFBRSxDQUFDO1lBRVYsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDMUQsT0FBTyxLQUFLLEtBQUssSUFBSSxDQUFBO1lBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNoQixVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQWMsQ0FBQztnQkFFdkMsRUFBRSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBRUQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO2dCQUM1QixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztvQkFDM0IsRUFBRSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3RELE9BQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztZQUNGLENBQUMsQ0FBQyxDQUFDO1FBQ0osQ0FBQztRQUFBLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCLEVBQUUsRUFBRTtRQUMxRCxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxFQUFFLENBQUM7SUFDUixDQUFDLENBQUM7QUFDSCxDQUFDO0FBaENELDRCQWdDQyJ9