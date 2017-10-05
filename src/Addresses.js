import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, Button, Icon, Input, Card, Table } from 'semantic-ui-react';
import { bonds} from 'parity-reactive-ui';
import { Actionbar, ActionbarExport, ActionbarImport, ActionbarSearch, ActionbarSort, Button as PButton } from '@parity/ui';
import {AddIcon} from '@parity/ui/Icons';
import PropTypes from 'prop-types';

import { Rspan, ReactiveComponent } from 'oo7-react';
import {Bond} from 'oo7';

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
    let bBond = bonds.balance(bonds.me);
    bBond.log();

    let TableBond = bonds.allAccountsInfo.map((accountList)=>{
      let p = []
      let balanceArray = [];
      //read ou all (valid) accounts
      for(let key in accountList){
        if( typeof accountList[key].uuid == 'undefined' &&
            !accountList[key].meta.contract &&
            !accountList[key].meta.wallet){
          //modify account so that all bond of info is in object
          let modaccount = accountList[key];
          modaccount['address'] = key;
          //balanceArray.push(bonds.balance(key));
          p.push(modaccount);
        }
      }
      return p;
    }).map((filterArray)=>{
      let balanceArray = filterArray.map((accData)=>{
        accData['balance'] = bonds.balance(accData.address);
        return accData;
      })
      return balanceArray;
    },2)

    //console.log('tb',TableBond);
    return (<div className={styles.Addresses}>
      { this.renderActionbar() }
      { this.renderAddAddress() }
      <AddressesTable
        accountinfo={TableBond}
        sortOrder={this.state.sortOrder}
        searchTokens={this.state.searchTokens}
        searchValues={this.state.searchValues}
      />

      </div>);
  }

  renderActionbar () {
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

export class AddressesTable extends ReactiveComponent{
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static PropTypes = {
    sortOrder: PropTypes.string,
    searchTokens: PropTypes.array,
    seachValues: PropTypes.array
  }

  constructor(){
    super(['accountinfo']);
  }

  render(){
    console.log('madeit', this.state.accountinfo );

    if(typeof this.state.accountinfo == 'undefined') return(<div>hello</div>);
    // console.log('bond',this.state[0].balance);
    const { api } = this.context;
    let {accountinfo} = this.state;
    let {sortOrder,searchTokens,searchValues} = this.props;
    console.log('so',searchTokens,searchValues);
    //TODO dont so sorting on every render
    if(sortOrder == "eth" && this.state.prevSort != "eth") {
      accountinfo.sort((accA, accB)=>{
          if(accA.balance.equals(accB.balance)) return 0;
          if(accA.balance.greaterThan(accB.balance)) return -1
          return 1
      })
    }else if(sortOrder == "name"){
      accountinfo.sort((accA, accB)=>{
        console.log(accA.name, accB.name);
        return accA.name.localeCompare(accB.name);
      })
    }

    let filteredAddreddes = this.getFilteredAddresses(this.state.accountinfo)
    console.log('fa',filteredAddreddes);

    return (<Table padded columns={5} textAlign="center">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Icon</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Balance</Table.HeaderCell>
          <Table.HeaderCell>Tokens</Table.HeaderCell>
          <Table.HeaderCell>Badges</Table.HeaderCell>
          <Table.HeaderCell>Address</Table.HeaderCell>
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {filteredAddreddes.map(elem=>{
          return (<AddressCard
            key={elem.address}
            info={elem}
        />);
      })}
    </Table.Body>
  </Table>)
  }

  getFilteredAddresses(){
    //return [];
    const { searchTokens } = this.props;
    const { accountinfo } = this.state;
    const searchValues = (searchTokens || []).map(v => v.toLowerCase());

    if (searchValues.length === 0) {
      return accountinfo
    }
    console.log('acci',accouninfo);
    return accountinfo.filter((account) => {
        console.log('acc2');
        const tags = account.meta.tags || [];
        const desc = account.meta.description || '';
        const name = account.name || '';

        const values = tags
          .concat(name)
          .concat(desc.split(' '))
          .map(v => v.toLowerCase());
          console.log('valery', values);
        return searchValues.map(searchValue => {
              return values.some(value => value.indexOf(searchValue) >= 0);
          })
          .reduce((current, truth) => current && truth, true);
          // `current && truth, true` => use tokens as AND
          // `current || truth, false` => use tokens as OR
      });
  }
}
