import { nodeTypes } from '../../node_types';

export function convertRangeFilter(filter) {
  if (filter.meta.type !== 'range') return;

  const { key, params } = filter.meta;
  return nodeTypes.function.buildNode('range', key, params);
}
