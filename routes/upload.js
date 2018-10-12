var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');

app.use(fileUpload());

app.put('/:tipo/:id', (req,res,next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colleción
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    
    if( tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colleción no es válida',
            errors: { message: 'Tipo de colleción no es válida'}
        });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe seleccionar una imagen'}
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length-1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {
        if(err){
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if(tipo === 'usuarios'){
        Usuario.findById(id, (err, usuario) => {

            if(!usuario){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe'}
                });
            }

            // Si existe, elimina la imagen anterior
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save( (err,usuarioActualizado) => {

                usuarioActualizado.password = '=)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuarioActualizado: usuarioActualizado
                });
            })

        })
    }
    if(tipo === 'medicos'){
        Medico.findById(id, (err, medico) => {

            if(!medico){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe'}
                });
            }

            // Si existe, elimina la imagen anterior
            var pathViejo = './uploads/medicos/' + medico.img;
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            medico.img = nombreArchivo;

            medico.save( (err,medicoActualizado) => {

                medicoActualizado.password = '=)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medicoActualizado: medicoActualizado
                });
            })

        })
    }
    if(tipo === 'hospitales'){
        Hospital.findById(id, (err, hospital) => {

            if(!hospital){
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hsospital no existe'}
                });
            }

            // Si existe, elimina la imagen anterior
            var pathViejo = './uploads/hospitals/' + hospital.img;
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save( (err,hospitalActualizado) => {

                hospitalActualizado.password = '=)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospitalActualizado: hospitalActualizado
                });
            })

        })
    }
}

module.exports = app;