const { Operacion } = require('../models/modelOperacion');
const { Cuenta } = require('../models/modelCuenta')

async function getOperacion(req,res) {
    try{
        const operaciones = await Operacion.find({});
        res.send(operaciones);

    } catch (err){
        console.log("Error al introducir la operación");
        res.status(500).send("Error interno del servidor");
    }
};

async function getOperacionById(req,res) {
    try{
        const id = await Operacion.find({id: req.params.id});
        res.send(id)
    } catch (err) {
        console.log("No se ha obtenido la operación")
        res.status(500).send("Error interno del servidor.")
    }
}


async function createOperacion(req, res) {
    try {
        const operacion = new Operacion({
            cantidad: req.body.cantidad,
            nombre: req.body.nombre,
            concepto: req.body.concepto,
            id_cuenta: req.body.id_cuenta,
            id_tipoOperacion: req.body.id_tipoOperacion,
            
            
            
        });
        await operacion.save();
        res.send(operacion);
    } catch (err) {
        console.error("Error al obtener las operaciones:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function updateOperacion(req,res){
    try{
        const nombre = req.params.nombre;
        const updatedNombre = await Operacion.findOneAndUpdate({ nombre: nombre }, req.body, { new: true });
        res.send(updatedNombre);

    }catch (err) {
        console.log("Error al actualizar operaciones", err);
        res.status(500).send("Error interno del servidor")
    }
}

async function deleteOperacion(req, res) {
    try {
        const operacionNombre = req.params.id;
        await Operacion.deleteMany({ id: operacionNombre });
        res.send("Operacion eliminada con exito");
    } catch (err) {
        console.error("Error al eliminar las operaciones:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function getOperacionesByCuentaId(req, res) {
    try {
        const cuentaId = req.params.id;
        const operaciones = await Operacion.find({ id_cuenta: cuentaId });
        res.send(operaciones);
    } catch (err) {
        console.error("Error al obtener las operaciones asociadas a la cuenta:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function ingresarDinero(req, res) {
    try {
        const { cantidad, id_cuenta } = req.body;
        
        // Crear una nueva operación para el ingreso de dinero
        const operacion = new Operacion({
            nombre: req.body.nombre,
            concepto: req.body.concepto,
            cantidad: req.body.cantidad,
            id_cuenta: req.body.id_cuenta,
            tipo: req.body.tipo
            
        });
        
        // Guardar la operación en la base de datos
        await operacion.save();
        
        // Actualizar el saldo de la cuenta sumando la cantidad ingresada
        const cuenta = await Cuenta.findById(id_cuenta);
        cuenta.saldo += parseFloat(cantidad);
        await cuenta.save();
        
        // Enviar respuesta exitosa
        res.status(200).json({ message: "Dinero ingresado exitosamente" });

    } catch (err) {
        console.error("Error al ingresar dinero en la cuenta:", err);
        res.status(500).send("Error interno del servidor");
    }
}




async function retirarDinero(req, res) {
    try {
        const { cantidad, id_cuenta } = req.body;
        
        // Crear una nueva operación para el ingreso de dinero
        const operacion = new Operacion({
            nombre: req.body.nombre,
            concepto: req.body.concepto,
            cantidad: req.body.cantidad,
            id_cuenta: req.body.id_cuenta,
            
        });
        
        // Guardar la operación en la base de datos
        await operacion.save();
        
        // Actualizar el saldo de la cuenta sumando la cantidad ingresada
        const cuenta = await Cuenta.findById(id_cuenta);
        cuenta.saldo -= parseFloat(cantidad);
        await cuenta.save();
        
        // Enviar respuesta exitosa
        res.status(200).json({ message: "Dinero retirado exitosamente" });
    } catch (err) {
        console.error("Error al ingresar dinero en la cuenta:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function transferirSaldo(req, res) {
    try {
        const { ibanEmisor, ibanReceptor, cantidad } = req.body;

        // Buscar cuentas por IBAN
        const cuentaEmisor = await Cuenta.findOne({ iban: ibanEmisor });
        const cuentaReceptor = await Cuenta.findOne({ iban: ibanReceptor });

        // Verificar si las cuentas existen
        if (!cuentaEmisor || !cuentaReceptor) {
            return res.status(404).json({ mensaje: 'Una o ambas cuentas no existen.' });
        }

        if (ibanEmisor === ibanReceptor) {
            return res.status(400).json({ mensaje: 'No puedes transferir dinero a tu propia cuenta.' });
        }

         // Verificar si la cuenta del emisor existe y tiene saldo suficiente
         if (!cuentaEmisor || cuentaEmisor.saldo < cantidad) {
            return res.status(400).json({ mensaje: 'Saldo insuficiente en la cuenta emisora.' });
        }

        // Verificar saldo suficiente en el emisor
        if (cuentaEmisor.saldo < cantidad) {
            return res.status(400).json({ mensaje: 'Saldo insuficiente en la cuenta emisora.' });
        }

        // Realizar la transferencia
        cuentaEmisor.saldo -= cantidad;
        cuentaReceptor.saldo += cantidad;

        // Guardar las operaciones
        const operacionEmisor = new Operacion({
            nombre: 'Transferencia emitida',
            cantidad: cantidad,
            concepto: 'Transferencia a ' + ibanReceptor,
            id_cuenta: cuentaEmisor._id,
            tipo: 'retiro'
        });
        await operacionEmisor.save();

        const operacionReceptor = new Operacion({
            nombre: 'Transferencia recibida',
            cantidad: cantidad,
            concepto: 'Transferencia de ' + ibanEmisor,
            id_cuenta: cuentaReceptor._id,
            tipo: 'ingreso'
        });
        await operacionReceptor.save();

        // Guardar los cambios en las cuentas
        await cuentaEmisor.save();
        await cuentaReceptor.save();

        res.status(200).json({ mensaje: 'Transferencia realizada con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
}



module.exports = { getOperacion, createOperacion ,getOperacionById, updateOperacion, deleteOperacion, getOperacionesByCuentaId,ingresarDinero,retirarDinero,transferirSaldo}

/*async function updateOperacion(req, res) {
    try {
        const id = req.params.id;
        const updatedUser = await User.findOneAndUpdate({ nombre: userName }, req.body, { new: true });
        res.send(updatedUser);
    } catch (err) {
        console.error("Error al actualizar el usuario:", err);
        res.status(500).send("Error interno del servidor");
    }
}
*/
