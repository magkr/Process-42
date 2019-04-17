import React, { Component } from "react";
import Action from "./action.js";
import { getData } from "../store.js";

export default class ActionsList extends Component {
  constructor(props) {
    super(props);
    this.valuesToSubmit = {};
    this.submitMoreData = this.submitMoreData.bind(this);
  }

  addValueToSubmit(title, value) {
    this.valuesToSubmit[title] = value;
  }

  submitMoreData() {
    var actions = [];
    var values = [];
    this.props.actions.forEach(a => {
      var value = this.valuesToSubmit[a.title];
      if(value) {
        actions.push(a.title)
        values.push(value);
      }
    })
    this.props.contractContext.submitDatas(actions, this.props.case.id, values);
  }

  submitData(title, value) {
    this.props.contractContext.submitData(
      title,
      this.props.case.id,
      value
    );
  }

  render() {
    return (
      <div className="w-50">
        <h2 className="flex justify-center items-center h2 helvetica pa1 ma2 f5 b tc">
          Muligheder:
        </h2>
        {this.props.actions.map(a => (
          <Action
            key={a.title}
            action={a}
            contractContext={this.props.contractContext}
            addValueToSubmit={this.addValueToSubmit.bind(this)}
            submitData={this.submitData.bind(this)}
          />
        ))}
        {this.props.actions.length > 1 ? (
          <button
            className="helvetica w-20 f6 ml3 br1 ba bg-white"
            onClick={() => this.submitMoreData()}
          >
            Indsend udfyldte
          </button>
        ) : null}
      </div>
    );
  }
}
