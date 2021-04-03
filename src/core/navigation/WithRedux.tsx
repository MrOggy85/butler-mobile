import React from 'react';
import { Provider } from 'react-redux';
import store from '../redux/store';

function WithRedux<T>(Component: React.FunctionComponent<T>) {
  return function inject(props: any) {
    const EnhancedComponent = () => (
      <Provider store={store}>
        <Component
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
      </Provider>
    );

    return <EnhancedComponent />;
  };
}

export default WithRedux;
