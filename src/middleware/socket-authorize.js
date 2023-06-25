const jwt = require('jsonwebtoken');
const firebase = require('../utils/firebase');

const verifyToken = (socket, next) => {
    const cookies = socket.handshake.headers.cookie.split(';');
    const map = new Map();
    cookies.forEach((cookie) => {
        const keyValues = cookie.split('=');
        map.set(keyValues[0].trim(), keyValues[1]);
    });
    if (map.get('x-access-token')) {
        jwt.verify(map.get('x-access-token'), process.env.APP_SECRET, function (err, decoded) {
            if (err) {
                firebase
                    .auth()
                    .verifyIdToken(map.get('x-access-token'))
                    .then((decodedToken) => {
                        socket.userId = decodedToken.uid;
                        next();
                    })
                    .catch(() => {
                        next(new Error('Connection socket error'));
                    });
            } else {
                socket.userId = decoded.id;
                next();
            }
        });
    } else {
        next(new Error('Connection socket error'));
    }
};

module.exports = verifyToken;