import React from 'react';
import styled, { css } from 'styled-components';
import { NavbarItem } from 'src/components/molecules/NavbarItem/NavbarItem';
import UserImage from 'src/assets/images/user.jpeg';
import { IconManager } from 'src/components/atoms/IconManager/IconManager';

export const Navbar = () => {
	return (
		<Wrapper>
			<ItemsWrapper>
				<ItemWrapper>
					<NavbarItem
						to={'/'}
						iconName={'Dashboard'}
						text={'Dashboard'}
					/>
				</ItemWrapper>
				<ItemWrapper>
					<NavbarItem
						to={'/boards'}
						iconName={'Boards'}
						text={'Boards'}
					/>
				</ItemWrapper>
				<ItemWrapper>
					<NavbarItem
						to={'/profile'}
						iconName={'Profile'}
						text={'Profile'}
					/>
				</ItemWrapper>
				<ItemWrapper>
					<NavbarItem
						to={'/search'}
						iconName={'Search'}
						text={'Search'}
					/>
				</ItemWrapper>
			</ItemsWrapper>
			<InfoWrapper>
				<UserInfo>
					<UserImg src={UserImage} />
					<UserName>John Doe</UserName>
				</UserInfo>
				<OptionsWrapper>
					<IconManager
						name={'Options'}
						color={'navigationItemInactive'}
					/>
				</OptionsWrapper>
			</InfoWrapper>
		</Wrapper>
	);
};

const Wrapper = styled.div(
	({ theme: { colors } }) => css`
		width: 294px;
		height: 100%;
		border-radius: 16px;
		background-color: ${colors.white};
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-shadow: 0px 1px 3px rgba(18, 3, 62, 0.3);
	`,
);

const ItemsWrapper = styled.ul`
	margin: 32px 24px;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 32px;
`;

const ItemWrapper = styled.li`
	list-style-type: none;
`;

const InfoWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	padding: 32px 24px;
`;

const UserInfo = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
`;

const UserImg = styled.img`
	width: 32px;
	height: 32px;
	border-radius: 50%;
`;

const UserName = styled.p`
	margin: 0;
	font-weight: 600;
`;

const OptionsWrapper = styled.div`
	width: 24px;
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
`;
