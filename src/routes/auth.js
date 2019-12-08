const router = require('express').Router();
const jwt = require('jsonwebtoken');
const db = require('../models');
const passport = require('../config/passport');
const withAuth = require('./middlewares');

router.post('/registrar', async function(req, res) {
	try {
		const user = await db.users.findOne({ where: { email: req.body.email } });
		if (!user) {
			const user = await db.users.create({
				email: req.body.email,
				password: req.body.password,
			});
			if (user) {
				res.sendStatus(201);
			} else {
				res.sendStatus(500);
			}
		}
	} catch (err) {
		res.sendStatus(500);
	}
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local', (err, user, info) => {
		if (err || !user) {
			return res.status(400).json({
				message: info ? info.message : 'Falha ao logar',
				user: user,
			});
		}

		req.login(user, err => {
			if (err) {
				res.status(500).json(err);
			}
			const token = jwt.sign({ user }, process.env.SECRET);
			res
				.cookie('token', token, { secure: false })
				.status(200)
				.json({ user, token });
		});
	})(req, res);
});

router.get('/sair', withAuth, function(req, res) {
	res.clearCookie('token').redirect('/');
});

router.get('/authCheck', withAuth, function(req, res) {
	res.sendStatus(200);
});

module.exports = router;
