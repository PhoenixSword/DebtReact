import React, { Component } from 'react';
import { debtService } from "../services/DebtService";


function Members(props) {
    const memberNames = props.value.memberNames;
    
    if(memberNames !== undefined)
    {
        const rows = (
        <React.Fragment>
            {memberNames.map((name) =>
            <th key={name}>{name}</th>
            )}
        </React.Fragment>
        );
        return <React.Fragment>{rows}</React.Fragment>;
    }
    return <React.Fragment>{null}</React.Fragment>;
}

function FindValue(props) {
    const debts = props.debts;
    const m1 = props.m1;
    const m2 = props.m2;
    var res = 0;

    debts.map((debt) =>
    {
        debt.member1 === m1 && debt.member2 === m2 && (res = debt.money)
        debt.member1 === m2 && debt.member2 === m1 && (res = (debt.money * (-1)))
        return null
    }
    )
   
    return <td>{res}</td>;
  }

function SeeAll(props) {
    const debts = props.value.debts;
    const memberNames = props.value.memberNames;

    if(debts !== undefined)
    {
        //console.log(debts);
        const rows = (
        <tbody>
            {memberNames.map((memberOut, index) =>
            <tr key={index}>
                <td>{memberOut}</td>
                {memberNames.map((memberIn, index) =>
                    <FindValue key={index} m1={memberOut} m2={memberIn} debts={debts}/>
                )}
            </tr>
            )}
        </tbody>
        );
        return <React.Fragment>{rows}</React.Fragment>;
    }

    return <React.Fragment>{null}</React.Fragment>;
  }

export class Full extends Component {

  constructor(props) {
    super(props);
    this.service = debtService;

    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.service.fullInfo().then(response => this.setState({
      data: response
    }));
  }

  render() {
    return (
        <div className="card-body fulldebts">
            <div id="table" className="table-responsive">
            <table className="table table-bordered text-center">
                <colgroup span="1" className="colgroup"></colgroup>
                <thead className="aqua-gradient text-white">
                <tr>
                    <th></th>
                    <Members value={this.state.data}/>
                </tr>
                </thead>
                <SeeAll value={this.state.data}/>
            </table>
            </div>
        </div>
      );
  }
}
