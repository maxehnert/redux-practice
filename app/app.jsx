import React, { PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'
import { combineReducers, createStore } from 'redux'
import { connect, Provider } from 'react-redux'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

// var React = require('react');
// var ReactDOM = require('react-dom');
// var combineReducers = require('redux');
// var createStore = require('redux');
// var connect = require('react-redux');
// var Provider = require('react-redux');
// var expect = require('expect');
// var deepFreeze = require('deep-freeze');
//reducer
const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

//reducer
const todos = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

//filter
const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

// calls multiple reducers and creates 1 reducer from them
//const { combineReducers } = Redux;
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

let nextTodoId = 0;
const addTodo = (text) => {
  return {
    type: 'ADD_TODO',
    id: nextTodoId++,
    text
  };
};

const toggleTodo = (id) => {
  return {
    type: 'TOGGLE_TODO',
    id
  };
};

const setVisibilityFilter = (filter) => {
  return {
    type: 'SET_VISIBILITY_FILTER',
    filter
  };
};

//const { Component } = React;
//const { connect } = ReactRedux;
// import { connect } from 'react-redux';

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active) {
    return <span>{children}</span>;
  }

  return (
    <a href='#'
       onClick={e => {
         e.preventDefault();
         onClick();
       }}
    >
      {children}
    </a>
  );
};

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active:
      ownProps.filter ===
      state.visibilityFilter
  };
};

const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch(
        setVisibilityFilter(ownProps.filter)
      );
    }
  };
};

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link);

// class FilterLink extends Component {
//   componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(() =>
//       this.forceUpdate()
//     );
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//   }

//   render() {
//     const props = this.props;
//     const { store } = this.context;
//     const state = store.getState();

//     return (
//       <Link
//         active={

//         }
//         onClick={() =>
//           store.
//        }
//       >
//         {props.children}
//       </Link>
//     );
//   }
// }

// FilterLink.contextTypes = {
//   store: React.PropTypes.object
// };

const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
      All
    </FilterLink>
    {', '}
    <FilterLink
      filter='SHOW_ACTIVE'
    >
      Active
    </FilterLink>
    {', '}
    <FilterLink
      filter='SHOW_COMPLETED'
    >
      Completed
    </FilterLink>
  </p>
);

const Todo = ({
  onClick,
  completed,
  text
}) => (
  <li
    onClick={onClick}
    style={{
      textDecoration:
        completed ?
          'line-through' :
          'none'
    }}
  >
    {text}
  </li>
);

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {todos.map(todo =>
      <Todo
        key={todo.id}
        {...todo}
        onClick={() => onTodoClick(todo.id)}
      />
    )}
  </ul>

);

let AddTodo = ({dispatch}) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        dispatch(addTodo(input.value));
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};
AddTodo = connect()(AddTodo);

const getVisibleTodos = (
  todos,
  filter
) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
}

const mapStateToTodoListProps = (
  state
) => {
  return {
    todos: getVisibleTodos(
      state.todos,
      state.visibilityFilter
    )
  };
};

const mapDispatchToTodoListProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id));
    }
  };
};

const VisibleTodoList = connect(
  mapStateToTodoListProps,
  mapDispatchToTodoListProps
)(TodoList);
// class VisibleTodoList extends Component {
//     componentDidMount() {
//     const { store } = this.context;
//     this.unsubscribe = store.subscribe(() =>
//       this.forceUpdate()
//     );
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//   }

//   render() {
//     const props = this.props;
//     const { store } = this.context;
//     const state = store.getState();

//     return (
//       <TodoList
//         todos={

//         }
//         onTodoClick={
//         }
//       />
//     );
//   }
// }

// VisibleTodoList.contextTypes = {
//   store: React.PropTypes.object
// };

const TodoApp =() => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

// class Provider extends Component {
//   getChildContext() {
//     return {
//       store: this.props.store
//     };
//   }

//   render() {
//     return this.props.children;
//   }
// }

// Provider.childContextTypes = {
//   store: React.PropTypes.object
// };

//const { Provider } = ReactRedux;
// import { Provider } from 'react-redux';


const { createStore } = Redux;

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
  <TodoApp />
  </Provider>,
  document.getElementById('root')
);

const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: "ADD_TODO",
    id: 0,
    text: "Learn Redux"
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go Shopping',
      completed: false
    }
  ];
  const action = {
    type: "TOGGLE_TODO",
    id: 1
  };
  const stateAfter = [
    {
      id: 0,
      text: 'Learn Redux',
      completed: false
    },
    {
      id: 1,
      text: 'Go Shopping',
      completed: true
    }
  ];

  deepFreeze(stateAfter);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log('tests sucessful');
