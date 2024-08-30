import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as herramientas from '#herramientas/herramientas'

const router = Router()

router.get('/obtener-registros', middleware, herramientas.obtenerHerramientas)
router.post('/crear-herramienta', middleware, herramientas.crearHerramienta)
router.patch('/actualizar-herramienta', middleware, herramientas.actualizarHerramienta)
router.delete('/desactivar-herramienta', middleware, herramientas.desactivarHerramienta)

export default router