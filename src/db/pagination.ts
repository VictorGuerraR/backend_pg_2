/**
* Función para paginar datos de una consulta Knex.
*
* @param {Knex.QueryBuilder} query La consulta Knex a paginar.
* @param {number} [currentPage=1] La página actual (por defecto 1).
* @param {number} [pageSize=10] El tamaño de página (por defecto 10).
*
* @returns {Promise<{
*   results: any,
*   pageInformation: {
*     currentPage: number,
*     nextPage: number,
*     previousPage: number,
*     totalElements: number,
*     totalPages: number
*   }
* }>} Un objeto con los datos paginados y la información de la página.
*
* @example
* // Ejemplo de URL para obtener la segunda página con un tamaño de página de 20:
* /api/users?page=2&pageSize=20
*/

import db from '#conexion'
import { Knex } from 'knex';

interface PaginateParams {
  query: Knex.QueryBuilder;
  currentPage?: number;
  pageSize?: number;
}

const paginate = async ({ query, currentPage = 1, pageSize = 10 }: PaginateParams) => {
  // Clonamos la consulta para contar los elementos totales
  // const countQuery = await db({ copia: query.clone().clearSelect().clearOrder().count({ total: '*' }) }).count({ total: '*' })
  const [{ total }] = await db
    .select({ total: db.raw('count(*)') })
    .from(query.clone().clearOrder().count({ total: '*' }).as('subquery'));

  const totalElements = Number(total || 0);
  const totalPages = Math.ceil(totalElements / pageSize);
  const offset = (currentPage - 1) * pageSize;

  // Ejecutamos la consulta principal con paginación
  const data = await query.limit(pageSize).offset(offset);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    results: data,
    pageInformation: {
      currentPage: Number(currentPage),
      nextPage: hasNextPage ? Number(currentPage) + 1 : null,
      previousPage: hasPreviousPage ? Number(currentPage) - 1 : null,
      totalElements,
      totalPages
    }
  };
}

export default paginate;
