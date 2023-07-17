fs = require('fs/promises');

const actualizarData = async(nuevaLista) => {
    fs.writeFile('../drilling/data/listaJugadores.json', JSON.stringify(nuevaLista, null, 2));
}

module.exports = { actualizarData };