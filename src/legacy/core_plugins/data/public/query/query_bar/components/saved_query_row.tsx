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

import React, { FunctionComponent, Fragment } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiButtonEmpty, EuiIcon } from '@elastic/eui';
import { SavedQueryAttributes } from '../../../search/search_bar';
import { Query } from '../index';

interface Props {
  query: Query;
  savedQuery?: SavedQueryAttributes;
  showSaveQuery?: boolean;
  onSave: () => void;
  onSaveNew: () => void;
  isDirty: boolean;
  onClearSavedQuery: () => void;
}

export interface SavedQueryDetails {
  title: string;
  description: string;
  includeFilters: boolean;
  includeTimeFilter: boolean;
  query: Query;
}

export const SavedQueryRow: FunctionComponent<Props> = ({
  query,
  savedQuery,
  onSave,
  onSaveNew,
  showSaveQuery,
  isDirty,
  onClearSavedQuery,
}) => {
  let rowContent;
  if (savedQuery) {
    if (isDirty && showSaveQuery) {
      rowContent = (
        <Fragment>
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty data-test-subj="savedQuerySaveChanges" onClick={onSave}>
                Save changes to query: {savedQuery.title}
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty onClick={onClearSavedQuery} color="text">
                <EuiIcon type="crossInACircleFilled" />
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty data-test-subj="savedQuerySaveAsNew" onClick={onSaveNew}>
              Save as new
            </EuiButtonEmpty>
          </EuiFlexItem>
        </Fragment>
      );
    } else {
      rowContent = (
        <Fragment>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="none">
              <EuiFlexItem>{savedQuery.title}</EuiFlexItem>
              <EuiFlexItem>
                <EuiButtonEmpty onClick={onClearSavedQuery} color="text">
                  <EuiIcon type="crossInACircleFilled" />
                </EuiButtonEmpty>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>

          {showSaveQuery && (
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty data-test-subj="savedQuerySaveAsNew" onClick={onSaveNew}>
                Save as new
              </EuiButtonEmpty>
            </EuiFlexItem>
          )}
        </Fragment>
      );
    }
  } else if (query.query.length !== 0 && showSaveQuery) {
    rowContent = (
      <EuiFlexItem grow={false}>
        <EuiButtonEmpty data-test-subj="savedQuerySaveNew" onClick={onSave}>
          Save this query for reuse
        </EuiButtonEmpty>
      </EuiFlexItem>
    );
  }

  if (rowContent) {
    return (
      <EuiFlexGroup justifyContent="spaceBetween" alignItems="center" gutterSize="none">
        {rowContent}
      </EuiFlexGroup>
    );
  } else {
    return null;
  }
};
