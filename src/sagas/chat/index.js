import { all, takeEvery } from 'redux-saga/effects';

import {
  SAVE_PROFILE,
  NEW_CHAT_SESSION,
  OPEN_CHAT_SESSION,
  SEND_MESSAGE,
  FETCH_ALL_CHATS,
  LOAD_CHAT_MESSAGES,
  PANTHALASSA_MESSAGE_PERSISTED,
} from '../../actions/chat';
import {
  saveProfileSaga,
  createChatSession,
  openChatSession,
  fetchAllChats,
  sendMessage,
  loadMessages,
  handlePanthalassaMessagePersisted,
} from './sagas';

/**
 * @desc Root activity saga.
 * @return {void}
 */
export default function* rootSaga() {
  yield all([
    takeEvery(FETCH_ALL_CHATS, fetchAllChats),
    takeEvery(SAVE_PROFILE, saveProfileSaga),
    takeEvery(NEW_CHAT_SESSION, createChatSession),
    takeEvery(OPEN_CHAT_SESSION, openChatSession),
    takeEvery(SEND_MESSAGE, sendMessage),
    takeEvery(LOAD_CHAT_MESSAGES, loadMessages),
    takeEvery(PANTHALASSA_MESSAGE_PERSISTED, handlePanthalassaMessagePersisted),
  ]);
}
