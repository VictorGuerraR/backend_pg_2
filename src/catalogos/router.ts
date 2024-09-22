import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as catalogos from '#catalogos/catologos'
const router = Router()

router.get('/catalogo/usuarios', middleware, catalogos.usuarios)
router.get('/catalogo/tipoDepreciacion', middleware, catalogos.tipoDepreciacion)
router.get('/catalogo/herramientas', middleware, catalogos.herramientas)
router.get('/catalogo/materiasPrimas', middleware, catalogos.materiaPrima)


export default router
