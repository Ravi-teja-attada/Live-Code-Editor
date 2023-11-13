import {io} from 'socket.io-client'

async function initializeSocket(){
    const options = {
        'force new connection': true,
        timeout: 10000,
        transports: ['websocket'],
        reconnectAttempt: 'Infinity'  
    }

    return io(process.env.REACT_APP_SERVER_URL, options)
}

export {initializeSocket}