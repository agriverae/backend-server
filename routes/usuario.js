var express = require('express');

var app = express();

var Usuario = require('../models/usuario');

// =============================================
// Obtener todos los usuarios
// =============================================

app.get('/', (req,res,next) => {

    Usuario.find({}, 'nombre email img role')
    .exec(
        (err,usarios)=> {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuario',
                errores: err
            })
        }

        res.status(201).json({
            ok: true,
            usarios: usarios
        })
    }); 
});

// =============================================
// Crear un nuevo usuario
// =============================================
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {
        if(err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errores: err
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado
        })
    })

    
});

module.exports = app;