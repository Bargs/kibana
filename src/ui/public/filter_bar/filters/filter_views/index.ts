/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { MetaFilter } from 'src/ui/public/filter_bar/filters/meta_filter';
import { Filter } from 'ui/filter_bar/filters';
import { PhraseFilterViews } from './phrase_filter_views';

const filterViews: { [index: string]: FilterViews } = {
  PhraseFilter: PhraseFilterViews,
};

export interface FilterViews {
  getDisplayText: (filter: Filter) => string;
}

export function getFilterDisplayText(metaFilter: MetaFilter): string {
  const prefix = metaFilter.negate ? 'NOT ' : '';
  const filterText = filterViews[metaFilter.filter.type].getDisplayText(metaFilter.filter);
  return `${prefix}${filterText}`;
}
