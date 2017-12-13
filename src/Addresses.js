// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Actionbar,
  ActionbarExport,
  ActionbarImport,
  ActionbarSearch,
  ActionbarSort,
  Button as PButton
} from '@parity/ui';

import { Icons } from 'parity-reactive-ui';
import { bonds } from 'oo7-parity';

import AddressesTable from './AddressesTable';
import AddAddress from './AddAddress';
import styles from './Addresses.css';

export default class Addresses extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  state={
    showAdd: false,
    searchTokens: [],
    searchValues: [],
    sortOrder: ''
  }

  render () {

    let TableBond = bonds.allAccountsInfo.map((accountList) => {
      let outList = [];

      for (let key in accountList) {
        // read out all (valid) accounts
        if (typeof accountList[key].uuid === 'undefined' &&
            !accountList[key].meta.contract &&
            !accountList[key].meta.wallet) {
          // modify account so that all bond of info is in object
          let modaccount = accountList[key];

          modaccount['address'] = key;
          // balanceArray.push(bonds.balance(key));
          outList.push(modaccount);
        }
      }
      console.log('acclist', outList);
      return outList;
    });
    // .map((i) => this.getFilteredAddresses(i, this.state.searchTokens)).map((ac) => this.sortAccounts(ac, this.state.sortOrder));

    console.log('tbd', TableBond);

    return (<div className={ styles.Addresses }>
      { this.renderActionbar() }
      { this.renderAddAddress() }
      <AddressesTable
        tableinfo={ TableBond }
        sortOrder={ this.state.sortOrder }
        searchTokens={ this.state.searchTokens }
        searchValues={ this.state.searchValues }
      />
    </div>);
  }

  renderActionbar () {
    const buttons = [
      <PButton
        key='newAddress'
        icon={ <Icons.AddIcon /> }
        label={ 'address' }
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
        title={ 'Saved Addresses' }
        buttons={ buttons }
      />
    );
  }

  onOpenAdd = () => {
    this.setState({
      showAdd: true
    });
  }

  onCloseAdd = () => {
    this.setState({
      showAdd: false
    });
  }

  renderAddAddress () {
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

    // Q: bond api might need to be extended to include this?
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

  getFilteredAddresses = (accountinfo, searchTokens) => {
    console.log('filti', accountinfo, searchTokens);
    const searchValues = (searchTokens || []).map(v => v.toLowerCase());

    if (searchValues.length === 0) {
      return accountinfo;
    }

    return accountinfo.filter((account) => {
      const tags = account.meta.tags || [];
      const desc = account.meta.description || '';
      const name = account.name || '';

      const values = tags.concat(name);

      values.concat(desc.split(' '));
      values.map(v => v.toLowerCase());

      return searchValues.map(searchValue => {
        return values.some(value => value.indexOf(searchValue) >= 0);
      }).reduce((current, truth) => current && truth, true);
      // `current && truth, true` => use tokens as AND
      // `current || truth, false` => use tokens as OR
    });
  }

  sortAccounts = (accountinfo, order) => {
    // && this.state.prevSort !== 'eth'
    console.log('ethsort', accountinfo, order);
    if (order === 'eth') {
      return accountinfo.sort((accA, accB) => {
        if (accA.balance.equals(accB.balance)) {
          return 0;
        } else if (accA.balance.greaterThan(accB.balance)) {
          return -1;
        }
        return 1;
      });
    } else if (order === 'name') {
      return accountinfo.sort((accA, accB) => {
        return accA.name.localeCompare(accB.name);
      });
    }
  }
}
