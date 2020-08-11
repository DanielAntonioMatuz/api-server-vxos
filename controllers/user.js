'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var UserService =  require('../models/userService');
var Follow = require('../models/follow');
var Publication =require('../models/publication');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
var Telegraf = require('telegraf');


const bot = new Telegraf('1287976320:AAGQkUCSPvdWfL6FY3a0XZ-ayXP_2I67UI4');

var band = false;
var email = false;
var name = false;
var licencia = false;
var user;
var idAsignement;
var rastreo = false;


//Métodos de pruebas
function home (req, res)  {
    res.status(200).send({
        message: 'Acción de pruebas en el servidor de NodeJS'
    });
}
 

function pruebas (req, res) {
    res.status(200).send({
        message: 'Acción de pruebas en el servidor de NodeJS'
    });
}

//Registro de Usuario
function saveUser(req,res){
    var params = req.body;
    var user = new User();

    if(params.nombre && params.email && params._id){
        user.nombre = params.nombre;
        user.email = params.email;
        user.estadoLicencia = params.estadoLicencia;
        user.act1 = null;
        user.act2 = null;
        user.act3 = null;
        user.act4 = null;
        user.vigencia = null;
        user.fechaActivacion = null;
        user.referencia = params.referencia;
        user._id = params._id;
        user.tipoLicencia = params.tipoLicencia;


        User.find({
            $or: [
                {email: user.email.toLowerCase()},
                {referencia: user.referencia.toLowerCase()},
                {_id: user._id.toLowerCase()}
            ]
        }).exec((err, users) => {
            if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'});

            if(users && users.length >= 1){
                return res.status(200).send({message: 'El usuario que intenta registrar ya existe'})
            } else {
                //Cifrar contrasena
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'})

                        if(userStored){
                            res.status(200).send({user: userStored });
                        } else {
                            res.status(404).send({message: 'No se ha registrado el usuario'})
                        }
                    });
                });

            }
        })



    } else {
        res.status(200).send({
            message: "Envia todos los campos necesarios"
        });
    }
}


//Registro de Usuario
function saveUserService(req,res){
    var params = req.body;
    var user = new UserService();
    console.log(user);
    if(params.name && params.surname && params.email && params.password){
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.image = null;
        user.cellphone = params.cellphone;

        UserService.find({
            $or: [
                {email: user.email.toLowerCase()},
            ]
        }).exec((err, users) => {
            if(err) return res.status(500).send({message: 'Error en la peticion de usuarios'});

            if(users && users.length >= 1){
                return res.status(200).send({message: 'El usuario que intenta registrar ya existe'})
            } else {
                //Cifrar contrasena
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'})

                        if(userStored){
                            res.status(200).send({user: userStored });
                        } else {
                            res.status(404).send({message: 'No se ha registrado el usuario'})
                        }
                    });
                });

            }
        })


    } else {
        res.status(200).send({
            message: "Envia todos los campos necesarios"
        });
    }
}


//Loging Usuario
function loginUser(req, res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    UserService.findOne({email: email}, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(user){
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    if(params.gettoken){
                        //devolver y Generar token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        //devolver datos del usuario
                        user.password = undefined;

                        return res.status(200).send({user})
                    }
                    
                } else {
                    return res.status(404).send({message: 'El usuario no se ha podido identificar'});
                }
            });
        } else {
            return res.status(404).send({message: 'El usuario no se ha podido identifcar en el servidor'})
        }
    })

}

//Actualizar los datos del usuario
function updateUser(req, res) {
    const id = req.params.id;
    const data = req.body;
    console.log(data.fechaActivacion);

    console.log('IV');
    User.findByIdAndUpdate(id, {
        estadoLicencia: data.estadoLicencia,
        act1: data.act1,
        act2: data.act2,
        act3: data.act3,
        act4: data.act4,
        vigencia: data.vigencia,
        fechaActivacion: data.fechaActivacion,
        email: data.email,
        nombre: data.nombre,
        tipoLicencia: data.tipoLicencia
    }, (err, user_data) => {
        if (user_data) {
            res.status(200).send({user: user_data});
        }
    });

}


