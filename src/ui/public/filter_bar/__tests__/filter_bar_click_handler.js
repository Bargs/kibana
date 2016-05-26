import ngMock from 'ng_mock';
import expect from 'expect.js';

import MockState from 'fixtures/mock_state';
import notify from '../../notify';
import AggConfigResult from '../../vis/agg_config_result';

import VisProvider from '../../vis';
import StubbedLogstashIndexPatternProvider from 'fixtures/stubbed_logstash_index_pattern';
import FilterBarClickHandlerProvider from '../../filter_bar/filter_bar_click_handler';

describe('filterBarClickHandler', function () {
  let setup = null;

  beforeEach(ngMock.module('kibana'));
  beforeEach(ngMock.inject(function (Private) {
    setup = function () {
      const Vis = Private(VisProvider);
      const createClickHandler = Private(FilterBarClickHandlerProvider);
      const indexPattern = Private(StubbedLogstashIndexPatternProvider);

      const vis = new Vis(indexPattern, {
        type: 'histogram',
        aggs: [
          { type: 'count', schema: 'metric' },
          {
            type: 'terms',
            schema: 'segment',
            params: { field: '_type' }
          }
        ]
      });
      const aggConfigResult = new AggConfigResult(vis.aggs[1], void 0, 'apache', 'apache');

      const $state = new MockState({ filters: [] });
      const clickHandler = createClickHandler($state);

      return { clickHandler, $state, aggConfigResult };
    };
  }));

  afterEach(function () {
    notify._notifs.splice(0);
  });

  context('on non-filterable fields', function () {
    it('warns about trying to filter on a non-filterable field', function () {
      const { clickHandler, aggConfigResult } = setup();
      expect(notify._notifs).to.have.length(0);
      clickHandler({ point: { aggConfigResult }});
      expect(notify._notifs).to.have.length(1);
    });

    it('does not warn if the event is click is being simulated', function () {
      const { clickHandler, aggConfigResult } = setup();
      expect(notify._notifs).to.have.length(0);
      clickHandler({ point: { aggConfigResult }}, true);
      expect(notify._notifs).to.have.length(0);
    });
  });
});
