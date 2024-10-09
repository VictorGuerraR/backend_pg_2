import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as reportes from '#reportes/reportes'

const router = Router()

router.get('/reportes-depreciacion', middleware, reportes.reporteDepreciacion)

export default router