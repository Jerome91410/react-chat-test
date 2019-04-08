import {
  CHAT_ADD_MESSAGE,
  CHAT_UNSHIFT_MESSAGE,
  CHAT_FETCH_MESSAGES,
  CHAT_FETCHED_MESSAGES,
} from '../actions/constants';

const initialState = {
  messages: [],
  fetchingMessages: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case CHAT_UNSHIFT_MESSAGE:
      return { ...state, messages: [action.payload, ...state.messages] };
    case CHAT_FETCH_MESSAGES:
      return { ...state, fetchingMessages: true };
    case CHAT_FETCHED_MESSAGES:
      return { ...state, fetchingMessages: false };
    default:
      return state;
  }
};

export default reducer;
