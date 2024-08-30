import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as registros from '#registros/registros'

const router = Router()

router.get('/test-registros', middleware, registros.test)

export default router