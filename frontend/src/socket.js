import {io} from 'socket.io-client'

async function initializeSocket(){
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    return io(process.env.REACT_APP_SERVER_URL, options)
}

export {initializeSocket}