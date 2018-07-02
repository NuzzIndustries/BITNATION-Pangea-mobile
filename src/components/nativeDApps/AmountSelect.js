/* eslint-disable no-use-before-define */
// @flow

import React, { Component } from 'react';
import { MediaQueryStyleSheet } from 'react-native-responsive';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import ActionSheet from 'react-native-actionsheet';

import type { WalletType } from '../../types/Wallet';
import View from '../dApps/View';
import i18n from '../../global/i18n';
import GlobalStyles from '../../global/Styles';
import Colors from '../../global/colors';

type InternalProps = {
  /**
   * @desc Wallets array
   */
  wallets: Array<WalletType>
};

export type Props = {
  /**
   * @desc Style to apply to container view.
   */
  style: Object,
  /**
   * @desc
   */
  onAmountSelected: (amount: string, currency: string, walletAddress: string) => void,
}

type State = {
  selectedAmount: string,
  selectedWalletIndex: number,
};

export default class AmountSelect extends Component<Props & InternalProps, State> {
  constructor(props: Props & InternalProps) {
    super(props);

    this.state = {
      selectedAmount: '',
      selectedWalletIndex: 0,
    };
  }

  onSelectWallet = (index: number) => {
    if (index < this.props.wallets.length) {
      this.setState({ selectedWalletIndex: index });
    }
  };

  actionSheet: any;

  componentDidUpdate(prevProps: Props & InternalProps, prevState: State) {
    if (this.state.selectedAmount !== prevState.selectedAmount
    || this.state.selectedWalletIndex !== prevState.selectedWalletIndex) {
      const wallet = this.props.wallets[this.state.selectedWalletIndex];
      this.props.onAmountSelected(this.state.selectedAmount, wallet.currency, wallet.ethAddress);
    }
  }

  render() {
    const walletToShow = this.props.wallets[this.state.selectedWalletIndex];
    const { balance: balanceString } = walletToShow;
    const balanceToShow = balanceString == null ?
      i18n.t('common.updating') :
      `${walletToShow.currency} ${i18n.t('common.balance')} ${balanceString}`;
    const walletOptions = this.props.wallets.map(wallet => wallet.currency)
      .concat(i18n.t('common.cancel'));

    return (
      <View style={[this.props.style, styles.container]}>
        <View style={styles.textsView}>
          <Text style={GlobalStyles.footnote}>
            {i18n.t('common.amount')}
          </Text>
          <Text style={[GlobalStyles.currencyMedium, styles.balanceText]}>
            {balanceToShow}
          </Text>
        </View>
        <View style={styles.textInputContainer}>
          <TouchableOpacity onPress={() => this.actionSheet.show()}>
            <Text style={styles.currencyPlaceholder}>
              {walletToShow.currency}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.textInputInContainer, GlobalStyles.currencyLarge, styles.currencyNumber, styles.textInput]}
            placeholder='0.00000'
            placeholderTextColor={Colors.placeholderTextColor}
            onChangeText={selectedAmount => this.setState({ selectedAmount })}
            value={this.state.selectedAmount}
            keyboardType='numeric'
          />
          <ActionSheet
            ref={(o) => {
              this.actionSheet = o;
            }}
            options={walletOptions}
            cancelButtonIndex={walletOptions.length - 1}
            onPress={this.onSelectWallet}
          />
        </View>
      </View>
    );
  }
}

const styles = MediaQueryStyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  textsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginLeft: 12,
    marginRight: 12,
  },
  balanceText: {
    ...GlobalStyles.currencyMedium,
    color: Colors.BitnationDarkGrayColor,
  },
  textInputContainer: {
    backgroundColor: Colors.white,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 25,
    height: 50,
  },
  currencyNumber: {
    fontWeight: 'normal',
    color: Colors.BitnationHighlightColor,
  },
  textInput: {
    flex: 1,
  },
  currencyPlaceholder: {
    ...GlobalStyles.currencyLarge,
    color: Colors.placeholderTextColor,
    marginTop: 6,
    fontSize: 15,
    marginRight: 12,
  },
});
