import { call, put, select, takeEvery, all } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
  CANCEL_LOADING, REQUEST_JOIN_NATION, REQUEST_LEAVE_NATION, START_NATIONS_SYNC,
  doneSyncNations, doneFetchNations, fetchNationsStarted, requestSyncNations,
} from '../actions/nations';
import { getPangeaLibrary } from '../services/container';
import { checkConnection } from '../utils/connectivity';
import { NATION_INDEX_PERIOD } from '../global/Constants';
import { openedNation } from '../reducers/nations';
import { convertFromDatabase } from '../utils/nations';
import { errorAlert } from '../global/alerts';

const extractMessage = (error) => {
  if (error.transKey !== undefined) {
    return error;
  }
  if (error.toString().indexOf('insufficient') !== -1) {
    return { transKey: 'insufficientFunds' };
  }
  return error;
};

export const getNations = state => state.nations;

/**
 * @desc Synchronize redux state with database.
 */
export function* syncNations() {
  try {
    const pangeaLib = yield call(getPangeaLibrary);
    const nations = yield call(pangeaLib.eth.nation.all);
    const mappedNations = nations.map(convertFromDatabase);
    yield put(doneSyncNations([...mappedNations]));
  } catch (e) {
    console.log('Sync nation error: ', e);
  }
}

/**
 * @desc Repeat indexing regularly by some period of time.
 */
export function* startNationIndexingWorker() {
  const pangeaLib = yield call(getPangeaLibrary);
  while (true) {
    try {
      yield put(fetchNationsStarted());
      yield call(checkConnection);
      yield call(pangeaLib.eth.nation.index);
      yield call(syncNations);
      yield put(doneFetchNations());
    } catch (e) {
      console.log('Index nation error: ', e);
      errorAlert(extractMessage(e));
      yield put({ type: CANCEL_LOADING });
    }
    yield delay(NATION_INDEX_PERIOD);
  }
}

export function* joinNation() {
  try {
    const pangeaLib = yield call(getPangeaLibrary);
    const nationsState = yield select(getNations);
    const currentNation = openedNation(nationsState);
    yield call(checkConnection);
    yield call(pangeaLib.eth.nation.joinNation, currentNation);
    // console.log('joined nation: ', result);
    yield put({ type: CANCEL_LOADING });
    yield put(requestSyncNations());
  } catch (e) {
    console.log('Join nation error: ', e);
    errorAlert(extractMessage(e));
    yield put({ type: CANCEL_LOADING });
  }
}

export function* leaveNation() {
  try {
    const pangeaLib = yield call(getPangeaLibrary);
    const nationsState = yield select(getNations);
    const currentNation = openedNation(nationsState);
    yield call(checkConnection);
    yield call(pangeaLib.eth.nation.leaveNation, currentNation);
    // console.log('leave nation: ', result);
    yield put({ type: CANCEL_LOADING });
    yield put(requestSyncNations());
  } catch (e) {
    console.log('Leave nation error: ', e);
    errorAlert(extractMessage(e));
    yield put({ type: CANCEL_LOADING });
  }
}

export default function* watchNationUpdate() {
  yield all([
    yield takeEvery(START_NATIONS_SYNC, syncNations),
    yield takeEvery(REQUEST_JOIN_NATION, joinNation),
    yield takeEvery(REQUEST_LEAVE_NATION, leaveNation),
    yield call(startNationIndexingWorker),
  ]);
}
