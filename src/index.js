//*importacion
import express from 'express';
import ms from 'ms';
import cors from 'cors';
import { contactos } from './routes/contactos.routes.js';
import { productos } from './routes/productos.routes.js';
import { fases } from './routes/fases.routes.js';
import { municipios } from './routes/municipios.routes.js';
import { eventos } from './routes/eventos.routes.js';
import { dir_verde_router } from './routes/dir_verde.routes.js';
import { grupos } from './routes/grupos.routes.js';
//*importacion de rutas


//*inicializando express
const app = express();
//*solucion del error cors
app.use(cors());
//*convercion del body a json
app.use(express.json());

//? midelwarer de informacion
app.use((request, response, next) => {
  const timeString = new Date().toLocaleTimeString();
  console.log(`[${timeString}] ${request.method} ${request.url}`);
  next();
});

app.use('/contactos', contactos);
app.use('/municipios', municipios);

app.use('/uploads', express.static('/tmp/uploads'));

app.use('/productos', productos);

app.use('/fases', fases);

app.use('/eventos', eventos);

app.use('/dir_verde', dir_verde_router);

app.use('/grupos', grupos);

//?ruta para saber el estado de la api
app.get('/', (request, response) => {
  return response.json({ status: 'OK', tiempoDeExecucion: ms(process.uptime() * 1000) });
});

//?ejecutando servidor
app.listen(3000, () => {console.log('localhost:3000/');})
