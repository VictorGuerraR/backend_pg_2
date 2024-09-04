import { Router } from 'express'
import * as materiasPrimas from '#materiasPrimas/materia-prima'

const router = Router()

router.get('/materias-primas', materiasPrimas.obtenerMateriasPrimas)
router.post('/materias-primas', materiasPrimas.crearMateriaPrima)
router.patch('/materias-primas', materiasPrimas.actualizarMateriaPrima)
router.delete('/materias-primas', materiasPrimas.desactivarMateriaPrima)

export default router
