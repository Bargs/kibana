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
import { FilterBarFilter } from 'ui/filter_bar/filters/filter_bar_filters';

interface Props {
  filter: FilterBarFilter;
  className?: string;
  onTogglePin: (filter: FilterBarFilter) => void;
  onToggleNegate: (filter: FilterBarFilter) => void;
  onToggleDisabled: (filter: FilterBarFilter) => void;
}

interface State {
  isPopoverOpen: boolean;
}

export class FilterItem extends Component<Props, State> {
  public state = {
    isPopoverOpen: false,
  };

  public render() {
    const filter = this.props.filter;
    const {
      filter: { negate, disabled, pinned },
    } = filter;

    const classes = classNames(
      'globalFilterItem',
      {
        'globalFilterItem-isDisabled': disabled,
        'globalFilterItem-isPinned': false,
        'globalFilterItem-isExcluded': negate,
      },
      this.props.className
    );

    let prefix = null;
    if (negate) {
      prefix = <span>NOT </span>;
    }

    const badge = (
      <EuiBadge
        id={'foo'}
        className={classes}
        title={'foo'}
        iconOnClick={() => {
          return;
        }}
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
        {prefix}
        <span>{filter.getDisplayText()}</span>
      </EuiBadge>
    );

    const panelTree = {
      id: 0,
      items: [
        {
          name: `${pinned ? 'Unpin' : 'Pin across all apps'}`,
          icon: 'pin',
          onClick: () => {
            this.closePopover();
            this.props.onTogglePin(filter);
          },
        },
        {
          name: `${negate ? 'Include results' : 'Exclude results'}`,
          icon: `${negate ? 'plusInCircle' : 'minusInCircle'}`,
          onClick: () => {
            this.closePopover();
            this.props.onToggleNegate(filter);
          },
        },
        {
          name: `${disabled ? 'Re-enable' : 'Temporarily disable'}`,
          icon: `${disabled ? 'eye' : 'eyeClosed'}`,
          onClick: () => {
            this.closePopover();
            this.props.onToggleDisabled(filter);
          },
        },
        {
          name: 'Delete',
          icon: 'trash',
          onClick: () => {
            this.closePopover();
          },
        },
      ],
    };

    return (
      <EuiPopover
        id={`popoverFor_${filter.getDisplayText()}`}
        isOpen={this.state.isPopoverOpen}
        closePopover={this.closePopover}
        button={badge}
        anchorPosition="downCenter"
        panelPaddingSize="none"
      >
        <EuiContextMenu initialPanelId={0} panels={[panelTree]} />
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
}
