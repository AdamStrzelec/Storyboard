import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItems, addItem } from 'src/store/DragAndDropStore/DragAndDropStore'; // Importuj akcję
import { RootState } from 'src/store/store';

export type ContainerTask = { id: string; title: string; parentId?: string };

type TasksState = {
	level1: ContainerTask[];
	level2: ContainerTask[];
	level3: ContainerTask[];
};

export const useBoardState = () => {
	const dispatch = useDispatch();
	const persistedTasks = useSelector((state: RootState) => state);

	const [isAddNewCardItem, setIsAddNewCardItem] = useState(false);

	const handleChangeOrder = (
		updatedTasks: ContainerTask[],
		level: keyof TasksState,
	) => {
		dispatch(setItems({ ...persistedTasks, [level]: updatedTasks }));
	};

	const handleAddItem = (newTask: ContainerTask, level: keyof TasksState) => {
		dispatch(
			addItem({
				level,
				newTask,
			}),
		);
	};

	const handleDeleteItem = (id: string) => {
		const newTasks: TasksState = { ...persistedTasks };

		const removeTaskAndChildren = (id: string, level: keyof TasksState) => {
			if (Array.isArray(newTasks[level])) {
				newTasks[level] = newTasks[level].filter(
					(task) => task.id !== id,
				);

				const nextLevel =
					level === 'level1'
						? 'level2'
						: level === 'level2'
							? 'level3'
							: null;

				if (nextLevel) {
					const childTasks = newTasks[nextLevel].filter(
						(task) => task.parentId === id,
					);
					childTasks.forEach((childTask) =>
						removeTaskAndChildren(childTask.id, nextLevel),
					);
				}
			}
		};

		(Object.keys(newTasks) as (keyof TasksState)[]).forEach((level) => {
			if (Array.isArray(newTasks[level])) {
				newTasks[level].forEach((task) => {
					if (task.id === id) {
						removeTaskAndChildren(task.id, level);
					}
				});
			}
		});

		dispatch(setItems(newTasks));
	};

	const handleChangeItemTitle = ({
		id,
		title,
	}: {
		id: string;
		title: string;
	}) => {
		const updatedTasks = { ...persistedTasks };

		const updateTaskTitle = (level: keyof TasksState) => {
			if (Array.isArray(updatedTasks[level as keyof TasksState])) {
				updatedTasks[level] = updatedTasks[level].map((task) =>
					task.id === id ? { ...task, title } : task,
				);
			}
		};
		Object.keys(updatedTasks).forEach((level) => {
			updateTaskTitle(level as keyof TasksState);
		});

		dispatch(setItems(updatedTasks));
	};

	return {
		tasks: persistedTasks,
		isAddNewCardItem,
		setIsAddNewCardItem,
		handleChangeOrder,
		handleAddItem,
		handleDeleteItem,
		handleChangeItemTitle,
	};
};
