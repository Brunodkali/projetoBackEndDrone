const readline = require('readline');
const { createSocket } = require('dgram');
const CommandParser = require('./CommandParser');
const Commander = require('./commander');
const { create } = require('domain');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const TELLO_CMD_PORT = 8889;
const TELLO_HOST = '192.168.10.1';

const getSocket = ()=>{
    const socket = createSocket('udp4');
    socket.bind(TELLO_CMD_PORT);
    return socket
}

(async function start(){
    const socket = getSocket();
    const cmder = new Commander(socket, TELLO_HOST, TELLO_CMD_PORT);
    await cmder.sendInitCommand();
    const cmdp = new CommandParser({
        onTakeoff: async () => {await cmder.sendTakeOff()},
        onLand: async () => {await cmder.sendLand()},
        onForward: async (dist) => {await cmder.sendForward(dist)},
        onBack: async (dist) => {await cmder.sendBack(dist)},
        onRight: async (dist) => {await cmder.sendRight(dist)},
        onLeft: async (dist) => {await cmder.sendLeft(dist)},
        onFlip: async () => {await cmder.sendFlip()},
        onBattery: async () => {await cmder.sendBattery()}
    })
    console.log('Iniciando!')
    socket.on('message', (msg)=>{
        console.log(`Dji Tello: ${msg.toString()}`)
    })
    socket.on('error', (err)=>{
        console.log(`Dji Tello ERROR: ${err}`)
    })

    socket.on('listening', (msg)=>{
        console.log(`Socket is listening!`)
    })
    console.log('Digite um comando: ')
    rl.on('line', (line)=> {
        if(!cmdp.pareCommand(line)){
            if(line == 'exit'){
                console.log('Bye');
                process.exit(0);
            }
            console.log('Not a valid command')
        }
    })
})()