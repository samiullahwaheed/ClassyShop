export function getPagination(query, defaultLimit = 25) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || defaultLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildPaginatedResult({ data, total, page, limit }) {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}
