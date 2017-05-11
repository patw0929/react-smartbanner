import jsdom from 'jsdom';

window.__SERVER__ = false;
window.__DEVELOPMENT__ = false;

// Define some html to be our basic document
// JSDOM will consume this and act as if we were in a browser
const DEFAULT_HTML = '<!doctype html><html><body></body></html>';

// Define some variables to make it look like we're a browser
// First, use JSDOM's fake DOM as the document
const doc = jsdom.jsdom(DEFAULT_HTML);

global.document = doc;

// Set up a mock window
global.window = doc.defaultView;

// Allow for things like window.location
global.navigator = window.navigator;

const DATE_TO_USE = new Date('2017-05-11');
const _Date = Date;

global.Date = jest.fn(() => DATE_TO_USE);
global.Date.UTC = _Date.UTC;
global.Date.parse = _Date.parse;
global.Date.now = _Date.now;
