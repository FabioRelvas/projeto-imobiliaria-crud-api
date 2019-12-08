const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	host: process.env.MAILER_HOST,
	port: process.env.MAILER_PORT,
	secure: false,
	auth: {
		user: process.env.MAILER_ACCOUNT_USER, // generated ethereal user
		pass: process.env.MAILER_ACCOUNT_PASSWORD, // generated ethereal password
	},
});

const sendEmail = (from, subject, html) => {
	return transporter.sendMail({
		from,
		to: process.env.MAILER_ACCOUNT_USER,
		subject,
		html,
	});
};

module.exports = sendEmail;
