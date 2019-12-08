const jwt = require('jsonwebtoken');

const withAuth = function(req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		res.status(401).send('Não Autorizado: Nenhum token foi passado');
	} else {
		jwt.verify(token, process.env.SECRET, function(err, decoded) {
			if (err) {
				res.status(401).send('Não Autorizado: Token Inválido');
			} else {
				req.user = decoded.user;
				next();
			}
		});
	}
};

module.exports = withAuth;
