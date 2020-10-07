import { State, Reducers, User, UsersState, ResponseUser } from './type.d';
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

// const fetchUserById = createAsyncThunk(
//   'users/fetchById',
//   // if you type your function argument here
//   async (userId: number): Promise<User> => {
//     const response = await fetch(`https://reqres.in/api/users/${userId}`);
//     const userResonse: ResponseUser = await (response.json() as any);
//     const { data: user } = userResonse;
//     console.log('FETCHED USER!!!!', user);
//     return user;
//   }
// );

// const initialState: UsersState = {
//   entities: [],
//   loading: 'idle',
// };

// const usersSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {
//     // fill in primary logic here
//   },
//   // extraReducers: (builder) => {
//   //   builder.addCase(fetchUserById.pending, (state, action) => {
//   //     // both `state` and `action` are now correctly typed
//   //     // based on the slice state and the `pending` action creator
//   //   });
//   // },
//   extraReducers: {
//     // Add reducers for additional action types here, and handle loading state as needed
//     [fetchUserById.fulfilled.type]: (state, { payload }: PayloadAction<User>) => {
//       // Add user to the state array
//       state.entities.push(payload);
//     },
//   },
// });

// export const fetchUserByIdActionCreator = fetchUserById;

// "http://jsonplaceholder.typicode.com/users"

const getUsers = createAsyncThunk('users/getUsers', async (endpoint: string, thunkApi) => {
  const response = await fetch(endpoint);
  if (!response.ok) throw Error(response.statusText);
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
  extraReducers: {
    [getUsers.pending.type]: (state) => {
      console.log('pending!');
      state.loading = 'yes';
    },
    [getUsers.rejected.type]: (state, action) => {
      state.loading = 'no';
      console.log('rejected!', action);
      state.error = action.error;
    },
    [getUsers.fulfilled.type]: (state, action) => {
      console.log('fulfilled!');
      state.loading = '';
      state.data = action.payload;
    },
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
