const sendEmail = require('./mailer');

// Middleware de checagem de autenticação
exports.isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) return next();
	else
		return res.status(401).json({
			error: 'Usuário não autenticado',
		});
};

// Obtém apenas os valores persistidos de um modelo do sequelize, ignorando qualquer outro membro do objeto
exports.getSanitizedProp = prop => {
	return { ...prop.dataValues };
};

exports.sendEmail = sendEmail;
