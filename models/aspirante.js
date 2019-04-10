const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);
const aspiranteSchema = new Schema({
	identificador:{
		type: Number,
		require: true,
		unique: true
	},
	nombre:{
		type: String,
		require: true
	},
	correo:{
		type: String,
		require: true
	},
	telefono:{
		type: Number,
		require: true
	}			
});

const Aspirante = mongoose.model('Aspirante', aspiranteSchema);

module.exports = Aspirante