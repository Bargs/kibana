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

import { EuiComboBox, EuiComboBoxOptionProps, EuiFormRow } from '@elastic/eui';
import { uniq } from 'lodash';
import React from 'react';
import { ValueInputType } from 'ui/filter_bar/react/filter_editor/value_input_type';
import { PhraseSuggestor, PhraseSuggestorProps } from './phrase_suggestor';

interface Props extends PhraseSuggestorProps {
  value?: string;
  onChange: (value: string | number | boolean) => void;
}

export class PhraseValueInput extends PhraseSuggestor<Props> {
  public render() {
    return (
      <EuiFormRow label="Value">
        {this.isSuggestingValues() ? (
          this.renderWithSuggestions()
        ) : (
          <ValueInputType
            placeholder="The value to match against the selected field"
            value={this.props.value}
            onChange={this.props.onChange}
            type={this.props.field ? this.props.field.type : 'string'}
          />
        )}
      </EuiFormRow>
    );
  }

  private renderWithSuggestions() {
    const options = this.getOptions();
    const selectedOptions = this.getSelectedOptions(options);
    return (
      <EuiComboBox
        placeholder="Select a field"
        options={options}
        selectedOptions={selectedOptions}
        onChange={this.onComboBoxChange}
        onSearchChange={this.onSearchChange}
        singleSelection={{ asPlainText: true }}
        onCreateOption={this.props.onChange}
        isClearable={false}
      />
    );
  }

  private onComboBoxChange = (selectedOptions: EuiComboBoxOptionProps[]): void => {
    if (selectedOptions.length === 0) {
      return this.props.onChange('');
    }
    const [selectedOption] = selectedOptions;
    this.props.onChange(selectedOption.label);
  };

  private getOptions() {
    const options = [...this.state.suggestions];
    if (typeof this.props.value !== 'undefined') {
      options.unshift(this.props.value);
    }
    return uniq(options).map(label => ({ label }));
  }

  private getSelectedOptions(options: EuiComboBoxOptionProps[]): EuiComboBoxOptionProps[] {
    return options.filter(option => {
      return typeof this.props.value !== 'undefined' && option.label === this.props.value;
    });
  }
}
