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

import { EuiBadge, EuiContextMenu, EuiPopover } from '@elastic/eui';
import classNames from 'classnames';
import React, { Component } from 'react';
import { IndexPattern } from 'ui/index_patterns';
import {
  isFilterPinned,
  MetaFilter,
  toggleFilterDisabled,
  toggleFilterNegated,
  toggleFilterPinned,
} from '../filters';
import { getFilterDisplayText } from '../filters/filter_views';
import { FilterEditor } from './filter_editor';

interface Props {
  filter: MetaFilter;
  indexPatterns: IndexPattern[];
  className?: string;
  onUpdate: (filter: MetaFilter) => void;
  onRemove: () => void;
}

interface State {
  isPopoverOpen: boolean;
}

export class FilterItem extends Component<Props, State> {
  public state = {
    isPopoverOpen: false,
  };

  public render() {
    const { filter } = this.props;
    const { negate, disabled } = filter.meta;

    const classes = classNames(
      'globalFilterItem',
      {
        'globalFilterItem-isDisabled': disabled,
        'globalFilterItem-isPinned': isFilterPinned(filter),
        'globalFilterItem-isExcluded': negate,
      },
      this.props.className
    );

    const badge = (
      <EuiBadge
        id={'foo'}
        className={classes}
        title={'foo'}
        iconOnClick={() => this.props.onRemove()}
        iconOnClickAriaLabel={`Delete filter`}
        iconType="cross"
        // @ts-ignore
        iconSide="right"
        onClick={this.togglePopover}
        onClickAriaLabel="Filter actions"
        closeButtonProps={{
          // Removing tab focus on close button because the same option can be optained through the context menu
          // Also, we may want to add a `DEL` keyboard press functionality
          tabIndex: '-1',
        }}
      >
        <span>{getFilterDisplayText(filter)}</span>
      </EuiBadge>
    );

    const panelTree = [
      {
        id: 0,
        items: [
          {
            name: `${isFilterPinned(filter) ? 'Unpin' : 'Pin across all apps'}`,
            icon: 'pin',
            onClick: () => {
              this.closePopover();
              this.onTogglePinned();
            },
          },
          {
            name: 'Edit filter',
            icon: 'pencil',
            panel: 1,
          },
          {
            name: `${negate ? 'Include results' : 'Exclude results'}`,
            icon: `${negate ? 'plusInCircle' : 'minusInCircle'}`,
            onClick: () => {
              this.closePopover();
              this.onToggleNegated();
            },
          },
          {
            name: `${disabled ? 'Re-enable' : 'Temporarily disable'}`,
            icon: `${disabled ? 'eye' : 'eyeClosed'}`,
            onClick: () => {
              this.closePopover();
              this.onToggleDisabled();
            },
          },
          {
            name: 'Delete',
            icon: 'trash',
            onClick: () => {
              this.closePopover();
              this.props.onRemove();
            },
          },
        ],
      },
      {
        id: 1,
        width: 400,
        title: 'Edit filter',
        content: (
          <div style={{ padding: 16 }}>
            <FilterEditor
              filter={filter}
              indexPatterns={this.props.indexPatterns}
              onSubmit={this.onSubmit}
              onCancel={this.closePopover}
            />
          </div>
        ),
      },
    ];

    return (
      <EuiPopover
        id={`popoverFor_${getFilterDisplayText(filter)}`}
        isOpen={this.state.isPopoverOpen}
        closePopover={this.closePopover}
        button={badge}
        anchorPosition="downCenter"
        panelPaddingSize="none"
      >
        <EuiContextMenu initialPanelId={0} panels={panelTree} />
      </EuiPopover>
    );
  }

  private closePopover = () => {
    this.setState({
      isPopoverOpen: false,
    });
  };

  private togglePopover = () => {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen,
    });
  };

  private onSubmit = (filter: MetaFilter) => {
    this.closePopover();
    this.props.onUpdate(filter);
  };

  private onTogglePinned = () => {
    const filter = toggleFilterPinned(this.props.filter);
    this.props.onUpdate(filter);
  };

  private onToggleNegated = () => {
    const filter = toggleFilterNegated(this.props.filter);
    this.props.onUpdate(filter);
  };

  private onToggleDisabled = () => {
    const filter = toggleFilterDisabled(this.props.filter);
    this.props.onUpdate(filter);
  };
}
