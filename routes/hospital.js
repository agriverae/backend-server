var express = require('express');

var app = express();

var Hospital = require('../models/hospital');

// =============================================
// Obtener todos los hospitales
// =============================================

app.get('/', (req, res, next) => {
    Hospital.find({}, 'nombre img usuario')
    .exec(
        (err, hospitales) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospital',
                    errors: err
                })
            }

            res.status(201).json({
                ok: true,
                hospitales
            })
    });
});

module.exports = app;