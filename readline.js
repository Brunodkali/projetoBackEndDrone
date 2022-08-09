const  readline  = require ('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


rl.question('Qual o melhor drone?', (answer) => {
    console.log(`O melhor drone é: ${answer}`)
        switch(answer){
            case "command" :
                console.log('Ligando Drone')
                break;
            case "takeoff" :
                console.log('Decolando Drone')
                break;

            default :
                console.log('Ligue o Drone')
        }

    rl.close()
})