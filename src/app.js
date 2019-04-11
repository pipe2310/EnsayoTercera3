const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser')
require('./helpers');
const mongoose = require('mongoose');
const Curso = require ('../models/curso')
const Aspirante = require ('../models/aspirante')
const Matricula = require ('../models/matricula')
const Usuario = require ('../models/usuario')
const bcrypt = require('bcrypt');
const session = require('express-session')
const directoriopublico = path.join(__dirname, '../public')
const directoiopartial= path.join(__dirname, '../partials')
const dirNode_modules = path.join(__dirname,'../node_modules')
var MemoryStore = require('memorystore')(session)

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
	if (process.env.NODE_ENV === 'local'){
		urlDB = 'mongodb://localhost:27017/EducacionContinua';
	}
	else{
		urlDB = 'mongodb+srv://pipe2310:Nodejs.2310@nodejs-pxdv8.mongodb.net/EducacionContinua?retryWrites=true'
	}

process.env.URLDB = urlDB

app.use(express.static(directoriopublico));
app.use('/css',express.static(dirNode_modules+'/bootstrap/dist/css'));
app.use('/js',express.static(dirNode_modules+'/jquery/dist'));
app.use('/js',express.static(dirNode_modules+'/popper.js/dist'));
app.use('/js',express.static(dirNode_modules+'/bootstrap/dist/js'));
hbs.registerPartials(directoiopartial);
app.use(bodyParser.urlencoded({extended:false}));

