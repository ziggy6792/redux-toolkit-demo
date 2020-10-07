export interface Todo {
  id: string;
  desc: string;
  isComplete: boolean;
}

// interface UsersState {
//   entities: [];
//   loading: 'idle' | 'pending' | 'succeeded' | 'failed';
// }

interface MyKnownError {
  errorMessage: string;
  // ...
}

export interface UsersState {
  loading: string;
  error: SerializedError | string;
  data: User[];
}

export interface State {
  todos: Todo[];
  selectedTodo: string | null;
  counter: number;
  users: UsersState;
}

export interface Reducers {
  todos: Reducer<Todo[], AnyAction>;
  selectedTodo: Reducer<boolean, AnyAction>;
  counter: Reducer<number, AnyAction>;
  users: Reducer<UsersState, AnyAction>;
}

export interface Contact {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

// export interface User {
//   id: number;
//   email: string;
//   first_name: string;
//   last_name: string;
//   avatar: string;
// }

export interface ResponseUser {
  data: User;
}

// Users

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}
export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}
export interface Geo {
  lat: string;
  lng: string;
}
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
