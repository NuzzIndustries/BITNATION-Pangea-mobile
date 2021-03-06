import reducer, { initialState } from '../../../src/reducers/key';
import {
  changeEnteredMnemonic,
  changeMnemonicValid,
  validateEnteredMnemonic,
} from '../../../src/actions/key';
import { KEY_LENGTH } from '../../../src/global/Constants';
import { servicesDestroyed } from '../../../src/actions/serviceContainer';

describe('key reducer action handling', () => {
  const mockMnemonic = new Array(KEY_LENGTH).fill('abc');

  test('after service destroy returns initial state', () => {
    const changedState = reducer(initialState, changeEnteredMnemonic(mockMnemonic));
    expect(reducer(changedState, servicesDestroyed())).toEqual(initialState);
  });

  test('changeEnteredMnemonic', () => {
    const stateBefore = initialState;
    const stateAfter = reducer(stateBefore, changeEnteredMnemonic(mockMnemonic));
    expect(stateAfter).toEqual({
      ...stateBefore,
      enteredMnemonic: mockMnemonic,
    });
  });

  test('validateEnteredMnemonic', () => {
    const stateBefore = initialState;
    const stateAfter = reducer(stateBefore, validateEnteredMnemonic());
    expect(stateAfter).toEqual({
      ...stateBefore,
      mnemonicValid: null,
      mnemonicValidationInProgress: true,
    });
  });

  describe('changeMnemonicValid', () => {
    const testSetToValue = (value) => {
      const stateBefore = initialState;
      const stateAfter = reducer(stateBefore, changeMnemonicValid(value));
      expect(stateAfter).toEqual({
        ...stateBefore,
        mnemonicValid: value,
        mnemonicValidationInProgress: false,
      });
    };

    test('set to true', () => {
      testSetToValue(true);
    });

    test('set to false', () => {
      testSetToValue(false);
    });
  });
});