function editar_config(req, res){
    var id = req.params['id'];
    var data = req.body;
    console.log(data);
    console.log('IV');
        User.findByIdAndUpdate(id, {nombre: data.nombre, email: data.email , estadoLicencia: data.estadoLicencia
            ,act1: data.act1, act2: data.act2, act3: data.act3, act4: data.act4, vigencia: data.vigencia, fechaActivacion: data.fechaActivacion,
            referencia: data.referencia, tipoLicencia: data.tipoLicencia
        }, (err, user_data)=>{
            if(user_data){
                res.status(200).send({user:user_data});
            }
        });

}

function get_user(req, res){
    let id = req.params['id'];

    User.findById(id, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(user){
                res.status(200).send({user:user});
            } else {
                res.status(500).send({message:'No existe un usuario con ese ID'});
            }
        }
    })
}

function get_users(req, res){
    let data;
    User.find((err,users)=> {
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(users){
                res.status(200).send({users: users});
            } else {
                res.status(500).send({message: 'No existe ningun usuario'});
            }
        }
    });

}

function searchUser(req, res){
    var params = req.body;
    console.log({ "$regex": "^" + req.body.email });
    User.find({email: { "$regex": "^" + req.body.email }}, (err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(user){
            console.log({user})
            return res.status(200).send({search: user})


        } else {
            return res.status(404).send({message: 'El usuario no se ha podido identifcar en el servidor'})
        }
    })
}




bot.start((ctx) => {
    ctx.reply('Bienvenido a VxOS Bot, soy el asistente para ayudarte a registrar a tus clientes y poder aplicar las licencias, si deseas registrar inmediatamente, escribe "registrar", si quieres ver el menu, presiona /menu o escribelo, es un gusto ayudarte');
});

bot.help((ctx) => {
    ctx.reply('Si deseas asistencia personalizada, contactanos en: support@vxos-software.com.mx');
});

bot.settings((ctx) => {
    ctx.reply('Settings');
});

bot.command(['menu'], (ctx)=> {
    ctx.reply('Este es el menu de VxOS Bot, con esto puedo ayudarte:');
    ctx.reply('/registrar : Para registrar un nuevo usuario para aplicarle una licencia');
    ctx.reply('/menu : Para visualizar este menu');
    ctx.reply('/help : para solicitar el correo de soporte de VxOS');
    ctx.reply('/rastreo : para verificar el estatus de mi licencia o alguna licencia a través del código de rastreo');

})

bot.command(['rastreo'], (ctx)=> {
    ctx.reply('Rastrearemos el estatus de tu licencia, por favor, ingrese su ID de rastreo de 5 dígitos: ');
    rastreo = true;
})

bot.hears(['registrar', '/registrar'], ctx => {
    //console.log(ctx.message.text)
    band = true;
    var valueID;
    User.find((err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(user){
            idAsignement = user[0]._id;
            //console.log(user[0]._id)
            //console.log(parseInt(user[0]._id.substr(1, 4)) + 1);
            valueID = parseInt(user[0]._id.substr(1, 4)) + 1;
            idAsignement =  'a' + valueID;
            //console.log(idAsignement)
            //return res.status(200).send({search: user})


        } else {
            console.log('NOK')
            return res.status(404).send({message: 'El usuario no se ha podido identifcar en el servidor'})
        }
    }).sort({$natural:-1}).limit(1);
    ctx.reply('Hola ' + ctx.message.from.first_name + ' ,comprendido, dime el email del usuario, el nombre del usuario, el tipo de licencia a registrar, todo separado por comas, ejemplo: example@example.com, Rodriguez Alvarez, Licencia Photoshop')
})

