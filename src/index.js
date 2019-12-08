// dotenv deve ser chamado o quanto antes possível na aplicação
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

const db = require('./models');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const propRoutes = require('./routes/prop');
const mailerRoutes = require('./routes/mailer');

app.use(cookieParser());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//
app.use(cors({ origin: '*' }));

// Servir as imagens upadas pelo multer
app.use('/imagens', express.static('uploads'));

app.use(passport.initialize());

// Inserir as rotas
app.use('/', authRoutes);
app.use('/', propRoutes);
app.use('/', mailerRoutes);

// Servir o arquivo index.html do frontend para qualquer rota
// que não foi especificada anteriormente
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + process.env.FRONTEND_PATH));
});

db.sequelize.sync().then(function() {
	app.listen(3001, function() {
		console.log('API funcionando na porta 3001');
	});
});
