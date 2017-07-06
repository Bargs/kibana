import { nodeTypes } from '../../node_types';
import { convertPhraseFilter } from '../lib/phrase';
import { convertRangeFilter } from '../lib/range';
import { convertExistsFilter } from '../lib/exists';
import { convertGeoBoundingBox } from '../lib/geo_bounding_box';
import { convertGeoPolygon } from '../lib/geo_polygon';

export function filterToKueryAST(filter) {
  const { negate } = filter.meta;
  const node = convertPhraseFilter(filter)
    || convertRangeFilter(filter)
    || convertExistsFilter(filter)
    || convertGeoBoundingBox(filter)
    || convertGeoPolygon(filter);

  if (!node) {
    throw new Error(`Couldn't convert that filter to a kuery`);
  }

  return negate ? nodeTypes.function.buildNode('not', node) : node;
}
