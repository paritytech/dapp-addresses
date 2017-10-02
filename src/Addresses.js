import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, Button, Icon, Input, Card, Table } from 'semantic-ui-react';
import { bonds} from 'parity-reactive-ui';
import { Actionbar, ActionbarExport, ActionbarImport, ActionbarSearch, ActionbarSort, Button as PButton } from '@parity/ui';
import {AddIcon} from '@parity/ui/Icons';

import { Rspan, ReactiveComponent } from 'oo7-react';

import AddressCard from './AddressCard';
import AddAddress from './AddAddress';

import styles from './Addresses.css';


export default class Addresses extends Component {
  constructor(){
    super();
  }

  state ={
    showAdd: false
  }

  render(){
    return (<div className={styles.Addresses}>
      { this.renderActionbar() }
      { this.renderAddAddress() }
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
    // <PButton
    //   key='newAddress'
    //   label={"address"}
    //   onClick={ ()=>{} }
    // />
    const buttons = [
      <PButton
        key='newAddress'
        icon={ <AddIcon /> }
        label={"address"}
        onClick={ this.onOpenAdd }
      />
    ];

    return (
      <Actionbar
        className={ styles.toolbar }
        title={'Saved Addresses'}
        buttons={ buttons }
      />
    );
  }

  onOpenAdd = () => {
    console.log('change to true');
    this.setState({
      showAdd: true
    });
  }

  onCloseAdd = () => {
    this.setState({
      showAdd: false
    });
  }

  renderAddAddress(){
    console.log('renderadd');
    const { showAdd } = this.state;

    if (!showAdd) {
      return null;
    }

    return (
      <AddAddress
        contacts={ {} }
        onClose={ this.onCloseAdd }
      />
    );
  }
}

export class AddressesAux extends ReactiveComponent{
  constructor(){
    super(['accountinfo']);
  }

  render(){
    //console.log('madeit', this.state );
    if(typeof this.state.accountinfo == 'undefined') return(<div>hello</div>)

    return (<Table padded columns={5} textAlign="center">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Icon</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Balance</Table.HeaderCell>
          <Table.HeaderCell>Tokens</Table.HeaderCell>
          <Table.HeaderCell>Address</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {this.state.accountinfo.map(elem=>{
        return (<AddressCard
          key={elem.address}
          info={elem}
        />);
      })}
    </Table.Body>
  </Table>)
  }
}
