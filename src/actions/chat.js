import {
  CHAT_ADD_MESSAGE,
  CHAT_FETCH_MESSAGES,
  CHAT_FETCHED_MESSAGES,
  CHAT_UNSHIFT_MESSAGE,
  CHAT_SEND_MESSAGE,
} from './constants';

export const addMessage = payload => ({
  type: CHAT_ADD_MESSAGE,
  payload,
});

export const fetchMessages = payload => ({
  type: CHAT_FETCH_MESSAGES,
  payload,
});

export const fetchedMessages = () => ({
  type: CHAT_FETCHED_MESSAGES,
});

export const unshitMessage = payload => ({
  type: CHAT_UNSHIFT_MESSAGE,
  payload,
});

export const sendMessage = payload => ({
  type: CHAT_SEND_MESSAGE,
  payload,
});
