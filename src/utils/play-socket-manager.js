const { PlayFetchActions } = require('./constants');

const setupEvent = (socket, io) => {
    socket.on(PlayFetchActions.JOIN_ROOM, async (roomId, user) => {
        const workspace = await RoomRepository.getRoomMetaData(workspaceId, true);
        if (!workspace) {
            socket.emit(WorkspaceFetchAction.JOIN_SPACE_RESULT, { status: 'fail', errorCode: 404 });
        } else {
            if (!workspace.historyMembers.includes(socket.userId)) {
                await RoomRepository.update(workspace.id, {
                    historyMembers: [...workspace.historyMembers, socket.userId]
                });
            }
            socket.emit(PlayFetchActions.DID_JOIN_ROOM, { status: 'success', data: workspace });
            io.to(roomId).emit(PlayFetchActions.JOIN_ROOM, user);
            socket.join(roomId);
        }
    });

    socket.on(PlayFetchActions.LEAVE_ROOM, async (roomId) => {
        socket.leave(roomId);
        const user = await UserRepository.getOne({ id: socket.userId });
        io.to(roomId).emit(PlayFetchActions.LEAVE_ROOM, getSafeUser(user));
    });

    socket.on(PlayFetchActions.PLAY, async (roomId) => {
        socket.leave(workspaceId);
        const user = await UserRepository.getOne({ id: socket.userId });
        io.to(roomId).emit(PlayFetchActions.PLAY, getSafeUser(user));
    });

    socket.on('disconnecting', async () => {
        const workspaceIds = Array.from(socket.rooms);
        const user = await UserRepository.getOne({ id: socket.userId });
        workspaceIds.forEach((workspaceId) => {
            io.to(workspaceId).emit(PlayFetchActions.WILL_LEAVE_ROOM, getSafeUser(user));
        });
        setTimeout(() => {
            io.to(workspaceId).emit(PlayFetchActions.LEAVE_ROOM, getSafeUser(user));
        }, 30000);
    });
}

module.exports = {
    setupEvent
}
