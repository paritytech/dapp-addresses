import React, { Component } from 'react';
import { bonds, InlineAccount, AccountLabel, InlineBalance, AccountIcon } from 'parity-reactive-ui';
import { formatBalance } from 'oo7-parity';
import { ReactiveComponent, Rspan } from 'oo7-react';

import './AddressCard.css';

export default class AddressCard extends Component{
  constructor(){
    super();
  }

  render(){
    console.log('accinfo',this.props.address);
    return (<div className="AddressCard" >
      <AccountIcon address={this.props.address} />
      <InlineBalance value={bonds.balance(this.props.address)} />
      <Rspan>{bonds.accountsInfo[this.props.address].name}</Rspan>
      <span>{this.props.address}</span>
    </div>);
  }
}