bot.hears(['si', 'SI', 'sI', 'Si'], ctx => {
    if(name == true){
        var userRegister = new User();

        userRegister.nombre = user[1];
        userRegister.email = user[0];
        userRegister.estadoLicencia = '';
        userRegister.act1 = null;
        userRegister.act2 = null;
        userRegister.act3 = null;
        userRegister.act4 = null;
        userRegister.vigencia = null;
        userRegister.fechaActivacion = null;
        userRegister.referencia = idAsignement;
        userRegister._id = idAsignement;
        userRegister.tipoLicencia = user[2];


        User.find({
            $or: [
                {email: user[0]}
            ]
        }).exec((err, users) => {
            if(err) {
                ctx.reply('Hubo un error en la validación de usuarios');
                //return res.status(500).send({message: 'Error en la peticion de usuarios'});
            }

            if(users && users.length >= 1){
                ctx.reply('El usuario que intenta registrar ya existe');
                //return res.status(200).send({message: 'El usuario que intenta registrar ya existe'})
            } else {

                userRegister.save((err, userStored) => {
                    //if(err) console.log(err); ctx.reply('Hubo un error en la validación de usuarios');

                    if(userStored){
                        ctx.reply('El usuario: ' + user[1] +', con email: ' + user[0] + ', y tipo de licencia: ' + user[2] + '  ha sido capturado de forma correcta, en 24 horas, la aplicacion de la licencia estará activa' );
                        ctx.reply('Puede hacer el seguimiento del estatus de la licencia del usuario y servicio de soporte en: http://localhost:4200/ con el número de rastreo:' + idAsignement )
                        ctx.reply('Si desea registrar otro usuario, escriba "registrar", o bien, regresar al menu al escribir /menu , sino desea nada más, esto seria todo, que pase buen día ' );
                        //res.status(200).send({user: userStored });
                    } else {
                        ctx.reply('No se ha podido registrar el usuario')
                       // res.status(404).send({message: 'No se ha registrado el usuario'})
                    }
                });

            }
        })



        licencia = true;
    } else {
        ctx.reply('Lo siento, no puedo comprender lo que escribiste, intentalo de nuevo')
    }
})

bot.hears(['no', 'NO', 'nO', 'No'], ctx => {
    band = false;
    email = false;
    name = false;
    licencia = false;
    user  = '';
    ctx.reply('Comprendido, dime el email del usuario, el nombre del usuario, el tipo de licencia a registrar, todo separado por comas, ejemplo: example@example.com, Rodriguez Alvarez, Licencia Photoshop')
})

bot.on('text', ctx => {
    if(band == true){
        email = true;
    } else {
        if(rastreo == true){

        } else {
            ctx.reply('Lo siento, no puedo comprender lo que escribiste, intentalo de nuevo')
        }
    }

    if(email == true){
        user = ctx.message.text;
        user = user.split(',');
        console.log(user);
        ctx.reply('El usuario: ' + user[1] +', con email: ' + user[0] + ', y tipo de licencia: ' + user[2] + '  ha sido capturado')
        ctx.reply('¿Es correcto? (escriba SI o NO)')
        name = true;

    } else {
        if(rastreo == true){

        } else {
            ctx.reply('Lo siento, no puedo comprender lo que escribiste, intentalo de nuevo')
        }
    }

    if(rastreo == true){
        ctx.reply('Lo estamos localizando')
        console.log(ctx.message.text)
        User.findOne({_id:  ctx.message.text }, (err, user) => {
            if(err) return ctx.reply('Error en la solicitud, intentelo más tarde');

            if(user){
                console.log(user.estadoLicencia)
                ctx.reply('El estado de su licencia es: ' + user.estadoLicencia + ' , el tipo de licencia adquirido es: ' + user.tipoLicencia)
                ctx.reply('Presione: /menu para volver al menu del Bot')
                //return res.status(200).send({search: user})

            } else {
                return ctx.reply('El usuario no existe en nuestros registros');
            }
        })


    } else {
        ctx.reply('Lo siento, no puedo comprender lo que escribiste, intentalo de nuevo')
    }



})


bot.launch();



module.exports = {
    home,
    pruebas,
    saveUser,
    get_user,
    updateUser,
    get_users,
    saveUserService,
    loginUser,
    editar_config,
    searchUser
}
