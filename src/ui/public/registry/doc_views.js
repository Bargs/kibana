import _ from 'lodash';
import uiRegistry from '../registry/_registry';
export default uiRegistry({
  name: 'docViews',
  index: ['name'],
  order: ['order'],
  constructor() {
    this.forEach(docView => {
      docView.shouldShow = docView.shouldShow || _.constant(true);
      docView.name = docView.name || docView.title;
    });
  }
});
