import React, { Component } from 'react';
import { bonds, InlineAccount, AccountLabel, AddressBond, AccountIcon } from 'parity-reactive-ui';
import { TimeBond } from 'oo7';
import { formatBalance } from 'oo7-parity';
import { Rspan } from 'oo7-react';

export default class AddressCard extends Component{
  constructor(){
    super();
  }

  componentWillMount(){
  }

  render(){
    // bonds.allAccountsInfo.tie((list) => {
    //   Object.keys.filter
    // })
    console.log('accinfo',bonds.allAccountsInfo);
    return (<div className="AddressCard">
      <AccountIcon address={bonds.me} />
      <Rspan>{bonds.balance(bonds.me).map(formatBalance)}</Rspan>
      <Rspan>
		      {bonds.allAccountsInfo((info)=>{
            Object.keys(info).filter((key) => {
              return (typeof accountList[key].uuid == 'undefined') && (!accountList[key].meta.contract) && !accountList[key].meta.wallet;
            }).map((elem)=>{
              return elem;
            })
          })}
	   </Rspan>
    </div>);
  }
}
