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
import { createFilterBarFilter, FilterBarFilter } from 'ui/filter_bar/filters/filter_bar_filters';
import { MetaFilter } from 'ui/filter_bar/filters/meta_filter';
import { FilterItem } from 'ui/filter_bar/react/filter_item';

interface Props {
  filters: MetaFilter[];
  onToggleNegate: (filter: MetaFilter) => void;
  onToggleDisabled: (filter: MetaFilter) => void;
  onTogglePin: (filter: MetaFilter) => void;
  onDelete: (filter: MetaFilter) => void;
}

export class FilterBar extends Component<Props> {
  public onToggleNegate = (filter: FilterBarFilter) => {
    this.props.onToggleNegate(Object.getPrototypeOf(filter));
  };

  public onTogglePin = (filter: FilterBarFilter) => {
    this.props.onTogglePin(Object.getPrototypeOf(filter));
  };

  public onToggleDisabled = (filter: FilterBarFilter) => {
    this.props.onToggleDisabled(Object.getPrototypeOf(filter));
  };

  public onDelete = (filter: FilterBarFilter) => {
    this.props.onDelete(Object.getPrototypeOf(filter));
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
          onDelete={this.onDelete}
        />
      );
    });

    return filterItems;
  }
}
