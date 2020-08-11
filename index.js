
const bodyParser = require("body-parser")

var bodyparser = require('body-parser');
var mongoose =  require('mongoose');
var port = process.env.PORT || 3800;
var express = require('express');

var user_routes = require('./routes/user');
var message_routes = require('./routes/message');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var geo_routes = require('./routes/geojson');
var app = express();
var configMensaje = require('./services/configMensaje');

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.set('origins', '*:*');

io.on('connection', function(socket){
    socket.on('save-message',function (new_msm) {
        io.emit('new-message',{message: new_msm});
    })

    socket.on('save-user', function(user){
        io.emit('new-user', {user:user});
    });

    socket.on('save-users',function(users){
        io.emit('new-users',{users})
    })

});

mongoose.connect('mongodb+srv://vxos:qJnDOLabdSjPPTWj@vxos-server-db.x1su3.mongodb.net/vxost?retryWrites=true&w=majority', (err)=> {  //Cambiar a la BD de Tlint
    if(err){
        throw err;
    } else {
        console.log('Conectado a la DB');
        server.listen(port, function(){
            console.log('Estado conectado al puerto ' + port);
        })
    }
});
var cors = require('cors')

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use(cors())

app.post('/formulario', (req, res) => {
    configMensaje(req.body);
    res.status(200).send();
})


//routes
app.use('/api', user_routes);
/*app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
app.use('/api', geo_routes);*/

//export
module.exports = app;
