import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from 'src/components/atoms/IconButton/IconButton';
import { Input } from 'src/components/atoms/Input/Input';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
import styled, { css } from 'styled-components';

interface DragAndDropItemProps {
	id: string;
	text?: string;
	onEdit?: (id: string) => void;
	onDelete?: () => void;
	isNewItem?: boolean;
	onCancelAddNewItem?: () => void;
}

export const DragAndDropItem = ({
	id,
	text = '',
	onEdit,
	onDelete,
	isNewItem = false,
	onCancelAddNewItem,
}: DragAndDropItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [inputValue, setInputValue] = useState(text);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useOnClickOutside(wrapperRef, () => {
		if (isNewItem) {
			if (inputValue) {
				//TODO add on save new item
			} else {
				onCancelAddNewItem?.();
			}
		} else {
			setIsEditing(false);
		}
	});

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		if (isEditing) {
			onEdit?.(id);
			inputRef?.current?.focus();
		} else {
			timeoutId = setTimeout(() => {
				onEdit?.('');
			}, 100);

			if (!inputValue) {
				setInputValue(text);
			}
		}

		return () => clearTimeout(timeoutId);
	}, [isEditing]);

	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		if (isNewItem) {
			setIsEditing(true);
		}

		return () => clearTimeout(timeoutId);
	}, [isNewItem]);

	return (
		<Wrapper ref={wrapperRef}>
			<TextWrapper>
				{isEditing ? (
					<Input
						ref={inputRef}
						value={inputValue}
						onChange={(event) => {
							event.preventDefault();
							setInputValue(event.target.value);
						}}
					/>
				) : (
					<Text>{text}</Text>
				)}
			</TextWrapper>
			<ButtonsWrapper>
				<IconButton
					onClick={() => {
						setIsEditing((prevState) => !prevState);
					}}
					iconName={'Edit'}
					iconColor={'text'}
				/>
				<IconButton
					onClick={() => {
						if (isNewItem) {
							onCancelAddNewItem?.();
						} else {
							onDelete?.();
						}
					}}
					iconName={'Delete'}
					iconColor={'delete'}
				/>
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
		margin: 8px 0;
		user-select: none;

		&:hover ${ButtonsWrapper} {
			opacity: 1;
		}
	`,
);

const TextWrapper = styled.div`
	flex: 1;
	padding: 16px 33px;
`;

const Text = styled.p(
	({ theme: { colors } }) => css`
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
	opacity: 0;
	transition: opacity 0.15s ease-in-out;
`;
