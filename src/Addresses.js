import React, { Component } from 'react';
import { bonds, InlineAccount, AccountLabel } from 'parity-reactive-ui';
// import List from '@parity/dapp-accounts/src/List';
// import Summary from '@parity/dapp-accounts/src/Summary';


export default class Addresses extends Component {

  render(){
    console.log('works');
    return (<AccountLabel address={bonds.me} />);
  }
}
