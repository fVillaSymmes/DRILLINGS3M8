const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
const { leerData } = require('./utils/leerData.js')
const { actualizarData } = require('./utils/actualizarData.js')

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.listen(port, () => {
    console.log(`Servidor levantado en http://localhost:${port}`);
})

app.get('/api/lista', async (req, res) => {
    const listaJugadores = await leerData();

    if(listaJugadores) return res.status(200).send(
        listaJugadores
    )
});

app.get('/api/lista/:id', async (req, res) => {
    const idSolicitada = req.params.id

    try {
        const listaJugadores = await leerData();
        jugadorSolicitado = listaJugadores.find(j => j.id == idSolicitada)

        if(jugadorSolicitado === undefined){
            throw new Error();
        }
    
        res.status(200).json({
            jugadorSolicitado: jugadorSolicitado
        })

    } catch (error) {
        res.status(404).json({
            message: 'Error, no existe jugador asociado al id solicitado'
        })
        console.error(error);
    }
})

app.post('/api/lista', async(req, res) => {

    try {
        
    const listaJugadores = await leerData();
    const nuevoJugador = req.body

    if(listaJugadores.find(j => j.nombre == nuevoJugador.nombre) || listaJugadores.find(j => j.id == nuevoJugador.id)) return res.status(400).json({
        message: 'Ya existe un jugador con ese nombre o ese id.'
    })

    if(nuevoJugador.nombre == null || nuevoJugador.posicion == null ) return res.status(400).json({
        message: 'Es necesario ingresar un nombre y una posición para crear un jugador'
    })

    if(nuevoJugador.nombre == '' || nuevoJugador.posicion == '') return res.status(400).json({
        message: 'Es necesario rellenar todos los campos para crear un nuevo jugador'
    })

    listaJugadores.push(nuevoJugador)
    await actualizarData(listaJugadores)
    res.status(201).json({
        message: 'el recurso jugador ha sido creado exitosamente',
        nuevoJugador: nuevoJugador
    })
    
    } catch (error) {
        res.status(400).json({
            message: 'No ha sido posible crear un nuevo jugador'
        })
        console.error(error);
}})

app.put('/api/lista/:id', async (req, res) => {
    try{
    const listaJugadores = await leerData();
    const idJugadorPorActualizar = req.params.id
    const nuevaDataParaJugador = req.body

    let jugadorPorActualizar = listaJugadores.find(j => j.id == idJugadorPorActualizar)
    const indexJugadorPorActualizar = listaJugadores.findIndex((j) => j == jugadorPorActualizar)

    if(!jugadorPorActualizar) return res.status(404).json({
        message: 'El jugador solicitado no ha sido encontrado. La id ingresada no corresponde con ningún jugador'
    })

    if(nuevaDataParaJugador.nombre == null && nuevaDataParaJugador.posicion == null ) return res.status(400).json({
        message: 'No se ha proporcionado ningún dato para actualizar al jugador solicitado'
    })

    listaJugadores[indexJugadorPorActualizar] = {
        id: idJugadorPorActualizar, 
        nombre: nuevaDataParaJugador.nombre ? nuevaDataParaJugador.nombre : jugadorPorActualizar.nombre,
        posicion: nuevaDataParaJugador.posicion ? nuevaDataParaJugador.posicion : jugadorPorActualizar.posicion
    }

    await actualizarData(listaJugadores)
    res.status(200).json({
        message: 'el recurso jugador ha sido modificado exitosamente',
        jugadorModificado: listaJugadores[indexJugadorPorActualizar]
    })} catch (error) {
        res.status(400).json({
            message: 'El intento por actualizar al jugador indicado ha fracasado'
        })
        console.error(error)
    }
})

app.delete('/api/lista/:id', async (req, res) => {
    try{
    const listaJugadores = await leerData();
    const idJugadorPorEliminar = req.params.id

    const jugadorPorEliminar = listaJugadores.find(j => j.id == idJugadorPorEliminar)

    if(!jugadorPorEliminar) return res.status(404).json({
        message: 'El jugador solicitado no ha sido encontrado. La id ingresada no corresponde con ningún jugador'
    })

    const indexJugadorPorEliminar = listaJugadores.findIndex(j => j == jugadorPorEliminar)
    listaJugadores.splice(indexJugadorPorEliminar, 1)

    actualizarData(listaJugadores)
    res.status(200).json({
        message: 'el recurso jugador ha sido eliminado exitosamente',
        jugadorEliminado: jugadorPorEliminar
    })
} catch (error) {
    res.status(400).json({
        message: 'El intento por eliminar el jugador indicado ha fracasado'
    })
    console.error(error)
}})