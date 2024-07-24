import React from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from 'src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Theme } from 'src/theme/theme';
import { GlobalStyle } from 'src/global/global.styles';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Navbar } from 'src/components/organisms/Navbar/Navbar';
import styled from 'styled-components';

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
					<ContentWrapper>
						<Navbar />
						<RouterProvider router={router} />
					</ContentWrapper>
				</Theme>
			</PersistGate>
		</Provider>
	);
}

export default App;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: row;
	width: 100vw;
	height: 100vh;
	padding: 16px;
	gap: 24px;
`;
