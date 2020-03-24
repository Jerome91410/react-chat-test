import { createLogic } from 'redux-logic';
import faker from 'faker';
import random from 'lodash/random';

import { addMessage, fetchedMessages, unshitMessage } from '../actions/chat';

import { CHAT_FETCH_MESSAGES, CHAT_SEND_MESSAGE } from '../actions/constants';

const sendMessageLogic = createLogic({
  type: CHAT_SEND_MESSAGE,
  latest: true,
  async process({ action }, dispatch, done) {
    const { content, from = 'you', type = 'message' } = action.payload;
    // add message to the store
    dispatch(
      addMessage({
        content,
        createdAt: new Date().toISOString(),
        from,
        type,
      }),
    );
    done();
  },
});

const fetchMessagesLogic = createLogic({
  type: CHAT_FETCH_MESSAGES,
  latest: false,
  warnTimeout: 0,
  validate({ getState, action }, allow, reject) {
    if (!getState().chat.fetchingMessages) {
      allow(action);
    } else {
      reject();
    }
  },
  async process({ action }, dispatch, done) {
    const { before = Date.now(), nb = 25 } = action.payload;
    for (let i = 0; i < nb; i += 1) {
      const createdAt = new Date(new Date(before).getTime() - 2000 * i).toISOString();
      // add in first position a message
      let content = faker.lorem.sentence();
      const nbSentences = random(0, 10);
      for (let j = 0; j < nbSentences; j += 1) {
        content += faker.lorem.sentence();
      }
      dispatch(
        unshitMessage({
          content,
          createdAt,
          from: faker.internet.userName(),
          type: 'message',
        }),
      );
    }
    setTimeout(() => {
      dispatch(fetchedMessages());
      done();
    }, 200);
  },
});

export default [sendMessageLogic, fetchMessagesLogic];
