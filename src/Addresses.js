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
    showAdd: false,
    searchTokens:[],
    searchValues:[],
    sortOrder: ''
  }

  render(){
    console.log('stati',this.state);
    return (<div className={styles.Addresses}>
      { this.renderActionbar() }
      { this.renderAddAddress() }
      <AddressesAux
        accountinfo={bonds.allAccountsInfo.map((accountList)=>{
          const { searchValues, sortOrder } = this.state;
          let p = []
          //read ou all (valid) accounts
          for(let key in accountList){
            if( typeof accountList[key].uuid == 'undefined' &&
                !accountList[key].meta.contract &&
                !accountList[key].meta.wallet){
              //modify account so that all info is in object
              let modaccount = accountList[key];
              modaccount['address'] = key;
              p.push(modaccount);
            }
          }

          //filter all accounts


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
    //needs to be internationalised

    const buttons = [
      <PButton
        key='newAddress'
        icon={ <AddIcon /> }
        label={"address"}
        onClick={ this.onOpenAdd }
      />,
      <ActionbarExport
        key='exportAddressbook'
        content={ bonds.allAccountsInfo }
        filename='addressbook'
      />,
      <ActionbarImport
        key='importAddressbook'
        onConfirm={ this.onImport }
        renderValidation={ this.renderValidation }
      />,
      this.renderSearchButton(),
      this.renderSortButton()
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


  onImport = (content) => {
    try {
      const addresses = JSON.parse(content);

      Object.values(addresses).forEach((account) => {
        this.onAddAccount(account);
      });
    } catch (e) {
      console.error('onImport', content, e);
    }
  }

  onAddAccount = (account) => {
    const { api } = this.context;
    const { address, name, meta } = account;
    //TODO: bnd api might need to be extended to include this 
    Promise.all([
      api.parity.setAccountName(address, name),
      api.parity.setAccountMeta(address, {
        ...meta,
        timestamp: Date.now(),
        deleted: false
      })
    ]).catch((error) => {
      console.error('onAddAccount', error);
    });
  }

  renderSearchButton = () => {
    const onChange = (searchTokens, searchValues) => {
      this.setState({ searchTokens, searchValues });
    };

    return (
      <ActionbarSearch
        key='searchAddress'
        tokens={ this.state.searchTokens }
        onChange={ onChange }
      />
    );
  }

  renderSortButton () {
    const onChange = (sortOrder) => {
      this.setState({ sortOrder });
    };

    return (
      <ActionbarSort
        key='sortAccounts'
        id='sortAddresses'
        order={ this.state.sortOrder }
        onChange={ onChange }
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
