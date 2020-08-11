'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    /*name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String,
    imageBackground: String,
    description: String,
    date: String,
    location: String,
    cellphone: String,
    estado: Boolean*/
    _id: String,
    nombre: String,
    email: String,
    estadoLicencia: String,
    act1: String,
    act2: String,
    act3: String,
    act4: String,
    vigencia: String,
    fechaActivacion: String,
    referencia: String,
    tipoLicencia: String


})

module.exports = mongoose.model('User', UserSchema);

