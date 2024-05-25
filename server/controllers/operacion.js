const { Operacion } = require('../models/modelOperacion');
const { Cuenta } = require('../models/modelCuenta');
const { User } = require('../models/modelUser');
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'polanskirichard513@gmail.com',
        pass: 'nuxu xanb qtgm anod'
    }
});

const imgPath = './thebankarlos.png';
const imgBase64 = fs.readFileSync(imgPath, { encoding: 'base64' });
const imgSrc = `data:image/png;base64,${imgBase64}`;

const handleError = (err, res, message = 'Error interno del servidor') => {
    console.error(message, err);
    res.status(500).send(message);
};

const getOperacion = async (req, res) => {
    try {
        const operaciones = await Operacion.find({});
        res.send(operaciones);
    } catch (err) {
        handleError(err, res, 'Error al obtener las operaciones');
    }
};

const getOperacionById = async (req, res) => {
    try {
        const operacion = await Operacion.findById(req.params.id);
        res.send(operacion);
    } catch (err) {
        handleError(err, res, 'No se ha obtenido la operación');
    }
};

const createOperacion = async (req, res) => {
    try {
        const { cantidad, nombre, concepto, id_cuenta, id_tipoOperacion, fecha } = req.body;
        const operacion = new Operacion({ cantidad, nombre, concepto, id_cuenta, id_tipoOperacion, fecha });
        await operacion.save();
        res.send(operacion);
    } catch (err) {
        handleError(err, res, 'Error al crear la operación');
    }
};

const updateOperacion = async (req, res) => {
    try {
        const updatedOperacion = await Operacion.findOneAndUpdate({ nombre: req.params.nombre }, req.body, { new: true });
        res.send(updatedOperacion);
    } catch (err) {
        handleError(err, res, 'Error al actualizar la operación');
    }
};

const deleteOperacion = async (req, res) => {
    try {
        await Operacion.deleteOne({ _id: req.params.id });
        res.send('Operación eliminada con éxito');
    } catch (err) {
        handleError(err, res, 'Error al eliminar la operación');
    }
};

const getOperacionesByCuentaId = async (req, res) => {
    try {
        const operaciones = await Operacion.find({ id_cuenta: req.params.id });
        res.send(operaciones);
    } catch (err) {
        handleError(err, res, 'Error al obtener las operaciones asociadas a la cuenta');
    }
};

const generarPDF = (htmlContent, fileName, res) => {
    const options = { format: 'Letter' };
    pdf.create(htmlContent, options).toFile(fileName, (err, result) => {
        if (err) {
            console.error("Error al generar el PDF:", err);
            res.status(500).send("Error al generar el comprobante");
        } else {
            res.download(result.filename, (err) => {
                if (err) {
                    console.error("Error al enviar el archivo al cliente:", err);
                    res.status(500).send("Error al enviar el comprobante al cliente");
                }
            });
        }
    });
};

const retirarDinero = async (req, res) => {
    try {
        const { cantidad, id_cuenta, nombre, concepto, tipo, fecha, generarComprobante } = req.body;
        const operacion = new Operacion({ cantidad, nombre, concepto, id_cuenta, tipo: 'retiro', fecha });

        await operacion.save();
        const cuenta = await Cuenta.findById(id_cuenta);
        cuenta.saldo -= parseFloat(cantidad);
        await cuenta.save();

        if (generarComprobante === "si") {
            const html = `...`;
            generarPDF(html, `comprobante_${operacion._id}.pdf`, res);
        } else {
            res.status(200).json({ message: "Dinero retirado exitosamente" });
        }
    } catch (err) {
        handleError(err, res, 'Error al retirar dinero de la cuenta');
    }
};

const enviarBizum = async (req, res) => {
    try {
        const { ibanEmisor, telefonoReceptor, cantidad, concepto, generarComprobante } = req.body;
        const cuentaEmisor = await Cuenta.findOne({ iban: ibanEmisor });
        const usuarioReceptor = await User.findOne({ telefono: telefonoReceptor });

        if (!cuentaEmisor || !usuarioReceptor) {
            return res.status(404).json({ mensaje: 'Cuenta o usuario receptor no encontrado.' });
        }

        const cuentasUsuarioReceptor = await Cuenta.find({ id_usuario: usuarioReceptor._id }).sort({ fechacreacion: 1 }).limit(1);
        const cuentaReceptor = cuentasUsuarioReceptor[0];

        if (cuentaEmisor.saldo < cantidad) {
            return res.status(400).json({ mensaje: 'Saldo insuficiente en la cuenta emisora.' });
        }

        cuentaEmisor.saldo -= parseFloat(cantidad);
        cuentaReceptor.saldo += parseFloat(cantidad);

        const operacionEmisor = new Operacion({ nombre: 'BIZUM ENVIADO', cantidad, concepto, id_cuenta: cuentaEmisor._id, tipo: 'retiro' });
        const operacionReceptor = new Operacion({ nombre: 'BIZUM RECIBIDO', cantidad, concepto: `(Bizum recibido por parte de ${ibanEmisor}) ${concepto}`, id_cuenta: cuentaReceptor._id, tipo: 'ingreso' });

        await operacionEmisor.save();
        await operacionReceptor.save();
        await cuentaEmisor.save();
        await cuentaReceptor.save();

        const usuarioEmisor = await User.findById(cuentaEmisor.id_usuario);

        const mailOptions = {
            from: 'polanskirichard513@gmail.com',
            to: usuarioReceptor.email,
            subject: 'Notificación de Bizum',
            text: `Has recibido un Bizum de ${cantidad}€ por parte de ${usuarioEmisor.nombre} ${usuarioEmisor.apellido1}.\n\nConcepto: ${concepto}\n\nSaludos,\nThe Bank-Arlos`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
            } else {
                console.log('Correo enviado:', info.response);
            }
        });

        if (generarComprobante === "si") {
            const imgPath2 = './bizum.png';
            const imgBase642 = fs.readFileSync(imgPath2, { encoding: 'base64' });
            const imgSrc2 = `data:image/png;base64,${imgBase642}`;
            const html = ` <style>
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
        </div>`;
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
            res.status(200).json({ mensaje: 'Transferencia Bizum realizada con éxito.' });
        }
    } catch (err) {
        handleError(err, res, 'Error al enviar Bizum');
    }
};

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
    getOperacion,
    getOperacionById,
    createOperacion,
    updateOperacion,
    deleteOperacion,
    getOperacionesByCuentaId,
    retirarDinero,
    enviarBizum,
    transferirSaldo,
    sacarPorcentajes
};
