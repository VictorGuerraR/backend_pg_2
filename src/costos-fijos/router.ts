import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as costoFijos from '#costosFijos/costos-fijos'
const router = Router()

router.get('/costos-fijos', middleware, costoFijos.obtenerCostosFijos)
router.post('/costos-fijos', middleware, costoFijos.crearCostosFijos)
router.patch('/costos-fijos', middleware, costoFijos.actualizarCostosFijos)
router.delete('/costos-fijos', middleware, costoFijos.desactivarCostosFijos)

export default router
