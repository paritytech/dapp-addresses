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

import React from 'react';
import { ReactiveComponent } from 'oo7-react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import AddressCard from './AddressCard';

export default class AddressesTable extends ReactiveComponent {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static PropTypes = {
    sortOrder: PropTypes.string,
    searchTokens: PropTypes.array,
    seachValues: PropTypes.array
  }

  constructor () {
    super(['accountinfo']);
  }

  render () {
    if (typeof this.state.accountinfo === 'undefined') {
      return (<div />);
    }
    let { accountinfo } = this.state;
    let { sortOrder } = this.props;

    if (sortOrder === 'eth' && this.state.prevSort !== 'eth') {
      accountinfo.sort((accA, accB) => {
        if (accA.balance.equals(accB.balance)) {
          return 0;
        } else if (accA.balance.greaterThan(accB.balance)) {
          return -1;
        }
        return 1;
      });
    } else if (sortOrder === 'name') {
      accountinfo.sort((accA, accB) => {
        return accA.name.localeCompare(accB.name);
      });
    }

    let filteredAddreddes = this.getFilteredAddresses(this.state.accountinfo);
    return (<Table padded columns={ 5 } textAlign='center' style={ { marginBottom: '70px' } }>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Balance</Table.HeaderCell>
          <Table.HeaderCell>Tokens</Table.HeaderCell>
          <Table.HeaderCell>Transactions</Table.HeaderCell>
          <Table.HeaderCell>Address</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        { filteredAddreddes.map(elem => {
          return (
            <AddressCard
              key={ elem.address }
              info={ elem }
            />);
        })}
      </Table.Body>
    </Table>);
  }

  getFilteredAddresses () {
    const { searchTokens } = this.props;
    const { accountinfo } = this.state;
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
}
