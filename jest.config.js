/** @type {import('jest').Config} */
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '#pagination': '<rootDir>/src/db/pagination.ts',
    '#catalogos/(.*)': '<rootDir>/src/catalogos/$1',
    '#conexion': '<rootDir>/src/db/db.ts',
    '#costosFijos/(.*)': '<rootDir>/src/costos-fijos/$1',
    '#graficas/(.*)': '<rootDir>/src/graficas/$1',
    '#herramientas/(.*)': '<rootDir>/src/herramientas/$1',
    '#inventario/(.*)': '<rootDir>/src/inventario/$1',
    '#login/(.*)': '<rootDir>/src/login/$1',
    '#logs': '<rootDir>/src/winston/conf.ts',
    '#materiasPrimas/(.*)': '<rootDir>/src/materia-prima/$1',
    '#middleware': '<rootDir>/src/login/middleware.ts',
    '#registros/(.*)': '<rootDir>/src/registros/$1',
    '#tools/(.*)': '<rootDir>/src/tools/$1',
    '#types/(.*)': '<rootDir>/src/types/$1',
  },
  moduleDirectories: ['node_modules', 'src'],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/?(*.)+(spec|test).[jt]s?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Comentado o eliminado
};
