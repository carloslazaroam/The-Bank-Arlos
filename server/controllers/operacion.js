const { Operacion } = require('../models/modelOperacion');
const { Cuenta } = require('../models/modelCuenta')
const { User } = require('../models/modelUser')
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
const fs = require('fs');




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

async function enviarBizum(req, res) {
    try {
        const { ibanEmisor, telefonoReceptor, cantidad, concepto, generarComprobante } = req.body;

        // Buscar la cuenta del emisor por IBAN
        const cuentaEmisor = await Cuenta.findOne({ iban: ibanEmisor });

        if (!cuentaEmisor) {
            return res.status(404).json({ mensaje: 'Cuenta del emisor no encontrada.' });
        }

        // Encontrar el usuario receptor por teléfono
        const usuarioReceptor = await User.findOne({ telefono: telefonoReceptor });

        if (!usuarioReceptor) {
            return res.status(404).json({ mensaje: 'Usuario receptor no encontrado.' });
        }

        // Encontrar la cuenta más antigua del usuario receptor
        const cuentasUsuarioReceptor = await Cuenta.find({ id_usuario: usuarioReceptor._id }).sort({ fechacreacion: 1 }).limit(1);

        if (!cuentasUsuarioReceptor || cuentasUsuarioReceptor.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron cuentas para el usuario receptor.' });
        }

        const cuentaReceptor = cuentasUsuarioReceptor[0];

        // Verificar saldo suficiente en el emisor
        if (cuentaEmisor.saldo < cantidad) {
            return res.status(400).json({ mensaje: 'Saldo insuficiente en la cuenta emisora.' });
        }

        // Obtener información del usuario emisor
        const usuarioEmisor = await User.findById(cuentaEmisor.id_usuario);

        if (!usuarioEmisor) {
            return res.status(404).json({ mensaje: 'Usuario emisor no encontrado.' });
        }

        // Realizar la transferencia
        cuentaEmisor.saldo -= parseFloat(cantidad);
        cuentaReceptor.saldo += parseFloat(cantidad);

        // Guardar las operaciones
        const operacionEmisor = new Operacion({
            nombre: 'BIZUM ENVIADO',
            cantidad: cantidad,
            concepto: concepto,
            id_cuenta: cuentaEmisor._id,
            tipo: 'retiro'
        });
        await operacionEmisor.save();

        const operacionReceptor = new Operacion({
            nombre: 'BIZUM RECIBIDO',
            cantidad: cantidad,
            concepto: '(Bizum recibido por parte de ' + ibanEmisor + ') ' + concepto,
            id_cuenta: cuentaReceptor._id,
            tipo: 'ingreso'
        });
        await operacionReceptor.save();

        // Guardar los cambios en las cuentas
        await cuentaEmisor.save();
        await cuentaReceptor.save();

        // Enviar correo electrónico al usuario receptor
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'polanskirichard513@gmail.com',
                pass: 'nuxu xanb qtgm anod'
            }
        });

        const mailOptions = {
            from: 'polanskirichard513@gmail.com',
            to: usuarioReceptor.email,
            subject: 'Notificación de Bizum',
            text: `Has recibido un Bizum de ${cantidad}€ por parte de ${usuarioEmisor.nombre} ${usuarioEmisor.apellido1}.

Concepto: ${concepto}

Saludos,
The Bank-Arlos`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
            } else {
                console.log('Correo enviado:', info.response);
            }
        });

        if (generarComprobante === "si") {
            // Generar y enviar comprobante PDF
            const imgPath = './thebankarlos.png';
            const imgBase64 = fs.readFileSync(imgPath, { encoding: 'base64' });
            const imgSrc = `data:image/png;base64,${imgBase64}`;



            const imgPath2 = './bizum.png';
            const imgBase642 = fs.readFileSync(imgPath2, { encoding: 'base64' });
            const imgSrc2 = `data:image/png;base64,${imgBase642}`;

            const html = `
            <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    background-color: #ffffff;
                    margin: 0;
                    padding: 0;
                }
                .invoice-card {
                    border: 1px solid #cce7e8;
                    padding: 20px;
                    max-width: 600px;
                    margin: 20px auto;
                    position: relative;
                }
                .invoice-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .invoice-title h4 {
                    margin: 0;
                }
                .invoice-title div {
                    flex: 1;
                }
                .invoice-section {
                    border: 1px solid #cce7e8;
                    padding: 10px;
                    margin-bottom: 10px;
                }
                .invoice-logo {
                    max-width: 80px;
                    height: auto;
                    display: block;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }
                .bizum-logo {
                    max-width: 100px;
                    height: auto;
                    display: block;
                }
                .title-left, .title-right {
                    display: flex;
                    align-items: center;
                }
                .title-left img {
                    margin-right: 10px;
                }
            </style>
            <div class="invoice-card">
                <div class="invoice-title">
                    <div class="title-left">
                        <img src="${imgSrc2}" alt="Bizum Logo" class="bizum-logo">
                        <div id="main-title">
                            <h4>COMPROBANTE DE BIZUM</h4>
                            <span>Nº recibo: ${operacionEmisor._id}</span>
                            <br>
                            <span>Fecha: ${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    <img src="${imgSrc}" alt="The Bank Arlos Logo" class="invoice-logo">
                </div>
                <div class="invoice-section">
                    <strong>EMISOR</strong>
                    <p>IBAN: ${ibanEmisor}</p>
                    <p>Nombre: ${usuarioEmisor.nombre} ${usuarioEmisor.apellido1}</p>
                    <p>Num. teléfono: ${usuarioEmisor.telefono}</p>
                    <p>Dirección: ${usuarioEmisor.direccion}</p>
                </div>
                <div class="invoice-section">
                    <strong>RECEPTOR</strong>
                    <p>Nombre: ${usuarioReceptor.nombre} ${usuarioReceptor.apellido1}</p>
                    <p>Teléfono: ${telefonoReceptor}</p>
                </div>
                <div class="invoice-section">
                    <p><strong>CONCEPTO:</strong> ${concepto}</p>
                    <p>Pago: total/parcial</p>
                    <p><strong>CANTIDAD:</strong> ${cantidad}€</p>
                    <p><strong>MEDIO DE PAGO:</strong> Bizum</p>
                </div>
            </div>
            `;

            const options = { format: 'Letter' };

            pdf.create(html, options).toBuffer((err, buffer) => {
                if (err) {
                    console.error("Error al generar el PDF:", err);
                    return res.status(500).send("Error al generar el comprobante");
                }

                res.setHeader('Content-Disposition', 'attachment; filename="comprobante_bizum.pdf"');
                res.setHeader('Content-Type', 'application/pdf');
                res.send(buffer);
            });
        } else {
            // No se genera comprobante
            res.status(200).json({ mensaje: 'Transferencia Bizum realizada con éxito.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
}

const imgPath = './thebankarlos.png';
const imgBase64 = fs.readFileSync(imgPath, { encoding: 'base64' });
const imgSrc = `data:image/png;base64,${imgBase64}`;

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

        // Obtener información del usuario receptor
        const usuarioEmisor = await User.findById(cuentaEmisor.id_usuario);
        const usuarioReceptor = await User.findById(cuentaReceptor.id_usuario);

        if (!usuarioReceptor) {
            return res.status(404).json({ mensaje: 'Usuario receptor no encontrado.' });
        }

        // Enviar correo electrónico al usuario receptor
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Puedes usar cualquier servicio de correo compatible con Nodemailer
            auth: {
                user: 'polanskirichard513@gmail.com', // Tu correo electrónico
                pass: 'nuxu xanb qtgm anod' // Tu contraseña de correo electrónico
            }
        });

        const mailOptions = {
            from: 'polanskirichard513@gmail.com',
            to: usuarioReceptor.email,
            subject: 'Notificación de Bizum',
            text: `Estimado ${usuarioReceptor.nombre}.Has recibido una transferencia de ${cantidad}€ por parte de  IBAN ${ibanEmisor}.

            Concepto: ${concepto}

            Saludos,
            The Bank-Arlos`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                } else {
                    console.log('Correo enviado:', info.response);
                }
            });
     
            // Verificar si se debe generar un comprobante
            if (generarComprobante === "si") {
                // Generar y enviar comprobante PDF
                const html = `
                <style>
                body {
                    font-family: 'Roboto', sans-serif;
                    background-color: #ffffff;
                    margin: 0;
                    padding: 0;
                }
                
                .invoice-card {
                    border: 1px solid #cce7e8;
                    padding: 20px;
                    max-width: 600px;
                    margin: 20px auto;
                    position: relative;
                }
                
                .invoice-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }
                
                .invoice-title h4 {
                    margin: 0;
                }
                
                .invoice-title div {
                    flex: 1;
                }
                
                .invoice-details {
                    border: 1px solid #cce7e8;
                    padding: 10px;
                }
                
                .invoice-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                
                .invoice-table td {
                    padding: 8px;
                    border: 1px solid #cce7e8;
                }
                
                .invoice-section {
                    border: 1px solid #cce7e8;
                    padding: 10px;
                    margin-bottom: 10px;
                }
                
                .invoice-logo {
                    max-width: 80px;
                    height: auto;
                    display: block;
                    position: absolute;
                    top: 10px;
                    right: 10px;
                }
                </style>
                <div class="invoice-card">
                    <img src="${imgSrc}" alt="The Bank Arlos Logo" class="invoice-logo">
                    <div class="invoice-title">
                        <div id="main-title">
                            <h4>COMPROBANTE DE TRANSFERENCIA</h4>
                            <span>Nº recibo: ${operacionEmisor._id}</span>
                            <br>
                            <span>Fecha: ${new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="invoice-section">
                        <div>
                        <strong>EMISOR</strong>
                        <p>IBAN: ES ${ibanEmisor}</p>
                        <p>Nombre: ${usuarioEmisor.nombre}</p>
                        <p>Apellido 1: ${usuarioEmisor.apellido1}</p>
                        <p>Apellido 2: ${usuarioEmisor.apellido2}</p>
                        <p>Num. teléfono: ${usuarioEmisor.telefono}</p>
                        <p>Dirección: ${usuarioEmisor.direccion}</p>
                        </div>
                    </div>
                    <div class="invoice-section">
                        <div>
                            <strong>RECEPTOR</strong>
                            <p>IBAN: ES ${ibanReceptor}</p>
                            <p>Num. teléfono: ${usuarioReceptor.telefono}</p>
                        </div>
                    </div>
                    <div class="invoice-section">
                        <p><strong>CONCEPTO:</strong> ${concepto}</p>
                        <p>Pago: total/parcial</p>
                        <p><strong>CANTIDAD:</strong> ${cantidad}€</p>
                        <p><strong>MEDIO DE PAGO:</strong> Transferencia</p>
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
     
    async function sacarPorcentajes(req, res) {
        try {
            const { id_cuenta, porcentaje } = req.body;
    
            // Verificar si se proporcionó la ID de la cuenta y el porcentaje
            if (!id_cuenta || !porcentaje) {
                return res.status(400).json({ error: "Se debe proporcionar la ID de la cuenta y el porcentaje" });
            }
    
            // Obtener la cuenta por su ID
            const cuenta = await Cuenta.findById(id_cuenta);
    
            // Verificar si la cuenta existe
            if (!cuenta) {
                return res.status(404).json({ mensaje: 'La cuenta no existe.' });
            }
    
            // Calcular la cantidad a retirar
            let cantidad = (cuenta.saldo * (porcentaje / 100)).toFixed(2); // Redondear a dos decimales
            cantidad = parseFloat(cantidad); // Convertir de nuevo a número
    
            // Crear una nueva operación para retirar el porcentaje de la cuenta
            const operacion = new Operacion({
                nombre: `RETIRO ${porcentaje}%`,
                concepto: `Retiro del ${porcentaje}% del saldo`,
                cantidad: cantidad,
                id_cuenta: cuenta._id,
                tipo: 'retiro'
            });
    
            // Guardar la operación en la base de datos
            await operacion.save();
    
            // Actualizar el saldo de la cuenta
            cuenta.saldo -= cantidad;
            cuenta.saldo = parseFloat(cuenta.saldo.toFixed(2)); // Redondear a dos decimales y convertir a número
            await cuenta.save();
    
            // Enviar respuesta exitosa
            res.status(200).json({ mensaje: `Retirado el ${porcentaje}% del saldo de la cuenta.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error interno del servidor.' });
        }
    }
    
    
    module.exports = {
        sacarPorcentajes
    };
    


module.exports = { getOperacion, createOperacion ,getOperacionById, updateOperacion, deleteOperacion, getOperacionesByCuentaId,retirarDinero,transferirSaldo,sacarPorcentajes,enviarBizum}

