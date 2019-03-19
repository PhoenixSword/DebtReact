import React, { Component } from 'react';
import { taskService } from "../services/TaskService";
import { MDBBtn, } from "mdbreact";
import { Redirect } from 'react-router'

const Member = (taskId) => 
{
  return {id: "00000000-0000-0000-0000-000000000000", name: "", deposit: 0, debt: 0, taskId: taskId || "00000000-0000-0000-0000-000000000000"}
}

export class AddOrEditTasks extends Component {

  constructor(props) {
    super(props);
    this.service = taskService;
    this.state = {
      redirect: false,
      task: {
        id: '00000000-0000-0000-0000-000000000000',
        userId: '00000000-0000-0000-0000-000000000000',
        name: '',
        sum: 0,
        depositsMember: 0,
        debtsMember: 0,
        debts: [],
        members: []
      }
    }
    this.onChangeTask = this.onChangeTask.bind(this);
    this.onChangeMembers = this.onChangeMembers.bind(this);
    this.add = this.add.bind(this);
    this.save = this.save.bind(this);
    this.remove = this.remove.bind(this);
    this.changeSum = this.changeSum.bind(this);
    this.changeDebt = this.changeDebt.bind(this);

    this.debtEditInputs = [];
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    const taskId = params.get('taskId');
    taskId && this.service.get(taskId).then(response => this.setState({
      task: {
        id: response.id,
        userId: response.userId,
        name: response.name,
        sum: response.sum,
        depositsMember: response.depositsMember,
        debtsMember: response.debtsMember,
        debts: response.debts,
        members: response.members
      }
    }));
    
  }

  changeSum(sum) {
    var sumInput = sum;
    var depositInputs = this.state.task.members;
    console.log(depositInputs);
    if (depositInputs.length === 0) return;
    depositInputs[0].deposit = sumInput;

   if (this.debtEditInputs.length != 0) {
     var debtsEditSum = 0;
     debtsEditSum = this.CalculateDebtSum(this.debtEditInputs, this.debtEditInputs.length);
     sumInput -= debtsEditSum;
   }

   var debtsInputs = this.state.task.members.filter(n=>!this.debtEditInputs.includes(n));
   var debtsLength = debtsInputs.length;
   if(debtsLength==0) return;
   var basicValueWithError = parseFloat((sumInput / debtsLength).toFixed(2));

   var sumWithError = basicValueWithError * debtsLength;

   var error = parseFloat((sumInput - sumWithError).toFixed(2));

   var iterator = 0;
   if (error != 0) {
     var sign = (error >= 0) ? true : false;
     while (error != 0) {
       switch (sign) {
         case false:
           error = parseFloat((error + 0.01).toFixed(2));
           debtsInputs[iterator].debt = parseFloat((basicValueWithError - 0.01).toFixed(2));
           break;

         case true:
           error = parseFloat((error - 0.01).toFixed(2));
           debtsInputs[iterator].debt = parseFloat((basicValueWithError + 0.01).toFixed(2));
           break;
       }
       iterator++;
     }
   }

    while (iterator < debtsLength) {
      debtsInputs[iterator].debt = basicValueWithError;
     iterator++;
    }
    this.setState(prevState => ({
      task: {
          ...prevState.task,
          members: this.state.task.members
      }
  }))
    //this.sumValidator();
 }

  CalculateDepositSum(inputs, length) {
    var sum = 0;
    for (var iterator = 0; iterator < length; iterator++) {
      sum += parseFloat(inputs[iterator].deposit);
    }
    return parseFloat(sum.toFixed(2));
  }

  CalculateDebtSum(inputs, length) {
    var sum = 0;
    for (var iterator = 0; iterator < length; iterator++) {
      sum += parseFloat(inputs[iterator].debt);
    }
    return parseFloat(sum.toFixed(2));
  }

  changeDebt(index) {
    //this.sumValidator();
    if(this.debtEditInputs.indexOf(this.state.task.members[index])==-1)
    this.debtEditInputs.push(this.state.task.members[index]);
  }

  onChangeTask(e) {
    var val = e.target.value;
    switch(e.target.name)
    {
      case "name":
        this.setState(prevState => ({
            task: {
                ...prevState.task,
                name: val
            }
        }))
        break;
      case "sum":
        this.setState(prevState => ({
            task: {
                ...prevState.task,
                sum: val
            }
        }))
        break;
      default:
        break;
    }
    this.changeSum(val);
  }

  onChangeMembers(e){
    var val = e.target.value;
    var index = e.target.parentNode.parentNode.id;

    var stateCopy = Object.assign({}, this.state);
    stateCopy.task.members = stateCopy.task.members.slice();
    stateCopy.task.members[index] = Object.assign({}, stateCopy.task.members[index]);

    switch(e.target.name)
    {
      case "name":
        stateCopy.task.members[index].name = val;
        break;
      case "deposit":
        stateCopy.task.members[index].deposit = val;
        break;
      case "debt":
        stateCopy.task.members[index].debt = val;
        break;
      default:
        break;
    }
    this.setState(stateCopy);
    this.changeDebt(index);
  }


  save(){
    this.service.save(this.state.task).then(
      (response)=> {
        this.setState(state => ({redirect: true}))
      });
      
  }


  add(){
    this.setState(prevState => ({
      task: {
          ...prevState.task,
          members: [...prevState.task.members, Member(this.state.task.id)]}
    }), () => {
      this.changeSum(this.state.task.sum)
    })
  }

  remove(e){
    var index = e.target.parentNode.parentNode.id;
    this.state.task.members.splice(index, 1)
    this.setState(prevState => ({
          task: {
              ...prevState.task,
              members: this.state.task.members
          }
      }))
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to='/tasks'/>;
    }
    return (
      <div className="card">
        <h3 className="blue-gradient white-text card-header text-center font-weight-bold text-uppercase py-4">
        Tasks
        </h3>
        <div className="card-body">
          <input name="name" value={this.state.task.name} onChange={this.onChangeTask} />
          <input name="sum" value={this.state.task.sum} onChange={this.onChangeTask} />
          <div className="mt-3 table-responsive text-center">

          <MDBBtn color="primary" className="float-left" onClick={this.add}>Add new</MDBBtn>
          <MDBBtn color="success" className="float-left" onClick={this.save}>Save</MDBBtn>
            <table className="table">
              <thead className="blue-gradient white-text">
                <tr>
                  <th className="">Name</th>
                  <th className="">Deposit</th>
                  <th className="">Debt</th>
                  <th className="">Remove</th>
                </tr>
              </thead>
              <tbody>
              {this.state.task.members.map((item, index) =>
                <tr key={index} id={index}>
                  <td><input name ="name" value={item.name} onChange={this.onChangeMembers}/></td>
                  <td><input name ="deposit" value={item.deposit} onChange={this.onChangeMembers}/></td>
                  <td><input name ="debt" value={item.debt} onChange={this.onChangeMembers}/></td>
                  <td><MDBBtn style={{padding: "5px 20px"}} onClick={this.remove} color="danger">Remove</MDBBtn></td>
                </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      );
  }
}