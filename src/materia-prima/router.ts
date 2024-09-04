import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as materiasPrimas from '#materiasPrimas/materia-prima'

const router = Router()

router.get('/materias-primas', middleware, materiasPrimas.obtenerMateriasPrimas)
router.post('/materias-primas', middleware, materiasPrimas.crearMateriaPrima)
router.patch('/materias-primas', middleware, materiasPrimas.actualizarMateriaPrima)
router.delete('/materias-primas', middleware, materiasPrimas.desactivarMateriaPrima)

export default router
