import React, { Component } from 'react';
import { taskService } from "../services/TaskService";
import { MDBBtn } from "mdbreact";
import { Redirect } from 'react-router'
import update from 'react-addons-update'; 

const Member = (taskId) => 
{
  return {id: "00000000-0000-0000-0000-000000000000", name: "", deposit: 0, debt: 0, taskId: taskId || "00000000-0000-0000-0000-000000000000"}
}

const Empty = () => 
{
  return {name: '', deposit: '', debt: ''}
}


export class AddOrEditTasks extends Component {

  constructor(props) {
    super(props);
    this.service = taskService;
    this.state = {
      remove: false,
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
      },
      errors:{
        name: '',
        sum: '',
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
    taskId && this.service.get(taskId).then(response => 
    {
      var arr = [];
      for (var i = 0; i < response.members.length; i++)
          arr.push(Empty());

      this.setState({
        task: response,
        errors: {
          members: arr
        }
      });
    })
  }


  componentDidUpdate(prevProps, prevState) {
    if (this.state.remove) {
        this.setState(() => ({remove: false}));
    }
  }

  componentWillUnmount() {
      clearTimeout(this.turnOffRedTimeout);
  }
  validateName(value) {
    this.setState(prevState => ({
              task: {
                  ...prevState.task,
                  name: value
              }
          }))
    let error = '';
    if (!value) {
      error = 'Required';
    } 
    this.setState(prevState => ({
              errors: {
                  ...prevState.errors,
                  name: error
              }
          }))
  }

  validateSum(value) {
    this.setState(prevState => ({
              task: {
                  ...prevState.task,
                  sum: value
              }
          }), ()=>{this.changeSum()})
    let error = '';
    if (!value) error = 'Required'; else if(value < 0) error = "Min value is 0";
    this.setState(prevState => ({
              errors: {
                  ...prevState.errors,
                  sum: error
              }
          }))
  }

  validateMemberName(value, index, stateCopy)
  {
    let error = '';
    if (!value) {
      error = 'Required';
    }
    if (stateCopy.errors.members[index].name !== 'Duplicate') stateCopy.errors.members[index].name = error;
  }

  validateDuplicateNames()
  {
    var stateCopy = Object.assign({}, this.state);
    stateCopy.task.members = stateCopy.task.members.slice();
    
    var dup = [];
    for (var i = 0; i < this.state.task.members.length; i++) {
      for (var j = 0; j < this.state.task.members.length; j++) {
        if ((this.state.task.members[i].name === this.state.task.members[j].name && i!==j)) {
          if (this.state.task.members[i].name !== '') dup.push(i);
        }
      }
    }
    dup = [...new Set(dup)];
    stateCopy.errors.members.map(function(index, elem) {
      if (index.name !== 'Required') index.name = '';
      return null;
    });
    if (dup.length>0) {
        dup.map(function(index, elem) {
        stateCopy.errors.members[index].name = "Duplicate";
        return null;
      })
    }

    this.setState(stateCopy);
  }

  validateMemberDeposit(value, index, stateCopy)
  {
    stateCopy.task.members[index].deposit = value;
    let error = '';
    if (!value) error = 'Required'; else if(value < 0) error = "Min value is 0";

    stateCopy.errors.members[index].deposit = error;
  }

  validateMemberDebt(value, index, stateCopy)
  {
    stateCopy.task.members[index].debt = value;
    let error = '';
    if (!value) error = 'Required'; else if(value < 0) error = "Min value is 0";

    stateCopy.errors.members[index].debt = error;
  }

  changeSum() {
    var sumInput = this.state.task.sum;
    var depositInputs = this.state.task.members;
    if (depositInputs.length === 0) return;
    depositInputs[0].deposit = sumInput;
   if (this.debtEditInputs.length !== 0) {
     var debtsEditSum = 0;
     debtsEditSum = this.CalculateDebtSum(this.debtEditInputs, this.debtEditInputs.length);
     sumInput -= debtsEditSum;
   }
   var debtsInputs = [];
   for (var i = 0; i < this.state.task.members.length; i++) {
     if (this.debtEditInputs.indexOf(i)===-1){ debtsInputs.push(this.state.task.members[i])};
   }

   var debtsLength = debtsInputs.length;
   if(debtsLength===0) return;
   var basicValueWithError = parseFloat((sumInput / debtsLength).toFixed(2));

   var sumWithError = basicValueWithError * debtsLength;

   var error = parseFloat((sumInput - sumWithError).toFixed(2));

   var iterator = 0;
   if (error !== 0) {
     var sign = (error >= 0) ? true : false;
     while (error !== 0) {
       switch (sign) {
         case false:
           error = parseFloat((error + 0.01).toFixed(2));
           debtsInputs[iterator].debt = parseFloat((basicValueWithError - 0.01).toFixed(2));
           break;

         case true:
           error = parseFloat((error - 0.01).toFixed(2));
           debtsInputs[iterator].debt = parseFloat((basicValueWithError + 0.01).toFixed(2));
           break;
          default:
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
    for (var i = 0; i < inputs.length; i++) {
      sum += parseFloat(this.state.task.members[inputs[i]].debt);
    }
    return parseFloat(sum.toFixed(2));
  }

  changeDebt(index) {
    //this.sumValidator();
    if(this.debtEditInputs.indexOf(+index)===-1){
      this.debtEditInputs.push(+index);
    }
  }

  onChangeTask(e) {
    var val = e.target.value;
    switch(e.target.name)
    {
      case "name":
        this.validateName(val);
        break;
      case "sum":
        this.validateSum(val);
        break;
      default:
        break;
    }
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
        this.validateDuplicateNames();
        this.validateMemberName(val, index, stateCopy);
        break;
      case "deposit":
        this.validateMemberDeposit(val, index, stateCopy);
        break;
      case "debt":
        this.validateMemberDebt(val, index, stateCopy);
        this.changeDebt(index);
        break;
      default:
        break;
    }
    this.setState(stateCopy);
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
          members: [...prevState.task.members, Member(this.state.task.id)]},
      errors: {
          ...prevState.errors,
          members: [...prevState.errors.members, Empty()]}
    }), () => {
      this.changeSum()
    })
  }

  remove(e){
    var index = e.target.parentNode.parentNode.id;
    if (this.debtEditInputs.indexOf(+index)!==-1)
    {
      this.debtEditInputs.splice(this.debtEditInputs.indexOf(+index), 1);
    }
    for (var i = 0; i < this.debtEditInputs.length; i++) {
      if (this.debtEditInputs[i] > index)
      this.debtEditInputs[i] = this.debtEditInputs[i]-1;
    }
    

    this.state.errors.members.splice(index, 1);
    this.state.task.members.splice(index, 1)



    this.setState(prevState => ({
          task: {
              ...prevState.task,
              members: this.state.task.members
          },
          errors: {
              ...prevState.errors,
              members: this.state.errors.members
          }
      }), ()=> {
        this.changeSum();this.validateDuplicateNames(); 
        (+index === 0) && this.setState(update(this.state, {errors: {members: {0: {deposit: { $set: ""}}}}}))
      }
    )
  }

 

 render() {

  
  console.log(this.state.errors.members);
    if (this.state.redirect) {
      return <Redirect to='/tasks'/>;
    }
    return (
      <div className="card">
        <h3 className="blue-gradient white-text card-header text-center font-weight-bold text-uppercase py-4">
        Tasks
        </h3>
        <div className="card-body">
        <div className="form-inline">
          <input name="name" value={this.state.task.name} onChange={this.onChangeTask} className="form-control"/>
          {this.state.errors.name && <span className="text-danger">{this.state.errors.name}</span>}
          <input name="sum" type="number" value={this.state.task.sum} onChange={this.onChangeTask} className="form-control"/>
          {this.state.errors.sum && <span className="text-danger">{this.state.errors.sum}</span>}
          </div>
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
                  <td>
                    <input name ="name" value={item.name} onChange={this.onChangeMembers} className="form-control"/>
                    {this.state.errors.members[index].name && <span className="text-danger">{this.state.errors.members[index].name}</span>}
                  </td>
                  <td>
                    <input name ="deposit" type="number" value={item.deposit} onChange={this.onChangeMembers} className="form-control"/>
                    {this.state.errors.members[index].deposit && <span className="text-danger">{this.state.errors.members[index].deposit}</span>}
                    </td>
                  <td>
                    <input name ="debt" type="number" value={item.debt} onChange={this.onChangeMembers} className="form-control"/>
                    {this.state.errors.members[index].debt && <span className="text-danger">{this.state.errors.members[index].debt}</span>}
                  </td>
                  <td>
                      <MDBBtn style={{padding: "5px 20px"}} onClick={(e) => {this.setState({remove: true});this.remove(e)}} color="danger" disabled={this.state.remove}>Remove</MDBBtn>
                  </td>
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
