const router = require('express').Router();
const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils');

router.post('/email', function(req, res) {
	const data = req.body;
	const html = `
  <html>
    <body>
      <h4>Dados do Imóvel</h4>
      <p>Tipo de Imóvel: ${data.propType}</p>
      <p>ID do Imóvel: ${data.propId}</p>
			<a href="${data.propLink}">Link do Imóvel</a>
			
			<h4>Dados do Interessado</h4>
      <p>Nome: ${data.name}</p>
      <p>Email: ${data.email}</p>
			<p>Telefone: ${data.phone}</p>
			<p>Mensagem:</p>
			<p>${data.message}</p>
    </body>
  </html>
  `;

	sendEmail(
		`"${data.name}" ${data.email}`,
		`Informações sobre um(a) ${data.propType}`,
		html
	)
		.then(info => {
			if (info) {
				res.sendStatus(200);
				// console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			}
		})
		.catch(e => res.status(500).json(e));
});

module.exports = router;
