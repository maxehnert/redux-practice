const counter = (state = 0, action) => {
  switch(action.type) {
    case 'INCREMENT':
      return state + 1;
    case'DECREMENT':
      return state - 1;
    default:
    return state;
  }
};

expect(
  counter(0, { type: 'INCREMENT' })
).toEqual(1);

expect(
  counter(1, { type: 'INCREMENT' })
).toEqual(2);

expect(
  counter(2, { type: 'DECREMENT' })
).toEqual(1);

expect(
  counter(1, { type: 'DECREMENT' })
).toEqual(0);

expect(
  counter(1, { type: 'SOMETHING_ELSE' })
).toEqual(1);

expect(
  counter(undefined, {})
).toEqual(0);


console.log('tests passed');

/*************/

const { createStore } = Redux;
// var createStore = REdux.createStore;
// import { createStore } from 'redux';

// the store binds together the 3 principles from redux
// it holds the current application state object
// it lets you dispatch actions
// when you create it, you need to specify the reducder which tells how state is updated with actions

const store = createStore(counter);
// the store has 3 important methods
// getState  - it retrieves the current state of the store
// dispatch  - it lets you dispatch actions to change the state of your application
// subscribe - it lets you register a callback the the redux store will call anytime and action has been dispatched so you can update the UI of your application to reflect the current application state

const Counter = ({
  value,
  onIncrement,
  onDecrement
}) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() =>
        store.dispatch({
          type: 'INCREMENT'
        })
      }
      onDecrement={() =>
        store.dispatch({
          type: 'DECREMENT'
        })
      }
    />,
  document.getElementById('counter')
  );
}
store.subscribe(render);
render();
