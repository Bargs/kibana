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

// const errors = [
//   {
//     defaultMessage: '"or" requires a left and right side',
//     key: 'kbnESQuery.kql.missingOrSubQuerySyntaxError',
//   },
//   {
//     defaultMessage: '"not" requires a sub-query',
//     key: 'kbnESQuery.kql.missingNotSubQuerySyntaxError',
//   },
// ];
//
// export class KQLSyntaxError extends Error {
//   constructor(translationKey) {
//     const kqlSyntaxErrorLabel = i18n.translate('kbnESQuery.kql.syntaxErrorLabel', {
//       defaultMessage: 'KQL Syntax Error',
//     });
//
//     const unknownError = i18n.translate('kbnESQuery.kql.unknownSyntaxError', {
//       defaultMessage: '{kqlSyntaxError}: Unknown KQL syntax error',
//       values: {
//         kqlSyntaxError: kqlSyntaxErrorLabel,
//       },
//     });
//
//     const error = errors.find(info => info.key === translationKey);
//
//     if (!error) {
//       super(unknownError);
//     } else {
//       const translatedError = i18n.translate(error.key, {
//         defaultMessage: `{kqlSyntaxError}: ${error.defaultMessage}`,
//         values: {
//           kqlSyntaxError: kqlSyntaxErrorLabel,
//         },
//       });
//       super(translatedError);
//     }
//
//     this.name = 'KQLSyntaxError';
//   }
// }

export class KQLSyntaxError extends Error {
  constructor(message, shortMessage) {
    super(message);
    this.name = 'KQLSyntaxError';
    this.shortMessage = shortMessage;
  }
}
