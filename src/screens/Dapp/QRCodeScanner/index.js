// @flow

import React from 'react';

import { Alert, Text, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import DAppsService from '../../../services/dApps';
import styles from './styles';
import NavigatorComponent from '../../../components/common/NavigatorComponent';
import i18n from '../../../global/i18n';
import Loading from '../../../components/common/Loading';

type Props = {
  /**
   * @desc Specifies type of connecting node
   */
  connectionType: 'devHost' | 'logger',
}

type State = {
  /**
   * @desc Flag that shows if connecting is currently in progress.
   */
  isConnecting: boolean,
}

export default class DAppQRCodeScannerScreen extends NavigatorComponent<Props, State> {
  static defaultProps: {
    connectionType: 'devHost',
  };

  constructor(props: any) {
    super(props);

    this.state = { isConnecting: false };

    // @todo For test purposes, needs to be removed
    DAppsService.getDApps().then((result) => {
      console.log(`[DApp] DApps list: ${result}`);
    });
  }

  scanner: ?QRCodeScanner;

  onNavBarButtonPress(id: string) {
    if (id === 'cancel') {
      this.props.navigator.pop();
    }
  }

  onReadQRCode = (address: string) => {
    this.setState({ isConnecting: true });
    const connectFunction = this.props.connectionType === 'devHost'
      ? DAppsService.connectToDAppHost
      : DAppsService.connectToLogger;
    connectFunction(address).then(() => {
      Alert.alert('Success', null, [
        {
          text: i18n.t('common.ok'),
          onPress: () => {
            this.props.navigator.pop();
          },
        },
      ]);
    }).catch((error) => {
      Alert.alert(`Connect failed with error ${error}`, null, [
        {
          text: i18n.t('common.ok'),
          onPress: () => {
            if (this.scanner) {
              this.scanner.reactivate();
            }
          },
        },
      ]);
    }).finally(() => {
      this.setState({ isConnecting: false });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={result => this.onReadQRCode(result.data)}
          topContent={
            <Text style={styles.centerText}>{i18n.t('screens.dAppQRCodeScanner.instruction')}</Text>
          }
          ref={scanner => (this.scanner = scanner)}
        />
        {this.state.isConnecting === true ? <Loading /> : null}
      </View>
    );
  }
}
