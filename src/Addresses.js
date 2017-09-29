import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, Button, Icon, Input, Card, Table } from 'semantic-ui-react';
import { bonds, Actionbar, DappLink, ActionbarExport, ActionbarImport, ActionbarSearch, ActionbarSort, Button as PButton} from 'parity-reactive-ui';

import { Rspan, ReactiveComponent } from 'oo7-react';

import AddressCard from './AddressCard';

import styles from './Addresses.css';


export default class Addresses extends Component {
  constructor(){
    super();
  }

  render(){
    console.log('styl',DappLink);
    return (<div className={styles.Addresses}>
      { this.renderActionbar() }
      <DappLink
        to="0x421683f821a0574472445355be6d2b769119e8515f8376a1d7878523dfdecf7b/0x006E778F0fde07105C7adDc24b74b99bb4A89566"
        className="yolo"
        >
        <Button onClick={()=>(console.log('clicky'))}>linky</Button>
      </DappLink>
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
    const buttons = [];

    return (
      <Actionbar
        className={ styles.toolbar }
        title={'Saved Addresses'}
        buttons={ buttons }
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
