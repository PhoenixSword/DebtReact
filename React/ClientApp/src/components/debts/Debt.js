import React, { Component } from 'react';
import { debtService } from "../services/DebtService";
import {MDBIcon} from "mdbreact";

function DebtItem(props) {

  const debts = props.debtItems.debts;
  if(debts !== undefined)
  {
    const rows = (
      <tbody>
        {debts.map((post) =>
        <tr key={post.id}>
            <td>{props.debtItems.name.toLowerCase() === post.member1.toLowerCase() ? <span>{post.member2}</span> : <span>{post.member1}</span>}</td>
            <td>{props.debtItems.name.toLowerCase() === post.member1.toLowerCase() ? <span>His debt is <span className="green-text">{post.money} <MDBIcon icon="money-bill-wave"/></span></span>:<span>Your debt is <span className="red-text">{post.money} <MDBIcon icon="money-bill-wave"/></span></span>}</td>
        </tr>
        )}
      </tbody>
    );
    return <React.Fragment>{rows}</React.Fragment>;
  }
  return <React.Fragment>{null}</React.Fragment>;
}

export class Debt extends Component {

  constructor(props) {
    super(props);
    this.service = debtService;

    const params = new URLSearchParams(this.props.location.search)
    this.memberId = params.get('memberId');

    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.service.getAll(this.memberId).then(response => this.setState({
      data: response
    }));
  }

  render() {
    return (
      <div className="card debts">
        <h3 className="purple-gradient white-text card-header text-center font-weight-bold text-uppercase py-4">
        {this.state.data.name}
        </h3>
        <div className="card-body text-center">
          <div className="table-responsive">
            <table className="table">
             <colgroup span="1" class="colgroup"></colgroup>
              <thead className="purple-gradient white-text">
                <tr>
                  <th className="">Name</th>
                  <th className="">Money</th>
                </tr>
              </thead>
              <DebtItem debtItems={this.state.data}/>
            </table>
          </div>
        </div>
      </div>
      );
  }
}