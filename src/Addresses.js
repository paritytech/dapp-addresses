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
    // construct a bond that represents the data contained in table
    let TableBond = bonds.allAccountsInfo.map((accountList) => {
      let p = [];

      for (let key in accountList) {
        // read out all (valid) accounts
        if (typeof accountList[key].uuid === 'undefined' &&
            !accountList[key].meta.contract &&
            !accountList[key].meta.wallet) {
          // modify account so that all bond of info is in object
          let modaccount = accountList[key];

          modaccount['address'] = key;
          // balanceArray.push(bonds.balance(key));
          p.push(modaccount);
        }
      }

      return p;
    });

    return (<div className={ styles.Addresses }>
      { this.renderActionbar() }
      { this.renderAddAddress() }
      <AddressesTable
        accountinfo={ TableBond }
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
}
