import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from 'src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Theme } from 'src/theme/theme';
import { GlobalStyle } from 'src/global/global.styles';

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<GlobalStyle />
				<Theme>
					<></>
				</Theme>
			</PersistGate>
		</Provider>
	);
}

export default App;
