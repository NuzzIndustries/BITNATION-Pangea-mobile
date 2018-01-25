import React, { Component } from 'react';

export default class NavigatorComponent extends Component {

  constructor(props) {
    super(props);

    const { navigator } = this.props;

    if (navigator) {
      navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      this.onNavBarButtonPress(event.id);
    }
    switch (event.id) {
      case 'willAppear':
        this.onWillAppear();
        break;
      case 'didAppear':
        this.onDidAppear();
        break;
      case 'willDisappear':
        this.onWillDisappear();
        break;
      case 'didDisappear':
        this.onDidDisappear();
        break;
      case 'bottomTabReselected':
        this.onBottomTabReselected();
        break;
    }
  };

  onNavBarButtonPress(id: string) {
  }

  onWillAppear() {
  }

  onDidAppear() {
  }

  onWillDisappear() {
  }

  onDidDisappear() {
  }

  onBottomTabReselected() {
  }

}
