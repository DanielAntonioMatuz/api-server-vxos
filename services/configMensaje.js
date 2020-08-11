const nodemailer = require( 'nodemailer');

module.exports = (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'vxossoftware.dev@gmail.com', // Cambialo por tu email
            pass: 'Danieludo1' // Cambialo por tu password
        }
    });

    const mailOptions = {
        from: `"${formulario.nombre} 👻" <${formulario.email}>`,
        to: 'support@vxos-software.com.mx', // Cambia esta parte por el destinatario
        subject: formulario.asunto,
        html: `
           
            <strong>Nombre:</strong> ${formulario.nombre} <br/>
            <strong>E-mail:</strong> ${formulario.email}  <br/>
            <strong>Tipo Asistencia:</strong> ${formulario.asistencia} <br/>
            <strong>Ticket de soporte:</strong> ${formulario.ticket} <br/>
            <strong>Vigencia:</strong> ${formulario.vigencia} <br/>
            <strong>Mensaje:</strong> ${formulario.mensaje} <br/>

    `
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
}
