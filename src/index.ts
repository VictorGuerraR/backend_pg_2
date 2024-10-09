import cors from 'cors'
import dotenv from 'dotenv';
import express from 'express';
import login from '#login/router';
import graficas from '#graficas/router'
import reportes from '#reportes/router'
import registros from '#registros/router'
import catalogos from '#catalogos/router'
import costosFijos from '#costosFijos/router'
import herramientas from '#herramientas/router'
import materiasPrimas from '#materiasPrimas/router'

dotenv.config();
const app = express();
app.use(
  cors({
    origin: 'http://localhost:2501',
    credentials: true
  })
)
app.use(express.json({ limit: '100mb' }))

app.use(login)
app.use(graficas)
app.use(reportes)
app.use(registros)
app.use(catalogos)
app.use(costosFijos)
app.use(herramientas)
app.use(materiasPrimas)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));

export default app