import '../css/reset.css';
import '../css/tachyons.min.css';
import React, { Component } from "react";

export default class Data extends Component {
  state = {
    hash: ""
  }

  updateHash = (e) => {
    this.setState({ hash: e.target.value })
  }

  fillData = async () => {
    console.log(this.props.action);
    await this.props.contractContext.contract.methods.fillData(this.props.action, this.props.caseID, this.state.hash).send({ from: this.props.contractContext.accounts[0] });
    await this.props.getActions(),
  }

  render(){
    const utils = this.props.contractContext.web3.utils;
    return (
      <div className="mv2">
        <div className="mv1">{utils.hexToAscii(this.props.action)}</div>
        <input type="text" onChange={this.updateHash}/>
        <button onClick={this.fillData}>Submit</button>
      </div>
    )
  }
  /*() => this.props.setToDone(this.props.action)*/
}
