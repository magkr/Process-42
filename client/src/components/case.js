import React, { Component } from "react";
import DataList from "./datalist.js";
import ActionsList from "./actionslist.js";
import ResolutionView from "./resolutionview.js";
import HistoryView from "./historyview.js";
import "../css/reset.css";
import "../css/tachyons.min.css";

class Case extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.editData = this.editData.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.handleComplaint = this.handleComplaint.bind(this);
  }

  state = {
    data: null,
    actions: [],
    isLoading: true
  };

  componentDidMount() {
    this.update();
  }

  componentWillReceiveProps(props) {
    this.update();
  }

  caseStatusText(status) {
    switch (parseInt(status)) {
      case 0:
        return "Aktiv"
      case 1:
        return "Under klage";
      case 2:
        return "Klar til udbetaling";
      case 3:
        return "Hos ankestyrelsen";
      default:
        return "Fejl";
    }
  }


  async update() {
    if (this.props.case) {
      console.log(this.props.case);
      await this.setState({ isLoading: true });
      const add = await this.props.contractContext.contract.methods.addressFromCase(this.props.case.id).call();
      // const c = await t
      //this.props.contractContext.contract.methods.getComplaint(this.props.case.id).call().then(r => console.log(r));
      await this.props.contractContext.caseData(this.props.case).then(res => {
        this.setState({
            data: res.data,
            actions: res.actions,
            isLoading: false,
            address: add,
            marked: res.marked
            //complaint: null
          });
      });
      //console.log(null);
    }
  }

  async editData(d) {
    this.state.actions.push(d.title);
    this.setState({
      actions: this.state.actions
    });
  }

  updateInput(e) {
    this.value = e.target.value;
  }

  dataList() {
    return (
      <DataList
        contractContext={this.props.contractContext}
        data={this.state.data}
        editData={this.editData}
        case={this.props.case}
      />
    )
  }

  handleComplaint(){
    if(this.state.marked) {
      this.props.contractContext.contract.methods.homesend(this.props.case.id).send({ from: this.props.contractContext.accounts[0] });
    }
    else {
      this.props.contractContext.contract.methods.stadfast(this.props.case.id).send({ from: this.props.contractContext.accounts[0] });
    }
    this.setState({ marked: false })
  }

  councilInterface(data) {
    return (
      <div>
        <div className="w-100 flex justify-center">
          {this.dataList()}
          <div className="w-50 flex justify-center items-center">
            {this.props.case.status === "3"
              ?
              (<div>
              <button className="helvetica f6 br1 ba bg-white fr mr3" onClick={() => this.handleComplaint()}>
                {this.state.marked ? "Hjemvis" : "Stadfæst"}
              </button>
            </div>)
              : null
            }

          </div>
        </div>
        <HistoryView
            id={this.props.case.id}
            contractContext={this.props.contractContext}
          />
      </div>
    );
  }

  sbhInterface(data) {
    return (
      <div>
        <div className="w-100 flex justify-center">
          {this.dataList()}
          {this.props.case.status === "3" ? ( // MAGNUS HJÆLP (opdater og prettify)
            <div>
              <input
                className="helvetica w-80"
                type="text"
                onChange={this.updateInput}
              />
            <input
                className="helvetica w-20 f6 ml3 br1 ba bg-white"
                onClick={() => this.props.contractContext.handlePayment(this.props.case.id, this.value)}
                type="submit"
              />
            </div>
          ) : (
            <ActionsList
              contractContext={this.props.contractContext}
              actions={this.state.actions}
              case={this.props.case}
            />
        )}
      </div>
      <HistoryView
          id={this.props.case.id}
          contractContext={this.props.contractContext}
        />
    </div>
    );
  }

  citizenInterface(data) {
    return (
      <ResolutionView
        id={this.props.case.id}
        contractContext={this.props.contractContext}
      />
    );
  }

  getInterface() {
    if (this.props.contractContext.role === 0 ) return this.citizenInterface();
    if (this.props.contractContext.role === 1 ) return this.sbhInterface();
    if (this.props.contractContext.role === 2 ) return this.councilInterface();
    return null;
  }

  render() {
    return (
      <div className="w-100 flex flex-column items-left justify-around ph5">
        {this.state.isLoading ? (
          <h2 className="f4 helvetica tc pa2 mt2 mr2">Loading...</h2>
        ) : (
          <div>
            <h2 className="f4 helvetica tl pa2 mt2 mr2">
              <span className="b">Sagsnummer: </span>
              {this.props.case.id}
            </h2>
            <h2 className="f4 helvetica tl pa2 mt2 mr2">
              <span className="b">Address: </span>
              {this.state.address}
            </h2>
            <h2 className="f4 helvetica tl pa2 mt2 mr2">
              <span className="b">Status: </span>
              {this.caseStatusText(this.props.case.status)}
            </h2>
            { this.getInterface() }
          </div>
        )}
      </div>
    );
  }
}

export default Case;
