import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from 'src/components/atoms/IconButton/IconButton';
import { Input } from 'src/components/atoms/Input/Input';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

interface DragAndDropItemProps {
	id: string;
	text?: string;
	onEdit?: (id: string) => void;
	onChangeTitle?: ({ id, title }: { id: string; title: string }) => void;
	onDelete?: (id: string) => void;
	isNewItem?: boolean;
	onCancelAddNewItem?: () => void;
	onAddItem?: ({ id, title }: { id: string; title: string }) => void;
}

export const DragAndDropItem = ({
	id,
	text = '',
	onEdit,
	onChangeTitle,
	onDelete,
	isNewItem = false,
	onCancelAddNewItem,
	onAddItem,
}: DragAndDropItemProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [inputValue, setInputValue] = useState(text);

	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useOnClickOutside(wrapperRef, () => {
		if (isNewItem) {
			if (inputValue) {
				onAddItem?.({ title: inputValue, id: uuidv4() });
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
				onChangeTitle?.({ id, title: inputValue });
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
							setInputValue(event.target.value);
						}}
						onKeyDown={(event) => {
							if (event.code === 'Enter') {
								setIsEditing(false);
							}
						}}
					/>
				) : (
					<Text>{text !== inputValue ? inputValue : text}</Text>
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
							onDelete?.(id);
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
