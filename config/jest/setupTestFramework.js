/* global jasmine:false */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

if (process.env.CI) {
  const jasmineReporters = require('jasmine-reporters'); // eslint-disable-line global-require
  const junitReporter = new jasmineReporters.JUnitXmlReporter({
    savePath: 'testresults',
    consolidateAll: false,
  });

  jasmine.getEnv().addReporter(junitReporter);
}
