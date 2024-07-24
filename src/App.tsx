import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from 'src/store/store';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}></PersistGate>
		</Provider>
	);
}

export default App;
