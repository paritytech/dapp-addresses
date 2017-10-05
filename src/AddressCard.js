import React, { Component } from 'react';
import { bonds, InlineAccount, InlineBalance, AccountIcon, AddressLabel, AccountLabel, EtherBalance, CoinList } from 'parity-reactive-ui';
import { Header, Card, Image, Table, Button, Popup, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DappLink } from '@parity/ui';
import { BigNumber } from 'bignumber.js';
import { Bond } from 'oo7';
import { formatBalance } from 'oo7-parity';
import { ReactiveComponent, Rspan, Rimg } from 'oo7-react';
import _ from 'lodash';

import styles from './AddressCard.css';

//TODO: Add this to semantic-ui-react
export default class AddressCard extends Component{
  constructor(){
    super();
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps,nextState){
    return !_.isEqual(this.props,nextProps) || !_.isEqual(this.state,nextState); 
  }

  render(){
    const { info } = this.props;
    let addressBond = new Bond();
    addressBond.changed(info.address);
    let balanceBond = bonds.balance(info.address);
    let bondi = bonds.tokensOf(info.address).then((ret)=>{

    })
    let dispname = info.name
    if(info.name.length > 40) dispname = info.name.substr(0,30) + '...';

    return (<Table.Row >
          <Table.Cell>
            <DappLink
              to={`/address/${info.address}`}
              className="IconLink"
              >
              <Image>
                <AccountIcon address={info.address} />
              </Image>
            </DappLink>
          </Table.Cell>
          <Table.Cell>
            <Header as='h3'>{dispname}</Header>
          </Table.Cell>
          <Table.Cell>
            <EtherBalance balance={balanceBond}/>
          </Table.Cell>
          <Table.Cell>
            <CoinList tokens={bonds.tokensOf(info.address)}/>
          </Table.Cell>
          <Table.Cell>
            -
          </Table.Cell>
          <Table.Cell>
            <AddressLabel address={addressBond} />
          </Table.Cell>
          <Table.Cell>
            <Popup
              trigger={<Button icon='setting' />}
              content={<Button color='red' content='Remove' onClick={this.removeAddress.bind(this,info.address)} />}
              on='click'
              position='top right'
            />
          </Table.Cell>
        </Table.Row>);
  }

  removeAddress(address){
    console.log('removing...');
    this.context.api.parity.removeAddress(address);
    this.setState(this.state);
  }
}

//
// class EtherBalance extends ReactiveComponent{
//   constructor(){
//     super(['balance']);
//   }
//
//   render(){
//     if(typeof this.state.balance == "undefined") return (<span>-</span>);
//     let ethdiv = new BigNumber('1e+18');
//     let ethVal = this.state.balance.div(ethdiv)
//     //BigNumber.config(2);
//     return (<span>{ethVal.toFormat(5)} ETH</span>)
//   }
// }
//
// let ownedTokenBond = bonds.tokens.map((ls)=>{
//   console.log(ls[0].tla);
//   let owned = []
//   for(let num in ls){
//     if(ls[num].tla == "GAV") owned.push(ls[num]);//need new way to filtr
//   }
//   return owned;
// })
