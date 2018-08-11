// @flow

import { NativeModules } from 'react-native';

import { convertFromPanthalassa } from '../../utils/mapping/dapp';
import type { DApp } from '../../types/DApp';
import * as Panthalassa from '../panthalassa';

const DAPP_START_TIMEOUT = 30;

export default class DAppsService {
  static async startDApp(dAppPublicKey: string): Promise<boolean> {
    return Panthalassa.panthalassaStartDApp(dAppPublicKey, DAPP_START_TIMEOUT);
  }

  static async stopDApp(dAppPublicKey: string): Promise<boolean> {
    return Panthalassa.panthalassaStopDApp(dAppPublicKey);
  }

  static async openDApp(publicKey: string, context: Object): Promise<boolean> {
    return Panthalassa.panthalassaOpenDApp(publicKey, JSON.stringify(context));
  }

  static async getDApps(): Promise<Array<DApp>> {
    try {
      const dApps = await Panthalassa.panthalassaDApps();
      const parsed = JSON.parse(dApps);
      return parsed.map(convertFromPanthalassa);
    } catch (error) {
      console.log(`[PANGEA] Failed to get DApps ${error.message}`);
      return [];
    }
  }

  static async connectToDAppHost(address: string): Promise<boolean> {
    return Panthalassa.panthalassaConnectToDAppDevHost(address);
  }

  static async connectToLogger(address: string): Promise<boolean> {
    await Panthalassa.panthalassaConnectLogger(address);
    return Panthalassa.panthalassaSetLogger('DEBUG');
  }

  static async performDAppCallback(dappPublicKey: string, id: number, params: Object) {
    return Panthalassa.panthalassaCallDAppFunction(dappPublicKey, id, JSON.stringify(params));
  }
}
