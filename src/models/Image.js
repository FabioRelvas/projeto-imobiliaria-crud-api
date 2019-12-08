module.exports = (sequelize, DataTypes) => {
	const Image = sequelize.define('imagens', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		filename: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	return Image;
};
