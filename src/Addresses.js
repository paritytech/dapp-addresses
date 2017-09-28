import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, Button, Icon, Input, Card } from 'semantic-ui-react';
import { bonds, Actionbar, Transaction, ActionbarExport, ActionbarImport, ActionbarSearch, ActionbarSort, Button as PButton} from 'parity-reactive-ui';

import { Rspan, ReactiveComponent } from 'oo7-react';

import AddressCard from './AddressCard';

import styles from './Addresses.css';


export default class Addresses extends Component {
  constructor(){
    super();
  }

  render(){
    console.log('styl',Actionbar,PButton);
    return (<div className={styles.Addresses}>
      { this.renderActionbar() }
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

  renderActionbar () {
    //const { contacts } = this.props;

    const buttons = [
      <PButton
        key='newAddress'
        label={"address"}
        onClick={ ()=>{} }
      />
    ];

    return (
      <Actionbar
        className={ 'Actionbar' }
        title={'Saved Addresses'}
        buttons={ buttons }
      />
    );
  }
}

export class AddressesAux extends ReactiveComponent{
  constructor(){
    super(['accountinfo']);
  }

  render(){
    console.log('madeit', this.state );
    if(typeof this.state.accountinfo == 'undefined') return(<div>hello</div>)

    return (<Card.Group className={styles.AddressContainer} itemsPerRow={3}>
      {this.state.accountinfo.map(elem=>{
      return (<AddressCard
        key={elem.address}
        info={elem}
      />);
    })}</Card.Group>)
  }
}
