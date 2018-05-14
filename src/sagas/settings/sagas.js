// @flow

/* eslint-disable no-use-before-define */
import { call, put, select } from 'redux-saga/effects';
import type { Realm } from 'realm';
import { factory as dbFactory } from '../../services/database';
import { currentAccountBasedUpdate } from '../accounts/sagas';
import type { AccountSettingsType } from '../../services/database/schemata';
import { settingsUpdated } from '../../actions/settings';
import { convertFromDatabase, convertToDatabase } from '../../utils/mapping/settings';
import type { LoadSettings, SaveSettings } from '../../actions/settings';

/**
 * @desc Generator to be called on database change. Used to update settings.
 * @param {*} collection Updated settings collection
 * @return {void}
 */
export function* onCurrentAccountChange(collection: Realm.Result<AccountSettingsType>): Generator<*, *, *> {
  if (collection.length === 0) {
    return;
  }

  const settings = collection[0];
  const convertedSettings = yield call(convertFromDatabase, settings);
  yield put(settingsUpdated(convertedSettings));
}

/**
 * @desc Function that creates Realm results fetching settings for specific account.
 * @param {Realm} db Realm instance.
 * @param {string|null} accountId Id of account to fetch settings or null.
 * @return {Realm.Results<AccountSettings>|null} Realm results fetching settings for specified account or null if not applicable.
 */
export function buildAccountSettingsResults(db: Realm, accountId: string | null) {
  if (accountId === null) {
    return null;
  }
  return db.objects('AccountSettings').filtered(`id == '${accountId}'`);
}

/**
 * @desc Starts listen to settings updates in database.
 * @return {void}
 */
export function* startDatabaseListening(): Generator<*, *, *> {
  yield call(currentAccountBasedUpdate, buildAccountSettingsResults, onCurrentAccountChange);
}

/**
 * @desc Loads settings for specific account.
 * @param {LoadSettings} action An action.
 * @return {void}
 */
export function* loadSettings(action: LoadSettings): Generator<*, *, *> {
  const db: Realm = yield call(dbFactory);
  const objects = db.objects('AccountSettings').filtered(`id == '${action.accountId}'`);
  if (objects.length === 0) {
    yield call(action.callback, false);
    return;
  }
  const settings = objects[0];

  yield put(settingsUpdated(convertFromDatabase(settings)));
  yield call(action.callback, true);
}

/**
 * @desc Saves settings for specific account.
 * @param {SaveSettings} action An action.
 * @return {void}
 */
export function* saveSettings(action: SaveSettings): Generator<*, *, *> {
  const { settings } = yield select();
  const db: Realm = yield call(dbFactory);
  db.write(() => {
    db.create('AccountSettings', convertToDatabase(settings, action.accountId), true);
  });

  yield put(settingsUpdated(convertFromDatabase(settings)));
  yield call(action.callback, true);
}
