'use strict'

var express = require('express');
var UseController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/users'});

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
var configMensaje = require('../services/configMensaje');


api.get('/home', UseController.home);
api.get('/pruebas', UseController.pruebas);
api.post('/register', md_auth.ensureAuth, UseController.saveUser);
api.post('/register-service', UseController.saveUserService);

api.post('/formulario', (req, res) => {
    configMensaje(req.body);
    res.status(200).send();
});

api.post('/login', UseController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UseController.updateUser);
api.get('/usuario/:id', UseController.get_user);
api.post('/search', UseController.searchUser);
api.get('/usuarios', md_auth.ensureAuth, UseController.get_users);
api.put('/usuario/editar/:id', path, UseController.editar_config);


module.exports = api;
