import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const shallowWithStore = (component, store) => {
  const context = {
    store,
  };
  return Enzyme.shallow(component, { context });
};

export default shallowWithStore;
