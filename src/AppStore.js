import {
  createStore, combineReducers, compose, applyMiddleware,
} from 'redux';
import { createLogicMiddleware } from 'redux-logic';

import chatReducer from './reducers/chat';
import chatLogic from './logics/chat';

const appReducers = combineReducers({
  chat: chatReducer,
});

const logicMiddleWare = createLogicMiddleware([...chatLogic], {});

const middleware = applyMiddleware(logicMiddleWare);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(appReducers, composeEnhancers(middleware));

export default store;
