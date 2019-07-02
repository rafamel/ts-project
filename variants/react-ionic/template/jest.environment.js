import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Enzyme
configure({ adapter: new Adapter() });

// Globals
global.crypto = require('@trust/webcrypto');

// Mocks
require('ionicons').addIcons = jest.fn();
require('@ionic/core').isPlatform = jest.fn();
