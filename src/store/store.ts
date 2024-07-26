import { configureStore } from '@reduxjs/toolkit';
import { dragAndDropSliceReducer } from './DragAndDropStore/DragAndDropStore';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
	key: 'root',
	storage,
};

const persistedReducer = persistReducer(persistConfig, dragAndDropSliceReducer);

export const store = configureStore({
	reducer: persistedReducer,
	devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
export const persistor = persistStore(store);
