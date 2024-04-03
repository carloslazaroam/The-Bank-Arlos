const { TipoOperacion } = require('../models/modelTipoOperacion');

async function getTipoOperacion(req,res) {
    try{
        const tipoOperaciones = await TipoOperacion.find({});
        res.send(tipoOperaciones);
    } catch (err) {
        console.log("Error al obtener los tipos de operaciones");
        res.status(500).send("Error interno del servidor");
    }
}

async function getTipoOperacionById(req,res) {
    try{
        const tipoOperaciones = await TipoOperacion.find({id: req.params.id});
        res.send(tipoOperaciones)
    } catch (err) {
        console.log("Error al obtener el tipo de Operacion")
        res.send(500).status("Error interno del servidor");
    }
}

async function createTipoOperacion(req,res) {
    try {
        const operacion = new TipoOperacion({
            nombre: req.body.nombre
        });

        await operacion.save();
        res.send(operacion)
    } catch (err) {
        console.log("Error al crear el tipo de Operacion");
        res.status(500).send("Error interno del servidor");
    }
}

async function updateTipoOperacion(req,res) {
    try {
        const id = req.params.id;
        const updatedOperacion = await TipoOperacion.findOneAndUpdate({ id: id }, req.body, { new: true });
        res.send(updatedOperacion);
    } catch (err) {
        console.log("Error al actualizar el tipo de operación");
        res.status(500).send("Error interno del servidor");
    }
}

async function deleteTipoOperacion(req,res){
    try{
        const id = req.params.id;
        await TipoOperacion.deleteMany({ id: id });
        res.send("Tipo de operacion eliminada correctamente");
    } catch (err) {
        console.log("No se pudo eliminar la operación")
        res.status(500).send("Error interno del servidor")
    }
}

module.exports = {getTipoOperacion,createTipoOperacion, updateTipoOperacion, deleteTipoOperacion, getTipoOperacionById}