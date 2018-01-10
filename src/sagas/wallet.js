import { takeEvery, call, put } from 'redux-saga/effects';

import { CREATE_WALLET, CREATE_MNEMONIC, createMnemonic } from '../actions/wallet';

async function createPrivateKey() {
  return 'privateKey_privateKey';
}

async function privateKeyToMnemonic(privateKey) {
  return ['a', 'b', 'c', 'test', 'word', 'word', 'word', 'word', 'word', 'word', 'word', 'word', 'word',
    'word', 'word', 'word', 'word', 'word', 'word', 'word', 'word', 'word', 'word', 'word'];
}

function* createWallet() {
  const privateKey = yield call(createPrivateKey);
  const mnemonic = yield call(privateKeyToMnemonic, privateKey);
  yield put(createMnemonic(mnemonic));
}

export default function* watchCreateWallet() {
  yield takeEvery(CREATE_WALLET, createWallet);
}
