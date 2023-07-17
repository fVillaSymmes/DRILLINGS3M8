const fs = require('fs/promises');

const leerData = async () => {
    try {
        const lista = await fs.readFile('../drilling/data/listaJugadores.json')
        return JSON.parse(lista)
    } catch (error) {
        console.log(`No fue posible acceder al archivo de jugadores: ${error}`);
}}

module.exports = { leerData }