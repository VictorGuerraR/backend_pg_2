import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as graficas from '#graficas/graficas'

const router = Router()

router.get('/graficas-1', middleware, graficas.obtenerGraficasEncabezado)

export default router