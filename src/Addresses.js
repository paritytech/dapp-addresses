import React, { Component } from 'react';
//import { FormattedMessage } from 'react-intl';
import { bonds } from 'parity-reactive-ui';
//import { Actionbar, ActionbarExport, ActionbarImport, ActionbarSearch, ActionbarSort } from 'parity-reactive-ui/src/js-ui/Actionbar';
import { Rspan, ReactiveComponent } from 'oo7-react';

//console.log(Actionbar, ActionbarExport, ActionbarImport, ActionbarSearch, ActionbarSort);

import AddressCard from './AddressCard';

import './Addresses.css';

export default class Addresses extends Component {
  constructor(){
    super();
  }

  render(){
    return (<div className="AddressContainer">
      <AddressesAux
        accountinfo={bonds.allAccountsInfo.map((accountList)=>{
          let p = []
          for(let key in accountList){
            if( typeof accountList[key].uuid == 'undefined' && !accountList[key].meta.contract && !accountList[key].meta.wallet){
              let modaccount = accountList[key];
              modaccount['address'] = key;
              p.push(modaccount);
            }
          }
          return p;
        })}
      />
      </div>);
  }
}

export class AddressesAux extends ReactiveComponent{
  constructor(){
    super(['accountinfo']);
  }

  render(){
    console.log('madeit', this.state );
    if(typeof this.state.accountinfo == 'undefined') return(<div>hello</div>)

    return (<div>{this.state.accountinfo.map(elem=>{
      return (<AddressCard
        address={elem.address}
      />);
    })}</div>)
  }

}
