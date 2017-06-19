import { nodeTypes } from '../../node_types';

export function convertPhraseFilter(filter) {
  if (filter.meta.type !== 'phrase') return;

  const { key, params } = filter.meta;
  return nodeTypes.function.buildNode('is', key, params.query);
}
