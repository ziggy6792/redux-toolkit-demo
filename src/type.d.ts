export interface Todo {
  id: string;
  desc: string;
  isComplete: boolean;
}

export interface State {
  todos: Todo[];
  selectedTodo: string | null;
  counter: number;
}

export interface Reducers {
  todos: Reducer<Todo[], AnyAction>;
  selectedTodo: Reducer<boolean, AnyAction>;
  counter: Reducer<number, AnyAction>;
}
