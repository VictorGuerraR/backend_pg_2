import db from '#conexion'
import { Request, Response } from 'express';


export async function test(req: Request, res: Response) {
  console.log(req?.usuario)
  res.status(200).json({ usuario: req?.usuario })
}