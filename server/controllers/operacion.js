const { Operacion } = require('../models/modelOperacion');
const { Cuenta } = require('../models/modelCuenta')
const pdf = require('html-pdf');

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
            fecha: req.body.fecha
            
            
            
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
        const { cantidad, id_cuenta, nombre, concepto, tipo, fecha, generarComprobante } = req.body;

        // Verificar si el cliente desea generar un comprobante
        if (generarComprobante === "si") {
            // Generar y guardar comprobante PDF
            const operacion = new Operacion({
                nombre,
                concepto,
                cantidad,
                id_cuenta,
                tipo: 'ingreso',
                fecha
            });

            await operacion.save(); // Guardar la operación en la base de datos

            // Generar y guardar comprobante PDF
            const html = `
            <style>
            /* Aquí va tu CSS */
            body {
                font-family: 'Roboto', sans-serif;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
            }

            /* Otros estilos que desees aplicar */
            </style>
            <div class="invoice-card">
                <div class="invoice-title">
                    <div id="main-title">
                        <h4>COMPROBANTE DE OPERACIÓN</h4>
                        <span>#${operacion._id}</span>
                    </div>
                    <span id="date">${fecha}</span>
                </div>
                <div class="invoice-details">
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <td>Nombre del titular</td>
                                <td>Concepto</td>
                                <td>Cantidad ingresada</td>
                                <td>Tipo de operación</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row-data">
                                <td>${nombre}</td>
                                <td>${concepto}</td>
                                <td>${cantidad}</td>
                                <td>${tipo}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            `;

            const options = { format: 'Letter' };

            // Generar el PDF y guardarlo en el servidor
            pdf.create(html, options).toFile(`comprobante_${operacion._id}.pdf`, (err, result) => {
                if (err) {
                    console.error("Error al generar el PDF:", err);
                    res.status(500).send("Error al generar el comprobante");
                } else {
                    console.log("PDF generado exitosamente:", result);

                    // Enviar el PDF al cliente para descargarlo
                    const filePath = `comprobante_${operacion._id}.pdf`;
                    res.download(filePath, (err) => {
                        if (err) {
                            console.error("Error al enviar el archivo al cliente:", err);
                            res.status(500).send("Error al enviar el comprobante al cliente");
                        } else {
                            console.log("Comprobante enviado al cliente");
                        }
                    });
                }
            });
        } else {
            // No se genera comprobante, solo realizar la operación
            // Código para ingresar dinero y realizar la operación
            const operacion = new Operacion({
                nombre,
                concepto,
                cantidad,
                id_cuenta,
                tipo: 'ingreso',
                fecha
            });

            await operacion.save(); // Guardar la operación en la base de datos

            // Actualizar el saldo de la cuenta
            const cuenta = await Cuenta.findById(id_cuenta);
            cuenta.saldo += parseFloat(cantidad);
            await cuenta.save();

            res.status(200).json({ message: "Dinero ingresado exitosamente" });
        }

    } catch (err) {
        console.error("Error al ingresar dinero en la cuenta:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function retirarDinero(req, res) {
    try {
        const { cantidad, id_cuenta, nombre, concepto, tipo, fecha, generarComprobante } = req.body;

        // Verificar si el cliente desea generar un comprobante
        if (generarComprobante === "si") {
            // Generar y guardar comprobante PDF
            const operacion = new Operacion({
                nombre,
                concepto,
                cantidad,
                id_cuenta,
                tipo: 'retiro',
                fecha
            });

            await operacion.save(); // Guardar la operación en la base de datos

            // Generar y guardar comprobante PDF
            const html = `
            <style>
            /* Aquí va tu CSS */
            body {
                font-family: 'Roboto', sans-serif;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
            }

            /* Otros estilos que desees aplicar */
            </style>
            <div class="invoice-card">
                <div class="invoice-title">
                    <div id="main-title">
                        <h4>COMPROBANTE DE OPERACIÓN</h4>
                        <span>#${operacion._id}</span>
                    </div>
                    <span id="date">${fecha}</span>
                </div>
                <div class="invoice-details">
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <td>Nombre del titular</td>
                                <td>Concepto</td>
                                <td>Cantidad ingresada</td>
                                <td>Tipo de operación</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row-data">
                                <td>${nombre}</td>
                                <td>${concepto}</td>
                                <td>${cantidad}</td>
                                <td>${tipo}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            `;

            const options = { format: 'Letter' };

            // Generar el PDF y guardarlo en el servidor
            pdf.create(html, options).toFile(`comprobante_${operacion._id}.pdf`, (err, result) => {
                if (err) {
                    console.error("Error al generar el PDF:", err);
                    res.status(500).send("Error al generar el comprobante");
                } else {
                    console.log("PDF generado exitosamente:", result);

                    // Enviar el PDF al cliente para descargarlo
                    const filePath = `comprobante_${operacion._id}.pdf`;
                    res.download(filePath, (err) => {
                        if (err) {
                            console.error("Error al enviar el archivo al cliente:", err);
                            res.status(500).send("Error al enviar el comprobante al cliente");
                        } else {
                            console.log("Comprobante enviado al cliente");
                        }
                    });
                }
            });
        } else {
            // No se genera comprobante, solo realizar la operación
            // Código para retirar dinero y realizar la operación
            const operacion = new Operacion({
                nombre,
                concepto,
                cantidad,
                id_cuenta,
                tipo: 'retiro',
                fecha
            });

            await operacion.save(); // Guardar la operación en la base de datos

            // Actualizar el saldo de la cuenta
            const cuenta = await Cuenta.findById(id_cuenta);
            cuenta.saldo -= parseFloat(cantidad);
            await cuenta.save();

            res.status(200).json({ message: "Dinero retirado exitosamente" });
        }

    } catch (err) {
        console.error("Error al retirar dinero de la cuenta:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function transferirSaldo(req, res) {
    try {
        const { ibanEmisor, ibanReceptor, cantidad, concepto, nombre, generarComprobante } = req.body;

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

        // Verificar saldo suficiente en el emisor
        if (cuentaEmisor.saldo < cantidad) {
            return res.status(400).json({ mensaje: 'Saldo insuficiente en la cuenta emisora.' });
        }

        // Realizar la transferencia
        cuentaEmisor.saldo -= parseFloat(cantidad);
        cuentaReceptor.saldo += parseFloat(cantidad);

        // Guardar las operaciones
        const operacionEmisor = new Operacion({
            nombre: nombre,
            cantidad: cantidad,
            concepto: '(Transferencia a ' + ibanReceptor + ') ' + concepto,
            id_cuenta: cuentaEmisor._id,
            tipo: 'retiro'
        });
        await operacionEmisor.save();

        const operacionReceptor = new Operacion({
            nombre: nombre,
            cantidad: cantidad,
            concepto: '(Ingreso por parte de ' + ibanEmisor + ') ' + concepto,
            id_cuenta: cuentaReceptor._id,
            tipo: 'ingreso'
        });
        await operacionReceptor.save();

        // Guardar los cambios en las cuentas
        await cuentaEmisor.save();
        await cuentaReceptor.save();

        // Verificar si se debe generar un comprobante
        if (generarComprobante === "si") {
            // Generar y enviar comprobante PDF
            const html = `
            <style>
            /* Aquí va tu CSS */
            body {
                font-family: 'Roboto', sans-serif;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
            }

            /* Otros estilos que desees aplicar */
            </style>
            <div class="invoice-card">
                <div class="invoice-title">
                    <div id="main-title">
                        <h4>COMPROBANTE DE TRANSFERENCIA</h4>
                        <span>#${operacionEmisor._id}</span>
                    </div>
                    <span id="date">${new Date().toLocaleDateString()}</span>
                </div>
                <div class="invoice-details">
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <td>Nombre del emisor</td>
                                <td>Nombre del receptor</td>
                                <td>Concepto</td>
                                <td>Cantidad transferida</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="row-data">
                                <td>${ibanEmisor}</td>
                                <td>${ibanReceptor}</td>
                                <td>${concepto}</td>
                                <td>${cantidad}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            `;

            const options = { format: 'Letter' };

            pdf.create(html, options).toBuffer((err, buffer) => {
                if (err) {
                    console.error("Error al generar el PDF:", err);
                    return res.status(500).send("Error al generar el comprobante");
                }

                res.setHeader('Content-Disposition', 'attachment; filename="comprobante_transferencia.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                res.send(buffer);
            });
        } else {
            // No se genera comprobante
            res.status(200).json({ mensaje: 'Transferencia realizada con éxito.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
}



async function vaciarCuenta(req, res) {
    try {
        const { id_cuenta } = req.body;

        // Verificar si se proporcionó la ID de la cuenta
        if (!id_cuenta) {
            return res.status(400).json({ error: "Se debe proporcionar la ID de la cuenta" });
        }

        // Obtener la cuenta por su ID
        const cuenta = await Cuenta.findById(id_cuenta);

        // Verificar si la cuenta existe
        if (!cuenta) {
            return res.status(404).json({ mensaje: 'La cuenta no existe.' });
        }

        // Crear una nueva operación para vaciar la cuenta
        const operacion = new Operacion({
            nombre: 'CUENTA VACIADA',
            concepto: 'Saldo total retirado',
            cantidad: cuenta.saldo,
            id_cuenta: cuenta._id,
            tipo: 'retiro'
        });

        // Guardar la operación en la base de datos
        await operacion.save();

        // Establecer el saldo de la cuenta en 0
        cuenta.saldo = 0;
        await cuenta.save();

        // Enviar respuesta exitosa
        res.status(200).json({ mensaje: 'Cuenta vaciada exitosamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
}




module.exports = { getOperacion, createOperacion ,getOperacionById, updateOperacion, deleteOperacion, getOperacionesByCuentaId,ingresarDinero,retirarDinero,transferirSaldo,vaciarCuenta}

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
