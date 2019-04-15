import "../css/reset.css";
import "../css/tachyons.min.css";
import React, { Component } from "react";


export default class Action extends Component {

  render() {
    console.log(this.props);
    const utils = this.props.contractContext.web3.utils;
    return (
      <div className="w-100 bg-near-white pa2 mv2">
        <div className="flex items-end helvetica f5">
          {utils.hexToAscii(this.props.action)}
        </div>
        <div className="helvetica flex justify-around mt3">
          <input
            className="helvetica w-80"
            type="text"
            value={this.props.value}
            onChange={(e) => this.props.update(e, this.props.action)}
          />
          <button
            className="helvetica w-20 f6 ml3 br1 ba bg-white"
            onClick={() => this.props.submitData(this.props.action)}
          >
            {/*this.props.value === this.props.prev && this.props.value !== "" ? "Behold" :*/ "Indsend"}
          </button>
        </div>
      </div>
    );
  }
}
