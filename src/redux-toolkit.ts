import { State, Reducers, User, UsersState, ResponseUser, MyKnownError } from './type.d';
import { Todo } from './type';
import { configureStore, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { v1 as uuid } from 'uuid';

import _ from 'lodash';

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: 'Learn React',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux',
    isComplete: true,
  },
  {
    id: uuid(),
    desc: 'Learn Redux-ToolKit',
    isComplete: false,
  },
];

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    create: {
      reducer: (state, { payload }: PayloadAction<Todo>) => {
        state.push(payload);
      },
      prepare: ({ desc }: { desc: string }) => {
        return {
          payload: {
            id: uuid(),
            desc,
            isComplete: false,
          },
        };
      },
    },
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      const index = state.findIndex((todo) => todo.id === payload.id);
      if (index > -1) {
        state[index] = { ...state[index], ...payload };
      }
    },
    toggle: (state, { payload }: PayloadAction<{ id: string; isComplete: boolean }>) => {
      const index = state.findIndex((todo) => todo.id === payload.id);
      if (index > -1) {
        state[index] = { ...state[index], ...payload };
      }
    },
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      _.remove(state, (todo) => todo.id === payload.id);
    },
  },
});

const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id,
  },
});

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: (state) => state + 1,
    [todosSlice.actions.edit.type]: (state) => state + 1,
    [todosSlice.actions.toggle.type]: (state) => state + 1,
    [todosSlice.actions.remove.type]: (state) => state + 1,
  },
});

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator,
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;

const getUsers = createAsyncThunk<
  // Return type of the payload creator
  User[],
  // First argument to the payload creator
  string,
  // Types for ThunkAPI
  {
    rejectValue: MyKnownError;
  }
>('users/getUsers', async (endpoint: string, thunkApi) => {
  const response = await fetch(endpoint);
  if (!response.ok) return thunkApi.rejectWithValue((await response.json()) as MyKnownError);
  const toJson = await response.json();
  return toJson;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    loading: '',
    error: '',
    data: [],
  } as UsersState,
  reducers: {},
  // extraReducers: {
  //   [getUsers.pending.type]: (state) => {
  //     console.log('pending!');
  //     state.loading = 'yes';
  //   },
  //   [getUsers.rejected.type]: (state, action) => {
  //     state.loading = 'no';
  //     console.log('rejected!', action);
  //     state.error = action.error;
  //   },
  //   [getUsers.fulfilled.type]: (state, action) => {
  //     console.log('fulfilled!');
  //     state.loading = '';
  //     state.data = action.payload;
  //   },
  // },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state, { payload }) => {
      state.loading = 'yes';
    });

    builder.addCase(getUsers.rejected, (state, action: any) => {
      if (action.payload) {
        // Since we passed in `MyKnownError` to `rejectType` in `updateUser`, the type information will be available here.
        state.error = action.payload.errorMessage;
      } else {
        state.error = action.error;
      }
    });
    builder.addCase(getUsers.fulfilled, (state, { payload }) => {
      state.loading = '';
      state.data = payload;
    });
  },
});

export const getUsersActionCreator = getUsers;

const reducer: Reducers = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer,
  users: usersSlice.reducer,
};

export default configureStore({
  reducer,
});
