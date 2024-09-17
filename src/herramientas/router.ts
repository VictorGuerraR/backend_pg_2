import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as herramientas from '#herramientas/herramientas'

const router = Router()

router.get('/herramientas', middleware, herramientas.obtenerHerramientas)
router.post('/herramientas', middleware, herramientas.crearHerramienta)
router.patch('/herramientas', middleware, herramientas.actualizarHerramienta)
router.delete('/herramientas', middleware, herramientas.desactivarHerramienta)

export default router