import React from 'react';
import styled, { css } from 'styled-components';
import { IconManager, IconNames } from 'src/components/atoms/IconManager';

interface NavbarItemProps {
	to: string;
	text: string;
	iconName: IconNames;
}

export const NavbarItem = ({ to, text, iconName }: NavbarItemProps) => {
	return (
		<>
			<NavbarItemWrapper href={to} isActive={location.pathname === to}>
				<IconWrapper>
					<IconManager
						name={iconName}
						color={
							location.pathname === to
								? 'navigationItemActive'
								: 'navigationItemInactive'
						}
					/>
				</IconWrapper>{' '}
				{text}
			</NavbarItemWrapper>
		</>
	);
};

const NavbarItemWrapper = styled.a<{ isActive: boolean }>(
	({ theme: { colors }, isActive }) => css`
		display: flex;
		align-items: center;
		gap: 16px;
		text-decoration: none;
		font-weight: 600;
		color: ${isActive
			? colors.navigationItemActive
			: colors.navigationItemInactive};
	`,
);

const IconWrapper = styled.div`
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
`;
