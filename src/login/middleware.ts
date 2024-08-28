import { obtenerUsuario } from '#login/login'
import { decode, verify, JwtPayload } from 'jsonwebtoken'

const verificarToken = async (token: any): Promise<any> => {
  if (!token) return false

  const decodedToken = decode(token);

  if (decodedToken && typeof decodedToken !== 'string') {
    const { cod_usuario } = decodedToken as JwtPayload;
    if (cod_usuario) {
      const usuario = await obtenerUsuario(cod_usuario, null)

      const valido = verify(token, usuario?.password)
      if (valido) return valido
    }
  }

  return false;
}

export async function middleware(req: any, res: any, next: any): Promise<any> {
  try {
    const { cod_usuario } = await verificarToken(req.headers.token)
    if (cod_usuario) {
      req.usuario = await obtenerUsuario(cod_usuario, null)
      return next()
    }
    res.status(404).send();
  } catch (err) {
    res.status(500).send()
  }
}
