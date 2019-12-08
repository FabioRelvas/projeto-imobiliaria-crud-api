module.exports = (sequelize, DataTypes) => {
	const Property = sequelize.define(
		'props',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			tipo: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			aluguel: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			quartos: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			tamanho: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			garagem: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			endereco: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			descricao: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			disponibilidade: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
		},
		{
			indexes: [{ type: 'FULLTEXT', name: 'search_idx', fields: ['endereco'] }],
		}
	);

	Property.associate = models => {
		Property.hasMany(models.imagens);
	};

	return Property;
};
