import React from 'react';
import styled, { css } from 'styled-components';
import {
	IconManager,
	IconNames,
	IconsColors,
} from 'src/components/atoms/IconManager/IconManager';
import { theme } from 'src/theme/theme';

interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	iconName: IconNames;
	iconColor: IconsColors;
	text?: string;
}

export const IconButton = ({
	iconName,
	iconColor,
	text,
	...props
}: IconButtonProps) => {
	return (
		<Button {...props}>
			<IconWrapper>
				<IconManager name={iconName} color={iconColor} />
			</IconWrapper>
			{text && <Text color={iconColor}>{text}</Text>}
		</Button>
	);
};

const Button = styled.button`
	border: none;
	outline: none;
	background-color: transparent;
	cursor: pointer;
	gap: 2px;
	display: flex;
	align-items: center;
`;

const IconWrapper = styled.div`
	width: 24px;
	height: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Text = styled.p<{ color: IconsColors }>(
	({ color }) => css`
		font-weight: 600;
		color: ${theme.colors[color]};
	`,
);
