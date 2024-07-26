import React, { useState } from 'react';
import { DragAndDropItem } from 'src/components/molecules/DragAndDropItem/DragAndDropItem';
import styled, { css } from 'styled-components';
import {
	DndContext,
	useSensor,
	useSensors,
	closestCorners,
	DragEndEvent,
	MouseSensor,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DragAndDropContainer } from 'src/components/molecules/DragAndDropContainer/DragAndDropContainer';
import { IconButton } from 'src/components/atoms/IconButton/IconButton';
import { useBoardState, ContainerTask } from './useBoardState';

export const Board = () => {
	const {
		handleAddItem,
		handleChangeOrder,
		handleDeleteItem,
		isAddNewCardItem,
		setIsAddNewCardItem,
		tasks,
	} = useBoardState();

	return (
		<Wrapper>
			<Container
				setState={(tasks) => handleChangeOrder(tasks, 'level1')}
				addItem={(tasks) => handleAddItem(tasks, 'level2')}
				deleteItem={(id) => handleDeleteItem(id)}
				tasks={tasks['level1']}
			>
				{(parentId) => (
					<Container
						setState={(tasks) => handleChangeOrder(tasks, 'level2')}
						addItem={(tasks) => handleAddItem(tasks, 'level3')}
						tasks={tasks['level2']}
						deleteItem={(id) => handleDeleteItem(id)}
						parentId={parentId}
					>
						{(parentId) => (
							<Container
								setState={(tasks) =>
									handleChangeOrder(tasks, 'level3')
								}
								deleteItem={(id) => handleDeleteItem(id)}
								tasks={tasks['level3']}
								parentId={parentId}
							></Container>
						)}
					</Container>
				)}
			</Container>
			{isAddNewCardItem && (
				<DragAndDropItem
					id={''}
					isNewItem
					onCancelAddNewItem={() => setIsAddNewCardItem(false)}
					onAddItem={({ id, title }) => {
						handleAddItem({ id, title }, 'level1');
						setIsAddNewCardItem(false);
					}}
				/>
			)}

			<IconButton
				onClick={() => setIsAddNewCardItem(true)}
				iconName={'Plus'}
				iconColor={'addCard'}
				text={'Add card'}
			/>
		</Wrapper>
	);
};

interface ContainerProps {
	tasks: ContainerTask[];
	parentId?: string;
	children?: (parentId: string) => React.ReactElement;
	setState: (tasks: ContainerTask[]) => void;
	addItem?: (tasks: ContainerTask) => void;
	deleteItem?: (id: string) => void;
}

const Container = ({
	tasks,
	parentId,
	children,
	setState,
	addItem,
	deleteItem,
}: ContainerProps) => {
	const [editingTaskId, setEditingTaskId] = useState('');
	const [displayAddNewItemId, setDisplayAddNewItemId] = useState('');

	const mouseSensor = useSensor(MouseSensor, {
		activationConstraint: {
			distance: 10,
		},
	});

	const sensors = useSensors(mouseSensor);

	const getTaskPos = (id?: string) =>
		tasks.findIndex((task) => task.id === id);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id === over?.id) return;

		const originalPos = getTaskPos(active.id as string);
		const newPos = getTaskPos(over?.id as string);

		const modifiedTasks = arrayMove(tasks, originalPos, newPos);

		if (modifiedTasks) {
			setState(modifiedTasks);
		}
	};
	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={tasks}
				strategy={verticalListSortingStrategy}
			>
				{tasks.map(
					(task) =>
						(parentId === task.parentId || !parentId) && (
							<>
								<DragAndDropContainer
									id={task.id}
									key={task.id}
								>
									<DnDItemWrapper hasPadding={!!parentId}>
										<DragAndDropItem
											key={task.id}
											id={task.id}
											text={task.title}
											onEdit={(id) => {
												setEditingTaskId(id);
											}}
											onDelete={(id) => {
												deleteItem?.(id);
											}}
										/>
										{children && children(task.id)}
										{editingTaskId === task.id &&
											children && (
												<AddCardButtonWrapper>
													<IconButton
														onClick={() =>
															setDisplayAddNewItemId(
																task.id,
															)
														}
														iconName={'Plus'}
														iconColor={'addCard'}
														text={'Add card'}
													/>
												</AddCardButtonWrapper>
											)}
										{displayAddNewItemId === task.id &&
											!editingTaskId && (
												<AddNewCardWrapper>
													<DragAndDropItem
														id={''}
														isNewItem
														onCancelAddNewItem={() =>
															setDisplayAddNewItemId(
																'',
															)
														}
														onAddItem={({
															id,
															title,
														}) => {
															addItem?.({
																id,
																title,
																parentId:
																	task.id,
															});
															setDisplayAddNewItemId(
																'',
															);
														}}
													/>
												</AddNewCardWrapper>
											)}
									</DnDItemWrapper>
								</DragAndDropContainer>
							</>
						),
				)}
			</SortableContext>
		</DndContext>
	);
};

const DnDItemWrapper = styled.div<{ hasPadding: boolean }>(
	({ hasPadding }) =>
		hasPadding &&
		css`
			width: calc(100% - 16px);
			transform: translateX(16px);
		`,
);

const AddCardButtonWrapper = styled.div`
	transform: translateX(16px);
`;

const AddNewCardWrapper = styled.div`
	width: calc(100% - 16px);
	transform: translateX(16px);
`;

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
