import React from 'react';
import { IconButton } from 'src/components/atoms/IconButton/IconButton';
import styled, { css } from 'styled-components';

interface DragAndDropItemProps {
	text: string;
	onEdit: () => void;
	onDelete: () => void;
}

export const DragAndDropItem = ({
	text,
	onEdit,
	onDelete,
}: DragAndDropItemProps) => {
	return (
		<Wrapper>
			<Text>{text}</Text>
			<ButtonsWrapper>
				<IconButton iconName={'Edit'} iconColor={'text'} />
				<IconButton iconName={'Delete'} iconColor={'delete'} />
			</ButtonsWrapper>
		</Wrapper>
	);
};

const Wrapper = styled.div(
	({ theme: { colors } }) => css`
		width: 100%;
		height: 50px;
		background-color: ${colors.white};
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	`,
);

const Text = styled.p(
	({ theme: { colors } }) => css`
		padding: 16px 33px;
		color: ${colors.text};
		flex: 1;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	`,
);

const ButtonsWrapper = styled.div`
	display: flex;
	padding-right: 16px;
`;
