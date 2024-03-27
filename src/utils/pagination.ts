import { PaginationType } from '../@types/pagination.type';

/**
 * Returns pagination parameters based on the provided page and size.
 *
 * @param {{ page?: number; size?: number }} params - Object containing page and size parameters
 * @return {{ limit: number; offset: number }} Object containing limit and offset parameters
 */
export const getPaginationParams = ({
  page = 1,
  size = 10,
}: {
  page?: number;
  size?: number;
}): { limit: number; offset: number } => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

/**
 * Returns pagination keys based on the count, page, and size parameters.
 *
 * @param {{ count: number; page?: number; size?: number; }} - Object with count, page, and size parameters
 * @return {PaginationType} Object with total, first_page, current_page, per_page, and last_page keys
 */
export const getPaginationKeys = ({
  count,
  page = 1,
  size = 10,
}: {
  count: number;
  page?: number;
  size?: number;
}): PaginationType => {
  const first_page = 1;
  const current_page = page;
  const per_page = size;
  const last_page = Math.ceil(count / per_page);

  return {
    total: count,
    first_page,
    current_page,
    per_page,
    last_page,
  };
};
