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
import { Header, Table, Button, Popup, Item } from 'semantic-ui-react';

import {
  bonds,
  AccountIcon,
  AddressLabel,
  EtherBalance,
  TokenList,
  BadgeList,
  BStatistic
} from 'parity-reactive-ui';
import { DappLink } from '@parity/ui';

import { Bond } from 'oo7';
import { isEqual } from 'lodash';

import styles from './AddressCard.css';

export default class AddressCard extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  render () {
    const { info } = this.props;
    let dispname = info.name || '';
    let addressBond = new Bond();

    info.name = info.name || '';
    addressBond.changed(info.address);

    if (info.name.length > 30) {
      dispname = info.name.substr(0, 30) + '...';
    }

    return (
      <Table.Row>
        <Table.Cell textAlign='center'>
          <DappLink
            to={ `/address/${info.address}` }
            className='IconLink'
          >
            <Item.Group>
              <Item>
                <Item.Image size='tiny'>
                  <AccountIcon
                    address={ info.address }
                    className={ styles.AccountIcon }
                  />
                </Item.Image>
                <Item.Content verticalAlign='middle'>
                  <Item.Header as='a'>
                    {dispname.toUpperCase()}
                    <BadgeList
                      badges={ bonds.badgesOf(info.address) }
                    />
                  </Item.Header>
                </Item.Content>
              </Item>
            </Item.Group>
          </DappLink>
        </Table.Cell>
        <Table.Cell>
          <EtherBalance balance={ bonds.balance(info.address) } />
        </Table.Cell>
        <Table.Cell>
          <TokenList tokens={ bonds.tokensOf(info.address) } />
        </Table.Cell>
        <Table.Cell>
          <BStatistic
            value={ bonds.nonce(info.address) }
            label='tx'
            size='mini'
            horizontal
          />
        </Table.Cell>
        <Table.Cell>
          <AddressLabel address={ addressBond } />
        </Table.Cell>
        <Table.Cell>
          <Popup
            trigger={ <Button icon='setting' /> }
            content={ <Button color='red' content='Remove' onClick={ this.removeAddress } /> }
            on='click'
            position='top right'
          />
        </Table.Cell>
      </Table.Row>);
  }

  removeAddress = () => {
    this.context.api.parity.removeAddress(this.props.info.address);
    this.forceUpdate();
  }
}
