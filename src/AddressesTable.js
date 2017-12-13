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
// import { ReactiveComponent } from 'oo7-react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { bonds } from 'oo7-parity';
import { ReactiveComponent } from 'oo7-react';

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
    super(['tableinfo']);
  }

  render () {
    // if (!accountinfo) {
    //   return (<div />);
    // }

    // construct a bond that represents the data contained in table
    let { tableinfo } = this.state;

    console.log('ti', this.state.tableinfo);

    // let filteredAddreddes = [];

    return (<Table columns={ 5 } padded='very' textAlign='left' style={ { marginBottom: '70px' } }>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign='center'>Name</Table.HeaderCell>
          <Table.HeaderCell>Balance</Table.HeaderCell>
          <Table.HeaderCell>Tokens</Table.HeaderCell>
          <Table.HeaderCell>Transactions</Table.HeaderCell>
          <Table.HeaderCell>Address</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        { tableinfo.map(elem => {
          return (
            <AddressCard
              key={ elem.address }
              info={ elem }
            />);
        })}
      </Table.Body>
    </Table>);
  }
}
