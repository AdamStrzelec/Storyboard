import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from 'src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Theme } from 'src/theme/theme';
import { GlobalStyle } from 'src/global/global.styles';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <div>Dashboard</div>,
		},
		{
			path: '/boards',
			element: <div>boards</div>,
		},
		{
			path: '/profile',
			element: <div>profile</div>,
		},
		{
			path: '/search',
			element: <div>search</div>,
		},
	]);

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<GlobalStyle />
				<Theme>
					<div>
						<a href="/">Dashboard</a>
						<a href="/boards">Boards</a>
						<a href="/profile">Profile</a>
						<a href="/search">Search</a>
					</div>
					<RouterProvider router={router} />
				</Theme>
			</PersistGate>
		</Provider>
	);
}

export default App;
