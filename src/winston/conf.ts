import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { createLogger, format, transports } from 'winston';

dayjs.extend(utc);
const { combine, printf, json } = format;

// Rutas de los archivos de log
const logDir = path.join(os.homedir(), '.logs_backend');

// Verificar si el directorio existe, si no, crearlo
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Asegurarse de que el archivo de log se crea
const logFilePath = path.join(logDir, 'info.log');
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, ''); // Crea un archivo vacío si no existe
}

const consoleFormat = combine(
  format.colorize(),
  printf(
    ({ level, message, labels }) => {
      const labelString = labels ? ` [${Object.entries(labels).map(([key, value]) => `${key}:${value}`).join(', ')}]` : '';
      return `${dayjs().format('YYYY/MM/DD hh:mm:ss.SSS A')} [${level.toString().padEnd(7)}] ${message}${labelString}`;
    })
);

const fileFormat = combine(
  format.timestamp(),
  json()
);

const config = [
  new transports.Console({
    level: 'debug',
    format: consoleFormat
  }),
  // Transport para los logs de información
  new transports.File({
    filename: logFilePath,
    level: 'info',
    format: fileFormat
  }),
];

export default createLogger({ transports: config });
