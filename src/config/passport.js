const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		function(email, password, done) {
			db.users
				.findOne({
					where: {
						email: email,
					},
				})
				.then(function(dbUser) {
					// numa aplicação real só mandaríamos para o cliente um erro dizendo que o login ou senha estão incorretos
					// sem especificar qual
					if (!dbUser) {
						return done(null, false, {
							message: 'Email inválido',
						});
					} else if (!dbUser.comparePassword(password)) {
						return done(null, false, {
							message: 'Senha incorreta',
						});
					}
					const user = {
						id: dbUser.id,
						email: dbUser.email,
					};

					return done(null, user);
				});
		}
	)
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

module.exports = passport;
