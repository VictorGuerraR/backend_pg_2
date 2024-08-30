import { Router } from 'express'
import * as login from '#login/login'

const router = Router()

router.get('/loggin-token', login.token)
router.post('/loggin-create', login.creacion)
router.patch('/loggin-update', login.actualizacion)
router.delete('/loggin-inactive', login.deshabilitar)

export default router
