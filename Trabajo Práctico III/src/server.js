const  express = require('express');
const  dotenv = require('dotenv');

const home = require('./routes/home.routes.js');
const morgan = require('morgan');
const errorHandler = require("./middlewares/error.middleware.js");
const rutaTurnos = require("./routes/turnos.routes.js");
const rutaAdmin = require('./routes/admin.routes.js');
const rutaPacientes = require('./routes/pacientes.routes.js');

dotenv.config()

class Server {
  constructor (template=process.env.TEMPLATE || 'ejs') {
    this.app = express()
    this.port = process.env.PORT || 3001
    //this.cors()
    this.engine(template)
    this.app.use(express.json())
    this.rutas()
    this.middleware()
  }

/*   cors () {
    this.app.use(cors())
  } */

  engine (template) {
     try{
       require.resolve(template);
        
       this.app.set('view engine', template)
       this.app.set('views', './src/views/'+template)
     }catch (error) {
        console.log('Error al configurar el motor de plantillas:',template)
        
      }

  }
  middleware () {
    this.app.use(express.static('public'));
    this.app.use(morgan('dev'));
    this.app.use(errorHandler);
  }

  rutas () {
    this.app.use('/api/v1/pacientes', rutaPacientes)
    this.app.use('/api/v1/turnos', rutaTurnos)
    this.app.use('/api/v1/admin', rutaAdmin)
    this.app.use('/',home)
    // aca van las otras rutas

  }

  listen () {
    this.app.listen(this.port, () => {
      console.log(
        `Server running on port ${this.port}, host: ${process.env.HOST}:${this.port}`
      )
    })
  }
}

module.exports = Server