import { useState } from 'react';

export type ContainerTask = { id: string; title: string; parentId?: string };

type TasksState = {
	level1: ContainerTask[];
	level2: ContainerTask[];
	level3: ContainerTask[];
};

export const useBoardState = () => {
	const [tasks, setTasks] = useState<TasksState>({
		level1: [
			{ id: '1', title: 'Add tests to homepage' },
			{ id: '2', title: 'Fix styling in about section' },
			{ id: '3', title: 'Learn how to center a div' },
		],
		level2: [
			{ id: '4', title: 'nested 1', parentId: '1' },
			{ id: '5', title: 'nested 2', parentId: '1' },
			{ id: '6', title: 'nested 3', parentId: '2' },
			{ id: '7', title: 'nested 4', parentId: '2' },
			{ id: '8', title: 'nested 5', parentId: '3' },
			{ id: '9', title: 'nested 6', parentId: '3' },
		],
		level3: [
			{ id: '10', title: 'nested 7', parentId: '8' },
			{ id: '11', title: 'nested 8', parentId: '8' },
			{ id: '12', title: 'nested 9', parentId: '8' },
		],
	});

	const [isAddNewCardItem, setIsAddNewCardItem] = useState(false);

	const handleChangeOrder = (
		updatedTasks: ContainerTask[],
		level: keyof typeof tasks,
	) => {
		setTasks((prevTasks) => ({
			...prevTasks,
			[level]: updatedTasks,
		}));
	};

	const handleAddItem = (
		newTask: ContainerTask,
		level: keyof typeof tasks,
	) => {
		setTasks((prevTasks) => ({
			...prevTasks,
			[level]: [...tasks[level], newTask],
		}));
	};

	const handleDeleteItem = (id: string) => {
		setTasks((prevTasks) => {
			const newTasks: TasksState = { ...prevTasks };

			const removeTaskAndChildren = (
				id: string,
				level: keyof TasksState,
			) => {
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
			};

			(Object.keys(newTasks) as (keyof TasksState)[]).forEach((level) => {
				newTasks[level].forEach((task) => {
					if (task.id === id) {
						removeTaskAndChildren(task.id, level);
					}
				});
			});

			return newTasks;
		});
	};

	return {
		tasks,
		isAddNewCardItem,
		setIsAddNewCardItem,
		handleChangeOrder,
		handleAddItem,
		handleDeleteItem,
	};
};
