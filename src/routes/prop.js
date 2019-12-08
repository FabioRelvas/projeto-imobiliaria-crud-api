const router = require('express').Router();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const db = require('../models');
const { getSanitizedProp } = require('../utils');
const withAuth = require('./middlewares');

const storage = multer.diskStorage({
	destination: process.env.IMAGE_UPLOAD_DIR,
	filename: function(req, file, cb) {
		crypto.pseudoRandomBytes(16, function(err, raw) {
			if (err) return cb(err);

			cb(null, raw.toString('hex') + path.extname(file.originalname));
		});
	},
});

const upload = multer({ storage: storage });

// todo: offset e limit
router.get('/imoveis', async function(req, res) {
	const props = [];
	try {
		const properties = await db.props.findAll({
			limit: parseInt(req.query.limit) || 8,
			include: { model: db.imagens },
		});

		properties.map((prop, _) => props.push(getSanitizedProp(prop)));
	} catch (e) {
		console.warn(e);
		res.status(500).json(e);
	}

	res.json(props);
});

router.get('/imovel/:id', async function(req, res) {
	try {
		const property = await db.props.findOne({
			where: { id: req.params.id },
			include: { model: db.imagens },
		});
		if (property === null) {
			res.sendStatus(404);
		}

		res.json(getSanitizedProp(property));
	} catch (e) {
		res.status(404).json(e);
	}
});

router.post('/imovel', [withAuth, upload.array('imagens')], function(req, res) {
	const propData = { ...req.body, disponibilidade: true, imagens: [] };

	req.files.map(file => {
		propData.imagens.push({ filename: file.filename });
	});
	db.props
		.create(propData, { include: [db.imagens] })
		.then(property => res.status(201).json(property))
		.catch(e => {
			res.status(500).json(e);
		});
});

router.put('/imovel/:id', [withAuth, upload.array('imagens')], async function(
	req,
	res
) {
	if (!req.params.id) {
		return res.status(500).json({ message: 'ID inválido' });
	}

	const propData = { ...req.body };

	db.props
		.update(propData, { where: { id: req.params.id } })
		.then(prop => {
			// prop deveria ser o objeto atualizado, mas na verdade é o número de linhas alteradas
			// tem que ser 0 (falha, id não existe), ou 1 (sucesso)
			if (!prop) {
				res
					.status(500)
					.send('Falha ao salvar novas informações, cheque os dados inseridos');
			}
			res.status(200).json(prop);
		})
		.catch(e => res.status(500).json(e));
});

router.delete('/imovel', withAuth, function(req, res) {
	console.log(req.body);
	db.props
		.destroy({ where: { id: req.body.id } })
		.then(rows => {
			if (rows < 1) {
				res.sendStatus(500);
			}

			res.sendStatus(200);
		})
		.catch(e => res.status(500).json(e));
});

router.post('/busca', function(req, res) {
	console.log(req.body);
	db.sequelize
		.query(
			'SELECT * FROM props WHERE disponibilidade = 1 AND MATCH (endereco) AGAINST(?)',
			{
				replacements: [req.body.searchText],
				type: db.sequelize.QueryTypes.SELECT,
			}
		)
		.then(result => {
			console.log(result);
			if (!result) {
				return res.sendStatus(404);
			}

			const props = [];

			Promise.all(
				result.map(prop =>
					db.imagens.findAll({ where: { propId: prop.id }, raw: true })
				)
			)
				.then(images => {
					result.map(prop => {
						props.push({
							...prop,
							imagens: images
								.map(imgs => imgs.filter(image => image.propId === prop.id))
								.filter(img => img.length > 0)[0],
						});
					});
					return res.json(props);
				})
				.catch(e => console.log(e));
		})
		.catch(e => {
			console.log(e);
			res.status(500).json(e);
		});
});

module.exports = router;
