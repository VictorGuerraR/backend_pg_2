import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as graficas from '#graficas/graficas'

const router = Router()

router.get('/graficas-1', middleware, graficas.obtenerGraficasEncabezado)
router.post('/graficas-2', middleware)
router.patch('/graficas-3', middleware)
router.delete('/graficas-4', middleware)

export default router