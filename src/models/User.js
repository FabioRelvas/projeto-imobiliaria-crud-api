var bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('users', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	// Verifica se a senha está correta
	User.prototype.comparePassword = function(password) {
		return bcrypt.compareSync(password, this.password);
	};

	// Hook para dar hash na senha antes de criar no banco de dados
	User.beforeCreate(user => {
		user.password = bcrypt.hashSync(
			user.password,
			bcrypt.genSaltSync(10),
			null
		);
	});

	return User;
};
