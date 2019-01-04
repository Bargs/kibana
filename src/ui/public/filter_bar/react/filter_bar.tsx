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

import React, { Component } from 'react';
import { Filter } from 'ui/filter_bar/filters';
import { createFilterBarFilter, FilterBarFilter } from 'ui/filter_bar/filters/filter_bar_filters';
import { FilterItem } from 'ui/filter_bar/react/filter_item';

interface Props {
  filters: Filter[];
  onToggleNegate: (filter: Filter) => void;
  onToggleDisabled: (filter: Filter) => void;
  onTogglePin: (filter: Filter) => void;
}

export class FilterBar extends Component<Props> {
  public onToggleNegate = (filter: FilterBarFilter) => {
    this.props.onToggleNegate(filter.filter);
  };

  public onTogglePin = (filter: FilterBarFilter) => {
    this.props.onTogglePin(filter.filter);
  };

  public onToggleDisabled = (filter: FilterBarFilter) => {
    this.props.onToggleDisabled(filter.filter);
  };

  public render() {
    const filterItems = this.props.filters.map(filter => {
      const filterBarFilter = createFilterBarFilter(filter);
      return (
        <FilterItem
          filter={filterBarFilter}
          onToggleNegate={this.onToggleNegate}
          onToggleDisabled={this.onToggleDisabled}
          onTogglePin={this.onTogglePin}
        />
      );
    });

    return filterItems;
  }
}
