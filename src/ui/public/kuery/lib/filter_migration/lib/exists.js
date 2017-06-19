import { nodeTypes } from '../../node_types';

export function convertExistsFilter(filter) {
  if (filter.meta.type !== 'exists') return;

  const { key } = filter.meta;
  return nodeTypes.function.buildNode('exists', key);
}
