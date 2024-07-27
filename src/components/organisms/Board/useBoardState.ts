import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePrevoius from 'src/hooks/usePrevoius';
import { setItems } from 'src/store/DragAndDropStore/DragAndDropStore'; // Importuj akcję
import { RootState } from 'src/store/store';
import { isEqual } from 'lodash';

export type ContainerTask = { id: string; title: string; parentId?: string };

export type TasksState = {
	level1: ContainerTask[];
	level2: ContainerTask[];
	level3: ContainerTask[];
};

export const useBoardState = () => {
	const dispatch = useDispatch();
	const persistedTasks = useSelector((state: RootState) => state.tasks);
	const isHistory = useSelector((state: RootState) => state.isHistory);

	const [isAddNewCardItem, setIsAddNewCardItem] = useState(false);
	const [history, setHistory] = useState<TasksState[]>([]);
	const historyCurrentStep = useRef(0);
	const [historyStepsBack, setHistoryStepsBack] = useState(0);
	const historyTotalSteps = useRef(0);

	const handleChangeOrder = (
		updatedTasks: ContainerTask[],
		level: keyof TasksState,
	) => {
		dispatch(
			setItems({
				tasks: { ...persistedTasks, [level]: updatedTasks },
			}),
		);
	};

	const handleAddItem = (newTask: ContainerTask, level: keyof TasksState) => {
		dispatch(
			setItems({
				tasks: {
					...persistedTasks,
					[level]: [...persistedTasks[level], newTask],
				},
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
		dispatch(setItems({ tasks: newTasks }));
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

		dispatch(setItems({ tasks: updatedTasks }));
	};

	const previousTasks = usePrevoius(persistedTasks);

	const onUndo = () => {
		if (historyCurrentStep.current > 1) {
			historyCurrentStep.current -= 1;
			setHistoryStepsBack(historyStepsBack + 1);
			dispatch(
				setItems({
					tasks: history[historyCurrentStep.current],
					isHistory: true,
				}),
			);
		}
	};

	const onRedo = () => {
		if (historyCurrentStep.current < history.length - 1) {
			historyCurrentStep.current += 1;
			setHistoryStepsBack(historyStepsBack - 1);
			dispatch(
				setItems({
					tasks: history[historyCurrentStep.current],
					isHistory: true,
				}),
			);
		}
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
				event.preventDefault();
				onUndo();
			}
			if ((event.metaKey || event.ctrlKey) && event.key === 'y') {
				event.preventDefault();
				onRedo();
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [historyCurrentStep.current, historyTotalSteps.current]);

	useEffect(() => {
		if (!isEqual(persistedTasks, previousTasks) && historyStepsBack === 0) {
			setHistory((prevState) => [...prevState, persistedTasks]);
			historyTotalSteps.current += 1;
		}
		if (historyStepsBack > 0 && !isHistory) {
			setHistoryStepsBack(0);
			setHistory((prevState) => [
				...prevState.slice(0, historyCurrentStep.current),
				persistedTasks,
			]);
			historyCurrentStep.current += 1;
		}
	}, [isHistory, persistedTasks, previousTasks, historyStepsBack]);

	useEffect(() => {
		if (historyStepsBack === 0) {
			historyCurrentStep.current = history.length - 1;
		}
	}, [history, historyStepsBack, historyCurrentStep.current, isHistory]);

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
