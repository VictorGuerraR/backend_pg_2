import cors from 'cors'
import dotenv from 'dotenv';
import express from 'express';
import login from '#login/router';
import registros from '#registros/router'
import costosFijos from '#costosFijos/router'
import herramientas from '#herramientas/router'
import materiasPrimas from '#materiasPrimas/router'

dotenv.config();
const app = express();
app.use(cors())
app.use(express.json({ limit: '100mb' }))

app.use(login)
app.use(registros)
app.use(costosFijos)
app.use(herramientas)
app.use(materiasPrimas)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
