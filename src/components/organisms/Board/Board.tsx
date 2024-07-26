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

export const Board = () => {
	const [tasks, setTasks] = useState([
		{ id: '1', title: 'Add tests to homepage' },
		{ id: '2', title: 'Fix styling in about section' },
		{ id: '3', title: 'Learn how to center a div' },
	]);

	const [nestedTasks, setNestedTasks] = useState([
		{ id: '4', title: 'nested 1', parentId: '1' },
		{ id: '5', title: 'nested 2', parentId: '1' },
		{ id: '6', title: 'nested 3', parentId: '2' },
		{ id: '7', title: 'nested 4', parentId: '2' },
		{ id: '8', title: 'nested 5', parentId: '3' },
		{ id: '9', title: 'nested 6', parentId: '3' },
	]);

	const [tasksOfTasks, setTasksOfTasks] = useState([
		{ id: '10', title: 'nested 7', parentId: '8' },
		{ id: '11', title: 'nested 8', parentId: '8' },
		{ id: '12', title: 'nested 9', parentId: '8' },
	]);

	const [isAddNewCardItem, setIsAddNewCardItem] = useState(false);

	return (
		<Wrapper>
			<Container tasks={tasks}>
				{(id) => (
					<Container tasks={nestedTasks} parentId={id}>
						{(id) => (
							<Container
								tasks={tasksOfTasks}
								parentId={id}
							></Container>
						)}
					</Container>
				)}
			</Container>
			{isAddNewCardItem && (
				<DragAndDropItem
					id={'50'}
					isNewItem
					onCancelAddNewItem={() => setIsAddNewCardItem(false)}
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
	tasks: { id: string; title: string; parentId?: string }[];
	parentId?: string;
	children?: (id: string) => React.ReactElement;
}

const Container = ({
	tasks: tasksInitial,
	parentId,
	children,
}: ContainerProps) => {
	const [tasks, setTasks] = useState(tasksInitial);
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

		setTasks((tasks) => {
			const originalPos = getTaskPos(active.id as string);
			const newPos = getTaskPos(over?.id as string);

			return arrayMove(tasks, originalPos, newPos);
		});
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
												console.log('');
											}}
											onDelete={() => {
												console.log('');
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
														id={'50'}
														isNewItem
														onCancelAddNewItem={() =>
															setDisplayAddNewItemId(
																'',
															)
														}
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
