// @flow

import { all, call } from 'redux-saga/effects';

import rootSaga from '../../../src/sagas/index';
import accounts from '../../../src/sagas/accounts';
import activity from '../../../src/sagas/activity';
import navigation from '../../../src/sagas/navigation';
import key from '../../../src/sagas/key';
import settings from '../../../src/sagas/settings';
import wallet from '../../../src/sagas/wallet';
import serviceContainer from '../../../src/sagas/serviceContainer';
import modifyNation from '../../../src/sagas/modifyNation';

test('rootSaga', () => {
  const iterator = rootSaga();
  expect(iterator.next().value).toEqual(all([
    call(accounts),
    call(activity),
    call(navigation),
    call(key),
    call(settings),
    call(wallet),
    call(serviceContainer),
    call(modifyNation),
  ]));
});
