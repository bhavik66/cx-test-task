function descendingComparator<EntityType extends {}>(
  a: EntityType,
  b: EntityType,
  orderBy: keyof EntityType
) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<EntityType extends {}>(
  order: 'desc' | 'asc',
  orderBy: keyof EntityType
) {
  return order === 'desc'
    ? (a: EntityType, b: EntityType) => descendingComparator(a, b, orderBy)
    : (a: EntityType, b: EntityType) => -descendingComparator(a, b, orderBy);
}

function stableSort<EntityType extends {}>(
  array: Array<EntityType>,
  comparator: (a: EntityType, b: EntityType) => number
) {
  const stabilizedThis = array.map((el, index: number) => ({
    el,
    index,
  }));
  stabilizedThis.sort((a, b) => {
    const order = comparator(a.el, b.el);
    if (order !== 0) return order;
    return a.index - b.index;
  });
  return stabilizedThis.map((element) => element.el);
}

export { getComparator, stableSort, descendingComparator };
