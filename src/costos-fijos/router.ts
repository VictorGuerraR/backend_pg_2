import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as costoFijos from '#costosFijos/costos-fijos'
const router = Router()

router.get('/materias-primas', middleware, costoFijos.obtenerCostosFijos)
router.post('/materias-primas', middleware, costoFijos.crearCostosFijos)
router.patch('/materias-primas', middleware, costoFijos.actualizarCostosFijos)
router.delete('/materias-primas', middleware, costoFijos.desactivarCostosFijos)

export default router
