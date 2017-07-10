import { nodeTypes } from '../../node_types';
import { convertPhraseFilter } from '../lib/phrase';
import { convertRangeFilter } from '../lib/range';
import { convertExistsFilter } from '../lib/exists';
import { convertGeoBoundingBox } from '../lib/geo_bounding_box';
import { convertGeoPolygon } from '../lib/geo_polygon';

const conversionChain = [
  convertPhraseFilter,
  convertRangeFilter,
  convertExistsFilter,
  convertGeoBoundingBox,
  convertGeoPolygon,
];

export function filterToKueryAST(filter) {
  const { negate } = filter.meta;

  const node = conversionChain.reduce((acc, converter) => {
    if (acc !== null) return acc;

    try {
      return converter(filter);
    }
    catch (ex) {
      return null;
    }
  }, null);

  if (!node) {
    throw new Error(`Couldn't convert that filter to a kuery`);
  }

  return negate ? nodeTypes.function.buildNode('not', node) : node;
}
