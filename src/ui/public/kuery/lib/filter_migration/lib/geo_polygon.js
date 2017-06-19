import { nodeTypes } from '../../node_types';

export function convertGeoPolygon(filter) {
  if (filter.meta.type !== 'geo_polygon') return;

  const { key, params: { points } } = filter.meta;
  return nodeTypes.function.buildNode('geoPolygon', key, points);
}