app.use(session({
  cookie: { maxAge: 86400000 },
  store: new MemoryStore({
  checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use((req,res,next)=>{
  if(req.session.usuario){
  	res.locals.sesion = true
  	res.locals.nombre = req.session.nombre.toUpperCase();
  	res.locals.identificador = req.session.identificador
  	//res.locals.tipo = req.session.tipo
  }
  if(req.session.tipo=="Coordinador"){
  	res.locals.coordinador = true
  }
  if(req.session.tipo=="Aspirante"){
  	res.locals.aspirante = true
  }
  
next()
})

app.set('view engine','hbs');

app.get('/interesado',(req,res)=>{

	Curso.find({}).exec((err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
		if(err){
			return console.log(err)
		}
		res.render('interesado',{
			listado:respuesta
		});
	})

});

app.get('/coordinador',(req,res)=>{

	Curso.find({}).exec((err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
		if(err){
			return console.log(err)
		}
		Matricula.find({}).exec((err,respuestaa)=>{//entre las llaves condicion ejemplo ingles: 5
			if(err){
				return console.log(err)
			}
			Usuario.find({}).exec((err,respuestaaa)=>{//entre las llaves condicion ejemplo ingles: 5
				if(err){
					return console.log(err)
				}
				res.render('coordinador',{
					listado:respuesta,
					listadoo: respuestaa,
					listadooo:respuestaaa
				});

			})
		})
	})

});

app.get('/matricula',(req,res)=>{

	Curso.find({}).exec((err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
		if(err){
			return console.log(err)
		}
		res.render('matricula',{
			listado:respuesta
		});
	})

});

app.get('/ensayo',(req,res)=>{
	res.render('ensayo',{
		
	});
});

app.get('/cursos',(req,res)=>{
	res.render('cursos',{
		
	});
});

app.get('/inscripciones',(req,res)=>{
	Curso.find({}).exec((err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
		if(err){
			return console.log(err)
		}
		Matricula.find({}).exec((err,respuestaa)=>{//entre las llaves condicion ejemplo ingles: 5
			if(err){
				return console.log(err)
			}
			Usuario.find({}).exec((err,respuestaaa)=>{//entre las llaves condicion ejemplo ingles: 5
				if(err){
					return console.log(err)
				}
				res.render('inscripciones',{
					listado:respuesta,
					listadoo: respuestaa,
					listadooo:respuestaaa
				});

			})
		})
	})
});

app.get('/aspirante',(req,res)=>{
	res.render('aspirante',{
		
	});
});

app.get('/',(req,res)=>{
	res.render('index',{
		
	});
});

app.get('/usuario',(req,res)=>{
	res.render('usuario',{
		
	});
});

app.get('/actualizarcurso',(req,res)=>{
	res.render('actualizarcurso',{
		
	});
});

app.post('/registrocursos',(req,res)=>{
let lista;
	let curso= new Curso({
		identificador: parseInt(req.body.id),
		nombre: req.body.nombre,
		descripcion: req.body.descripcion,
		valor: parseInt(req.body.valor),
		modalidad: req.body.modalidad,
		intensidad: req.body.intensidad,
		estado: 'Disponible'
	})
		Curso.find({}).exec((err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
			if(err){
				return console.log(err)
			}
			if(respuesta){
				lista=respuesta;	
			}
		})
	curso.save((err,resultado)=>{
		if(err){
			res.render('registrocursos',{
			mostrarcurso: "El identificador del curso ingresado se ha registrado previamente",
			listado:lista
			})
		}
		Curso.find({}).exec((err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
			if(err){
				return console.log(err)
			}
			if(resultado){
				res.render('registrocursos',{
					mostrarcurso: "Se ha guardado correctamente el curso  "+ resultado.nombre ,//or resultado.nombre etc
					listado: respuesta
				})		
			}
		})
	})

});

app.post('/registroaspirante',(req,res)=>{

		let aspirante= new Aspirante({
		identificador: parseInt(req.body.id),
		nombre: req.body.nombre,
		correo: req.body.correo,
		telefono: parseInt(req.body.telefono),
		})

		aspirante.save((err,resultado)=>{
			if(err){
				res.render('registroaspirante',{
				mostraraspirante: err
				})
			}
			res.render('registroaspirante',{
				mostraraspirante: resultado//or resultado.nombre etc
			})
		})

});

app.post('/registromatricula',(req,res)=>{
var sw=false;
let documento=req.body.documento;

	Usuario.findOne({identificador: documento},(err,respuesta)=>{
		if(err){
			return console.log(err)
		}
		if(!respuesta){
			res.render('registromatricula',{
				mostrarmatricula: "El documento de identidad ingresado no se encuentra registrado"//or resultado.nombre etc
			})
		}	
		else{
			if(respuesta.identificador==parseInt(req.body.documento)){
				let matricula= new Matricula({
				idmatricula:parseInt(req.body.identificador)+''+parseInt(req.body.documento),
				idcurso: parseInt(req.body.identificador),
				idaspirante: parseInt(req.body.documento),
				})
				matricula.save((err,resultado)=>{
					if(err){
						res.render('registromatricula',{
						mostrarmatricula: "Ya se ha matriculado previamente a este curso"
						})
					}
					if(!resultado){
					}
					else{
				Curso.findOne({identificador: parseInt(resultado.idcurso)},(err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
					if(err){
						return console.log(err)
					}
					

		
						res.render('registromatricula',{
						mostrarmatricula: "Se ha matriculado correctamente al curso "+respuesta.nombre+' el cual tiene un valor de '+respuesta.valor+' COP' //or resultado.nombre etc
						})
						})
					}
				})
			}
			else{
				res.render('registromatricula',{
					mostrarmatricula: "no se encontro"//or resultado.nombre etc
				})
			}
		}

	})

});

app.post('/actualizacionestado',(req,res)=>{

	Curso.findOneAndUpdate({identificador:req.body.id},{$set: {estado:req.body.estado}},{new: true},(err,resultados)=>{
		if(err){
			return console.log(err)
		}
		/*if(!usuario){
			return res.redirect('/')
		}*/
		res.render('actualizacionestado',{
			mostraractualizar:	"Estado del curso "+resultados.nombre+" actualizado correctamente"
		});
	})

});

app.post('/eliminacionmatricula',(req,res)=>{

	Matricula.findOneAndDelete({idmatricula:req.body.matricula},req.body,(err,resultados)=>{
		if(err){
			return console.log(err)
		}
		Matricula.find({idcurso: req.body.identificadorcurso},(err,respuesta)=>{
			Usuario.find({}).exec((err,respuestaa)=>{
		  		Curso.find({}).exec((err,respuestaaa)=>{
					res.render('eliminacionmatricula',{
						matricula: "Inscripción eliminada correctamente",
						matriculaa: respuesta,
						listado: respuestaaa,
						listadoo:respuestaa,
						identificador:req.body.identificadorcurso,
						documento:req.body.identificador
					})
		 	 	})
			})
	  	})
	})

});

app.post('/usuario',(req,res)=>{
	res.render('usuario',{

	});
});

app.post('/iniciodesesion',(req,res)=>{
	res.render('iniciodesesion',{

	});
});

app.get('/iniciodesesion',(req,res)=>{
	res.render('iniciodesesion',{

	});
});

app.post('/ingresar2',(req,res)=>{
let sw=false;
let sww=false;
	Usuario.findOne({identificador:parseInt(req.body.identificador)},(err,resultados)=>{
		if(err){
			return console.log(err)
		}
		if(!resultados){
			return	res.render('ingresar2',{
						mensaje: "El usuario no es válido"
					})
		}
		if(!bcrypt.compareSync(req.body.password,resultados.password)){
			return	res.render('ingresar2',{
				mensaje: "La contraseña no es válida"
			})
		}

		req.session.usuario = resultados._id
		req.session.identificador = resultados.identificador
		req.session.nombre = resultados.nombre
		req.session.tipo = resultados.tipo

		if(resultados.tipo=='Coordinador')
			sw=true;

		if(resultados.tipo=='Aspirante')
			sww=true;
		
		res.render('ingresar2',{
			mensaje: "Bienvenido "+ resultados.nombre.toUpperCase(), 
			sesion: true,
			coordinador: sw,
			aspirante: sww,
			nombre: req.session.nombre.toUpperCase(),
			mensajee:req.session.usuario,
			mensajeee:req.session.tipo
		})
	})
});

app.get('*',(req,res)=>{
	res.render('error',{
		estudiante: 'error'
	})
})

app.post('/registrousuario',(req,res)=>{
	let usuario= new Usuario({
		identificador: parseInt(req.body.id),
		nombre: req.body.nombre,
		correo: req.body.correo,
		telefono: parseInt(req.body.telefono),
		password:bcrypt.hashSync(req.body.password, 10),
		tipo: "Aspirante"
	})
	usuario.save((err,resultado)=>{
		if(err){
			return res.render('registrousuario',{
			mostrarusuario: 'El documento de identidad ingresado se ha registrado previamente'
			})
		}
		if(!resultado){
			res.render('registrousuario',{
			mostrarusuario: 'El documento de identidad ingresado se ha registrado previamente'
			})
					}
					else{
		res.render('registrousuario',{
			mostrarusuario:'El documento de identidad '+ resultado.identificador +' se ha registrado correctamente'//or resultado.nombre etc
		})
}
	})

});

app.post('/salir',(req,res)=>{

	req.session.destroy((err)=>{
		if(err) return console.log(err)
	})
	res.redirect('/')
})

/*mongoose.connect('mongodb://localhost:27017/EducacionContinua',{useNewUrlParser: true},(err,resultado)=>{
	if(err){
		return console.log(error)
	}
	console.log("conectado")
});*/

mongoose.connect(process.env.URLDB,{useNewUrlParser: true},(err,resultado)=>{
	if(err){
		return console.log(error)
	}
	console.log("conectado")
});

/*app.listen(3000,()=>{
console.log('escuchando en el puerto 3000')

});*/

app.listen(process.env.PORT,()=>{
console.log('servidor en el puerto ' + process.env.PORT)
});