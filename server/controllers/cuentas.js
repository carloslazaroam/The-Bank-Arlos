// cuentasController.js

const { Cuenta } = require('../models/modelCuenta');
const nodemailer = require('nodemailer');
const { User } = require('../models/modelUser');


async function getCuentas(req, res) {
    try {
        const cuentas = await Cuenta.find({});
        res.send(cuentas);
    } catch (err) {
        console.error("Error al obtener las cuentas:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function getCuentaByIban(req,res) {
    try {
        const ibans = Cuenta.find({iban:req.params.iban})
        res.send(ibans)
    } catch (err) {
        console.log("Error al obtener el iban")
        res.status(500).send("Error interno del servidor")
    }
}



const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'polanskirichard513@gmail.com', 
        pass: 'nuxu xanb qtgm anod' 
    }
});


async function createCuenta(req, res) {
    try {
        // Crear una nueva cuenta con los datos recibidos en la solicitud
        const cuenta = new Cuenta({
            activa: false,
            iban: null, 
            nombre: req.body.nombre,
            validado: false,
            saldo: req.body.saldo,
            empresa: req.body.empresa,
            id_usuario: req.body.id_usuario,
            id_tipocuenta: req.body.id_tipocuenta
        });

        // Guardar la cuenta en la base de datos
        await cuenta.save();

        // Obtener el correo electrónico del usuario que creó la cuenta
        const usuario = await User.findById(req.body.id_usuario);
        const correoUsuario = usuario.email;

        // Verificar si se proporcionó un correo electrónico válido
        if (correoUsuario) {
            // Enviar correo electrónico al usuario que creó la cuenta
            await enviarCorreo(correoUsuario, 'Solicitud de cuenta creada', 'Su solicitud de: ' + cuenta.nombre + ' ha sido creada, espera a que un administrador valide tu cuenta.');
        }

        res.send(cuenta);
    } catch (err) {
        console.error("Error al postear cuenta:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function enviarCorreo(destinatario, asunto, cuerpo) {
    try {
        // Definir el contenido del correo electrónico
        const mailOptions = {
            from: 'polanskirichard513@gmail.com',
            to: destinatario,
            subject: asunto,
            text: cuerpo
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado');
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
    }
}





async function getCuentaByIban(req, res) {
    try {
        const cuenta = await Cuenta.find({ iban: req.params.iban });
        res.send(cuenta);
    } catch (err) {
        console.error("Error al obtener las cuentas:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function deleteCuenta(req,res){
    try{
        const id = req.params.id;
        await Cuenta.deleteMany({ id: id });
        res.send("cuenta eliminada correctamente");
    } catch (err) {
        console.log("No se pudo eliminar la cuenta")
        res.status(500).send("Error interno del servidor")
    }
}

async function updateCuenta(req, res) {
    try {
        const cuentaId = req.params.id;
        const updateData = req.body;
        const cuenta = await Cuenta.findOne({ id: cuentaId });

        
        if (!cuenta.validado && updateData.validado === true) {
           
            const updatedCuenta = await Cuenta.findOneAndUpdate({ id: cuentaId }, updateData, { new: true });

            // Enviar la notificación de email
            const usuario = await User.findById(updatedCuenta.id_usuario);
            const correoUsuario = usuario.email;
            const iban = updatedCuenta.iban;

            if (correoUsuario && iban) {
                const asunto = '¡Buenas noticias! Solicitud validada';
                const cuerpo = `Buenas noticias!!! Su solicitud ha sido validada, su nueva cuenta ya esta operativa. El IBAN de su cuenta es: ${iban}.`;
                await enviarCorreo(correoUsuario, asunto, cuerpo);
            }
            res.send(updatedCuenta);
        } else {
           
            const updatedCuenta = await Cuenta.findOneAndUpdate({ id: cuentaId }, updateData, { new: true });
            res.send(updatedCuenta);
        }
    } catch (err) {
        console.error("Error al actualizar el usuario:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function getCuentasByUserId(req, res) {
    try {
        const userId = req.params.id;
        const cuentas = await Cuenta.find({ id_usuario: userId });
        res.send(cuentas);
    } catch (err) {
        console.error("Error al obtener las cuentas del usuario:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function getEmpresas(req, res) {
    try {
        const empresas = await Cuenta.distinct("empresa");
        res.send(empresas);
    } catch (err) {
        console.error("Error al obtener las empresas:", err);
        res.status(500).send("Error interno del servidor");
    }
}

async function getCuentas2(req, res) {
    try {
        const cuentas = await Cuenta.find({}).populate('id_usuario', 'nombre apellido1 dni');
        console.log(cuentas); 
        res.send(cuentas);
    } catch (err) {
        console.error("Error al obtener las cuentas:", err);
        res.status(500).send("Error interno del servidor");
    }
}






module.exports = { getCuentas,getCuentaByIban, createCuenta,updateCuenta, deleteCuenta, getCuentasByUserId,getEmpresas,getCuentas2};

