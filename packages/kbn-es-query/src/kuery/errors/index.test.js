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

import { fromKueryExpression } from '../ast';


describe('kql syntax errors', () => {

  it('should throw an error for an OR query missing a right side sub-query', () => {
    expect(() => {
      fromKueryExpression('response:200 or ');
    }).toThrow('Expected "(", NOT, field name or value but end of input found.\n' +
      'response:200 or \n' +
      '----------------^');
  });

  it('should throw an error for an OR list of values missing a right side sub-query', () => {
    expect(() => {
      fromKueryExpression('response:(200 or )');
    }).toThrow('Expected "(", NOT or value but ")" found.\n' +
      'response:(200 or )\n' +
      '-----------------^');
  });

  it('should throw an error for a NOT query missing a sub-query', () => {
    expect(() => {
      fromKueryExpression('response:200 and not ');
    }).toThrow('Expected "(", field name or value but end of input found.\n' +
      'response:200 and not \n' +
      '---------------------^');
  });

  it('should throw an error for a NOT list missing a sub-query', () => {
    expect(() => {
      fromKueryExpression('response:(200 and not )');
    }).toThrow('Expected "(" or value but ")" found.\n' +
      'response:(200 and not )\n' +
      '----------------------^');
  });

  it('should throw an error for unbalanced quotes', () => {
    expect(() => {
      fromKueryExpression('foo:"ba ');
    }).toThrow('Expected "(", value or whitespace but "\\"" found.\n' +
      'foo:"ba \n' +
      '----^');
  });

  it('should throw an error for unescaped quotes in a quoted string', () => {
    expect(() => {
      fromKueryExpression('foo:"ba "r"');
    }).toThrow('Expected AND, OR, end of input or whitespace but "r" found.\n' +
      'foo:"ba "r"\n' +
      '---------^');
  });

  it('should throw an error for unescaped special characters in literals', () => {
    expect(() => {
      fromKueryExpression('foo:ba:r');
    }).toThrow('Expected AND, OR, end of input or whitespace but ":" found.\n' +
      'foo:ba:r\n' +
      '------^');
  });

});
