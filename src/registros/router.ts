import { Router } from 'express'
import { middleware } from '#login/middleware'
import * as maestro from '#registros/maestro'
import * as detalle_bien from '#registros/detalle_bien'
import * as detalle_servicio from '#registros/detalle_servicio'

const router = Router()

// MAESTRO
router.get('/registros-maestro', middleware, maestro.obtenerRegistrosMaestros)
router.post('/registros-maestro', middleware, maestro.crearMaestro)
router.delete('/registros-maestro', middleware, maestro.desactivarMaestro)

// DETALLE BIEN
router.get('/registros-maestro/bien', middleware, detalle_bien.obtenerRegistrosDetalleBienes)
router.post('/registros-maestro/bien', middleware, detalle_bien.crearDetalleBien)
router.delete('/registros-maestro/bien', middleware, detalle_bien.desactivarDetalleBien)

// DETALLE SERVICIO
router.get('/registros-maestro/servicio', middleware, detalle_servicio.obtenerRegistrosDetalleServicios)
router.post('/registros-maestro/servicio', middleware, detalle_servicio.crearDetalleServicio)
router.delete('/registros-maestro/servicio', middleware, detalle_servicio.desactivarDetalleServicio)

export default router