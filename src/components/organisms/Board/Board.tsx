import React from 'react';
import { DragAndDropItem } from 'src/components/molecules/DragAndDropItem/DragAndDropItem';
import styled, { css } from 'styled-components';

export const Board = () => {
	return (
		<Wrapper>
			<DragAndDropItem
				text={
					'Social Media posts for Acme saddsasda wqewqewqewq asasddsdsa xzcxczxzcxz qwewwqeewqe'
				}
				onEdit={() => {
					/**/
				}}
				onDelete={() => {
					/**/
				}}
			/>
		</Wrapper>
	);
};

const Wrapper = styled.div(
	({ theme: { colors } }) => css`
		width: 100%;
		height: 100%;
		background-color: ${colors.boardBackground};
		border-radius: 16px;
		max-width: 600px;
		padding: 8px;
	`,
);
