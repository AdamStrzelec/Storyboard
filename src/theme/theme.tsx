import React from 'react';
import { ThemeProvider } from 'styled-components';

export const theme = {
	colors: {
		white: '#ffffff',
		navigationItemInactive: '#B7BEC5',
		navigationItemActive: '#007DFC',
		text: '#000000',
		background: '#F4F7FE',
		boardBackground: '#ECF1FD',
	},
};

interface ThemeProps {
	children: React.ReactNode;
}

export type ThemeType = typeof theme;

export const Theme = ({ children }: ThemeProps) => (
	<ThemeProvider theme={theme}>{children}</ThemeProvider>
);
