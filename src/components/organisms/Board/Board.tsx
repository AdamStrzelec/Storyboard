import React, { useState } from 'react';
import { DragAndDropItem } from 'src/components/molecules/DragAndDropItem/DragAndDropItem';
import styled, { css } from 'styled-components';
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	closestCorners,
	DragEndEvent,
	Active,
	UniqueIdentifier,
	DragOverlay,
} from '@dnd-kit/core';
import {
	arrayMove,
	sortableKeyboardCoordinates,
	SortableContext,
	verticalListSortingStrategy,
	rectSortingStrategy,
} from '@dnd-kit/sortable';
import { DragAndDropContainer } from 'src/components/molecules/DragAndDropContainer/DragAndDropContainer';

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
	]);

	const [active, setActive] = useState<UniqueIdentifier | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const getTaskPos = (id?: string) =>
		nestedTasks.findIndex((task) => task.id === id);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id === over?.id) return;

		setNestedTasks((tasks) => {
			const originalPos = getTaskPos(active.id as string);
			const newPos = getTaskPos(over?.id as string);

			return arrayMove(tasks, originalPos, newPos);
		});

		setActive(null);
	};

	const getTaskPosParent = (id: string) =>
		tasks.findIndex((task) => task.id === id);

	const handleDragEndParent = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id === over?.id) return;

		setTasks((tasks) => {
			//@ts-expect-error FIXME
			const originalPos = getTaskPosParent(active.id);
			//@ts-expect-error FIXME
			const newPos = getTaskPosParent(over.id);

			return arrayMove(tasks, originalPos, newPos);
		});
	};

	return (
		<Wrapper>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragEnd={handleDragEndParent}
			>
				<SortableContext
					items={tasks}
					strategy={verticalListSortingStrategy}
				>
					{tasks.map((task) => (
						<DragAndDropContainer key={task.id} id={task.id}>
							<>
								<DragAndDropItem
									id={task.id}
									text={task.title}
									onEdit={() => {
										console.log('');
									}}
									onDelete={() => {
										console.log('');
									}}
								/>
								<DndContext
									sensors={sensors}
									collisionDetection={closestCorners}
									onDragEnd={handleDragEnd}
									// onDragOver={(event) => console.log(event)}
									onDragMove={(event) => {
										const { active, over } = event;
										console.log('active: ', event);
										console.log('over: ', over?.id);
									}}
									onDragStart={({ active }) => {
										setActive(active.id);
									}}
								>
									<SortableContext
										items={nestedTasks}
										strategy={verticalListSortingStrategy}
									>
										{nestedTasks.map(
											(nestedTask) =>
												task.id ===
													nestedTask.parentId && (
													<DragAndDropContainer
														id={nestedTask.id}
														key={nestedTask.id}
													>
														<div
															style={{
																width: 'calc(100% - 20px)',
															}}
															onMouseDown={() => {
																console.log(
																	nestedTask.id,
																);
															}}
														>
															<DragAndDropItem
																key={
																	nestedTask.id
																}
																id={
																	nestedTask.id
																}
																text={
																	nestedTask.title
																}
																onEdit={() => {
																	console.log(
																		'',
																	);
																}}
																onDelete={() => {
																	console.log(
																		'',
																	);
																}}
															/>
														</div>
													</DragAndDropContainer>
												),
										)}
										<DragOverlay>
											{active && (
												<DragAndDropItem
													id={active}
													text={'test'}
													onEdit={() => {
														console.log('');
													}}
													onDelete={() => {
														console.log('');
													}}
												/>
											)}
										</DragOverlay>
									</SortableContext>
								</DndContext>
							</>
						</DragAndDropContainer>
					))}
				</SortableContext>
			</DndContext>
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
