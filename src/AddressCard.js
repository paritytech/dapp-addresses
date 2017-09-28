import React, { Component } from 'react';
import { bonds, InlineAccount, InlineBalance, AccountIcon, AddressLabel, AccountLabel } from 'parity-reactive-ui';
import { Header, Card, Image } from 'semantic-ui-react';
import {Bond} from 'oo7';
import { formatBalance } from 'oo7-parity';
import { ReactiveComponent, Rspan, Rimg } from 'oo7-react';

import styles from './AddressCard.css';

//TODO: Add this to semantic-ui-react
export default class AddressCard extends Component{
  constructor(){
    super();
  }

  render(){
    let addressBond = new Bond();
    addressBond.changed(this.props.info.address);
    let balanceBond = bonds.balance(this.props.info.address);
    let bondi = (new Bond).changed('0xd40679a3a234d8421c678d64f4df3308859e8ad07ac95ce4a228aceb96955287');
    bonds.tokens.then((ls)=>{
      bonds.githubhint.entries(ls[0].img).then(arr=>{console.log(arr[0])})
    });
    console.log('accinfo',);
    return (<Card className={styles.AddressCard} >
        <Card.Content>
          <Image floated="right"><AccountIcon address={this.props.info.address} /></Image>
          <Card.Header as='h3'>{this.props.info.name}</Card.Header>
          <Card.Meta>{this.props.info.meta.description}</Card.Meta>
      </Card.Content>
      <Card.Content>
        <AddressLabel address={addressBond} />
      </Card.Content>
      <Rspan>{}</Rspan>
      <CoinList />
    </Card>);
  }
}

class CoinList extends ReactiveComponent{
  constructor(){
    super();
  }
  render(){
    return <p></p>;
  }
}
