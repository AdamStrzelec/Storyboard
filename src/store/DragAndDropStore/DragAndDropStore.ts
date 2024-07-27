import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
	id: string;
	title: string;
	parentId?: string;
}

interface TasksState {
	tasks: {
		level1: Task[];
		level2: Task[];
		level3: Task[];
	};
	isHistory?: boolean;
}

const initialState: TasksState = {
	tasks: {
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
	},
	isHistory: false,
};

export const dragAndDropSlice = createSlice({
	name: 'dragAndDrop',
	initialState,
	reducers: {
		setItems(state, action: PayloadAction<TasksState>) {
			state.tasks.level1 = action.payload.tasks.level1;
			state.tasks.level2 = action.payload.tasks.level2;
			state.tasks.level3 = action.payload.tasks.level3;
			state.isHistory = action.payload.isHistory ?? false;
		},
		addItem(
			state,
			action: PayloadAction<{
				level: keyof TasksState['tasks'];
				newTask: Task;
			}>,
		) {
			const { level, newTask } = action.payload;
			state.tasks[level] = [...state.tasks[level], newTask];
		},
	},
});

export const { setItems, addItem } = dragAndDropSlice.actions;
export const dragAndDropSliceReducer = dragAndDropSlice.reducer;
