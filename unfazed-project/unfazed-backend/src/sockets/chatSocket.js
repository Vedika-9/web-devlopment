const jwt = require('jsonwebtoken');

/**
 * Real-time chat between a therapist and a client, scoped to a room per
 * conversation (therapistId + clientId). Also emits typing indicators and
 * read receipts as a lightweight stretch feature.
 */
function initChatSocket(io) {
  io.use((socket, next) => {
    // Therapist side authenticates with JWT; client side connects with a
    // simple identity payload (clientId) since clients don't have accounts.
    const { token, role } = socket.handshake.auth || {};
    if (role === 'therapist') {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.therapistId = decoded.therapistId;
        socket.role = 'therapist';
        return next();
      } catch (e) {
        return next(new Error('unauthorized'));
      }
    }
    if (role === 'client' && socket.handshake.auth.clientId) {
      socket.clientId = socket.handshake.auth.clientId;
      socket.role = 'client';
      return next();
    }
    return next(new Error('unauthorized'));
  });

  io.on('connection', (socket) => {
    socket.on('join_room', ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on('send_message', ({ roomId, message }) => {
      const payload = {
        roomId,
        message,
        senderRole: socket.role,
        senderId: socket.therapistId || socket.clientId,
        sentAt: new Date().toISOString(),
      };
      io.to(roomId).emit('receive_message', payload);
    });

    socket.on('typing', ({ roomId }) => {
      socket.to(roomId).emit('typing', { senderRole: socket.role });
    });

    socket.on('read_receipt', ({ roomId, messageId }) => {
      socket.to(roomId).emit('read_receipt', { messageId, readerRole: socket.role });
    });

    socket.on('disconnect', () => {
      // no-op for now; hook presence tracking here if needed
    });
  });
}

module.exports = initChatSocket;
