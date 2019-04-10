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
var MemoryStore = require('memorystore')(session)

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/EducacionContinua';
}
else {
	urlDB = 'mongodb+srv://pipe2310:Nodejs.2310@nodejs-pxdv8.mongodb.net/EducacionContinua?retryWrites=true'
}

process.env.URLDB = urlDB

const directoriopublico = path.join(__dirname, '../public')
const directoiopartial= path.join(__dirname, '../partials')
const dirNode_modules = path.join(__dirname,'../node_modules')
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
  	res.locals.nombre = req.session.nombre
  }
next()
})

app.set('view engine','hbs');

app.get('/',(req,res)=>{
	Curso.find({}).exec((err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
		if(err){
			return console.log(err)
		}
	res.render('index',{
		listado:respuesta
	});
	})
});

app.get('/aspirante',(req,res)=>{

		Curso.find({}).exec((err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
		
		if(err){
			return console.log(err)
		}
		Matricula.find({}).exec((err,respuestaa)=>{//entre las llaves condicion ejemplo ingles: 5
		
				if(err){
			return console.log(err)
		}
			Aspirante.find({}).exec((err,respuestaaa)=>{//entre las llaves condicion ejemplo ingles: 5
		
				if(err){
			return console.log(err)
		}


	res.render('aspirante',{
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

app.get('/usuario',(req,res)=>{
	res.render('usuario',{
		
	});
});

app.get('/actualizarcurso',(req,res)=>{
	res.render('actualizarcurso',{
		
	});
});
app.post('/calculos',(req,res)=>{
	console.log(req.query);

	let curso= new Curso({
		identificador: parseInt(req.body.id),
		nombre: req.body.nombre,
		descripcion: req.body.descripcion,
		valor: parseInt(req.body.valor),
		modalidad: req.body.modalidad,
		intensidad: req.body.intensidad,
		estado: 'Disponible'
	})
	curso.save((err,resultado)=>{
		if(err){
		res.render('calculos',{
		mostrarcurso: err
	})
		}
				Curso.find({}).exec((err,respuesta)=>{//entre las llaves condicion ejemplo ingles: 5
		
		if(err){
			return console.log(err)
		}
		res.render('calculos',{
		mostrarcurso: "Se ha guardado correctamente el curso  "+ resultado.nombre ,//or resultado.nombre etc
		listado: respuesta
	})
})
	})

});

app.post('/calculos2',(req,res)=>{
	console.log(req.query);
		let aspirante= new Aspirante({
		identificador: parseInt(req.body.id),
		nombre: req.body.nombre,
		correo: req.body.correo,
		telefono: parseInt(req.body.telefono),
	})
		aspirante.save((err,resultado)=>{
		if(err){
		res.render('calculos2',{
		mostraraspirante: err
	})
		}
		res.render('calculos2',{
		mostraraspirante: resultado//or resultado.nombre etc
	})
	})

});






app.post('/calculos3',(req,res)=>{
	console.log(req.query);
	var sw=false;
	console.log(req.body.documento)
	let documento=req.body.documento;

Aspirante.findOne({identificador: documento},(err,respuesta)=>{
	if(err){
		return console.log(err)
	}
	if(!respuesta){
		res.render('calculos3',{
		mostrarmatricula: "El documento de identidad ingresado no se encuentra registrado"//or resultado.nombre etc
	})
	}
	else{
		if(respuesta.identificador==parseInt(req.body.documento)){
	console.log(respuesta)
console.log("hola soy el identificador de la respuesta")
console.log(respuesta.identificador)
console.log("hola soy el identificador enviado")
console.log(req.body.documento)
			let matricula= new Matricula({
		idmatricula:parseInt(req.body.identificador)+''+parseInt(req.body.documento),
		idcurso: parseInt(req.body.identificador),
		idaspirante: parseInt(req.body.documento),
	})
		matricula.save((err,resultado)=>{
		if(err){
		res.render('calculos3',{
		mostrarmatricula: "Ya se ha matriculado previamente a este curso"
	})
		}
		if(!resultado){
			
		}else{
		res.render('calculos3',{
		mostrarmatricula: "Se ha matriculado correctamente al curso "+resultado.idcurso//or resultado.nombre etc
	})
	}
	})
	}else{
				res.render('calculos3',{
		mostrarmatricula: "no se encontro"//or resultado.nombre etc
	})
	}
	}

})

});

app.post('/calculos4',(req,res)=>{
	console.log(req.query);
	Curso.findOneAndUpdate({identificador:req.body.id},{$set: {estado:req.body.estado}},{new: true},(err,resultados)=>{
if(err){
	return console.log(err)
}
/*if(!usuario){
	return res.redirect('/')
}*/
res.render('calculos4',{
		mostraractualizar:	"Estado del curso "+resultados.nombre+" actualizado correctamente"
	});

})

});

app.post('/calculos5',(req,res)=>{
	console.log(req.query);
	res.render('calculos5',{
		id: parseInt(req.body.id)
	});
});

app.post('/calculos6',(req,res)=>{
	console.log(req.query);
	Matricula.findOneAndDelete({idmatricula:req.body.matricula},req.body,(err,resultados)=>{
		if(err){
			return console.log(err)
		}
		Matricula.find({idcurso: req.body.identificadorcurso},(err,respuesta)=>{
		Aspirante.find({}).exec((err,respuestaa)=>{
		  Curso.find({}).exec((err,respuestaaa)=>{
				res.render('calculos6',{
					matricula: resultados,
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

app.post('/calculos7',(req,res)=>{
	console.log(req.query);
	res.render('calculos7',{
		id: parseInt(req.body.id),
		cedula: parseInt(req.body.cedula),
		nombre: req.body.nombre
	});
});

app.post('/registro',(req,res)=>{
	res.render('registro',{

	});
});

app.post('/ingresar',(req,res)=>{
	res.render('ingresar',{

	});
});

app.post('/ingresar2',(req,res)=>{
	Usuario.findOne({identificador:parseInt(req.body.identificador)},(err,resultados)=>{
		if(err){
			return console.log(err)
		}
		if(!resultados){
			return	res.render('ingresar2',{
			mensaje: "Usuario no encontrado"
		})
			}
				if(!bcrypt.compareSync(req.body.password,resultados.password)){
									return	res.render('ingresar',{
			mensaje: "Contraseña no es correcta"
		})
		}
		req.session.usuario = resultados._id
		req.session.nombre = resultados.nombre
		req.session.tipo = resultados.tipo

		res.render('ingresar2',{
			mensaje: "Bienvenido"+ resultados.nombre, 
			sesion: true,
			nombre: req.session.nombre,
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

app.post('/registro2',(req,res)=>{
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
		res.render('registro2',{
		mostrarusuario: err
	})
		}
		res.render('registro2',{
		mostrarusuario: resultado//or resultado.nombre etc
	})
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