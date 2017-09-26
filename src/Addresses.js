import React, { Component } from 'react';
import { bonds } from 'parity-reactive-ui';
import { Rspan } from 'oo7-react';

import AddressCard from './AddressCard';

import styles from './Addresses.css';

export default class Addresses extends Component {
  constructor(){
    super();
    this.state = {
      accounts: []
    }
  }
  componentWillMount(){
    bonds.allAccountsInfo.tie(this.renderAccounts.bind(this));
  }
  render(){
    //bonds.allAccountsInfo.map(b => console.log('b', b))
    console.log('accs',this.state.accounts);
    return (<div>
      {this.state.accounts.map((addr)=>{
        return (<AddressCard
          address={addr}          
        />);
      })}
      </div>);
  }

  renderAccounts(accountList){

    if(typeof accountList != 'undefined'){
      console.log('hereo', accountList);
      let p = Object.keys(accountList)
      .filter((key) => {
        return (typeof accountList[key].uuid == 'undefined') && (!accountList[key].meta.contract) && !accountList[key].meta.wallet;
      })
      .map((elem)=>{
        return elem;
      })
      console.log('p', p);
      this.setState({accounts:p});
    }
  }
}
