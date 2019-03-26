import React, { Component } from 'react';
import { taskService } from "../services/TaskService";
import { MDBBtn, MDBInput } from "mdbreact";
import { Redirect } from 'react-router'
import update from 'immutability-helper';

const Member = (taskId) => 
{
  return {id: "00000000-0000-0000-0000-000000000000", name: "", deposit: 0, debt: 0, taskId: taskId || "00000000-0000-0000-0000-000000000000"}
}

const Empty = () => 
{
  return {name: '', deposit: '', debt: ''}
}

const Errors = (length) => 
{
  var arr = [];
      for (var i = 0; i < length; i++)
          arr.push(Empty());

  return {
    name: '',
    sum: {
            deposit: '',
            debt: ''
          },
    members: arr
  }
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
        sum: '',
        depositsMember: 0,
        debtsMember: 0,
        debts: [],
        members: []
      },
      errors:{
        name: '',
        sum: {
            deposit: '',
            debt: ''
          },
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
          name: '',
          sum: {
            deposit: '',
            debt: ''
          },
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
  checkErrors()
  {
    if (JSON.stringify(this.state.errors) === JSON.stringify(Errors(this.state.task.members.length)))
    return false
    return true
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
    this.setState(update(this.state,{ task: {members: {0: {deposit: {$set: value}}}}}), () => this.setState(prevState => ({
      task: {
          ...prevState.task,
          sum: value
      }
    }), () => 
    {
      this.changeSum(); 
      var array = this.state.task.members;
      let error = '';
      if (!value) error = 'Required'; 
      if(value < 0) error = "Min value is 0";
      var sum = 0;
      for (let index = 0; index < array.length; index++) {
        sum = +sum + +array[index].deposit;
      }
      if(+value !== sum) {
        error = "Sum of deposits not equal sum";
        document.getElementById("sum").setCustomValidity("Sum of deposits not equal sum");
      }else{
        document.getElementById("sum").setCustomValidity("");
      }

       this.setState(
        prevState => ({
            errors: {
                ...prevState.errors,
                sum: {
                    ...prevState.errors.sum,
                    deposit: error
                  },
            }
        }))
     
    }))
  }

  validateMemberName(value, index, stateCopy)
  {
    let error = '';
    if (!value) {
      error = 'Required';
    }
    if (stateCopy.errors.members[index].name !== 'Duplicate') 
    {
      stateCopy.errors.members[index].name = error;
    }
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
    var mas = document.getElementsByClassName("name");
    if (dup.length>0) {
        dup.map(function(index, elem) {
        mas[index].setCustomValidity("Duplicate")
        stateCopy.errors.members[index].name = "Duplicate";
        return null;
      })
    }
    else{
      for (let item of mas) {
        item.setCustomValidity("")
      }
    }
    this.setState(stateCopy);
  }

  validateMemberDeposit(value, index, stateCopy)
  {
    stateCopy.task.members[index].deposit = value;
    let error = '';
    let sumError = '';
    if (!value) error = 'Required'; else if(value < 0) error = "Min value is 0";

    var array = stateCopy.task.members;
    var sum = this.calculateDepositSum(array, array.length);
    var mainSum = stateCopy.task.sum;
    if(+mainSum !== sum) 
    {
      document.getElementById("sum").setCustomValidity("Sum of deposits not equal sum");
      sumError = "Sum of deposits not equal sum";
    }
    else
    {
      document.getElementById("sum").setCustomValidity("");
    }

    stateCopy.errors.members[index].deposit = error;
    stateCopy.errors.sum.deposit = sumError;
  }

  validateMemberDebt(value, index, stateCopy)
  {
    stateCopy.task.members[index].debt = value;
    let error = '';
    let sumError = '';
    if (!value) error = 'Required'; else if(value < 0) error = "Min value is 0";

    var array = stateCopy.task.members;
    var sum = this.calculateDebtSum(array, array.length);
    var mainSum = stateCopy.task.sum;
   if(+mainSum !== sum) 
    {
      document.getElementById("sum").setCustomValidity("Sum of debts not equal sum");
      sumError = "Sum of debts not equal sum";
    }
    else
    {
      document.getElementById("sum").setCustomValidity("");
    }
    stateCopy.errors.members[index].debt = error;
    stateCopy.errors.sum.debt = sumError;
  }

  changeSum() {
    var sumInput = this.state.task.sum;
    var depositInputs = this.state.task.members;
    if (depositInputs.length === 0) return;
  
   if (this.debtEditInputs.length !== 0) {
     var debtsEditSum = 0;
     debtsEditSum = this.calculateDebtSumIndex(this.debtEditInputs, this.debtEditInputs.length);
     sumInput -= debtsEditSum;
   }
   var debtsInputs = [];
   for (var i = 0; i < this.state.task.members.length; i++) {
     if (this.debtEditInputs.indexOf(i)===-1){ debtsInputs.push(this.state.task.members[i])};
   }

   var debtsLength = debtsInputs.length;
   if(debtsLength===0) return;
   var basicValueWithError = parseFloat((sumInput / debtsLength).toFixed(2));
   var iterator = 0;
   if (basicValueWithError < 0)
   {
     this.setState(prevState => ({
              errors: {
                  ...prevState.errors,
                  sum: {
                    ...prevState.errors.sum,
                    debt: "Sum of debts not equal sum"
                  }, 
              }
          }))
       basicValueWithError = 0;
    }
    else
    {
      this.setState(prevState => ({
              errors: {
                  ...prevState.errors,
                  sum: {
                    ...prevState.errors.sum,
                    debt: ""
                  }, 
              }
          }))
       var sumWithError = basicValueWithError * debtsLength;

       var error = parseFloat((sumInput - sumWithError).toFixed(2));

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
     }

    while (iterator < debtsLength) {
      debtsInputs[iterator].debt = basicValueWithError;
     iterator++;
    }
    
    //this.sumValidator();
 }

  calculateDepositSum(inputs, length) {
    var sum = 0;
    for (var iterator = 0; iterator < length; iterator++) {
      sum += parseFloat(inputs[iterator].deposit);
    }
    return parseFloat(sum.toFixed(2));
  }

  calculateDebtSumIndex(inputs, length) {
    var sum = 0;
    for (var i = 0; i < inputs.length; i++) {
      sum += parseFloat(this.state.task.members[inputs[i]].debt);
    }
    return parseFloat(sum.toFixed(2));
  }

  calculateDebtSum(inputs, length) {
    var sum = 0;
    for (var iterator = 0; iterator < length; iterator++) {
      sum += parseFloat(inputs[iterator].debt);
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

      if (this.state.task.members.length > 0)
        this.validateSum(val);
      else
        this.setState(prevState => ({
          task: {
              ...prevState.task,
              sum: val
          }
        }));
        break;
      default:
        break;
    }
  }

  onChangeMembers(e){
    var val = e.target.value;
    var index = e.target.parentNode.parentNode.parentNode.id;

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
    var index = e.target.parentNode.parentNode.parentNode.id;
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
        this.changeSum();
        this.validateDuplicateNames(); 
        (+index === 0) && this.setState(update(this.state, {errors: {members: {0: {deposit: { $set: ""}}}}}))
      }
    )
  }

 

 render() {
    if (this.state.redirect) {
      return <Redirect to='/tasks'/>;
    }
    this.checkErrors();
    return (
      <form className="was-validated" noValidate>
      <div className="card addoredit">
        <h3 className="blue-gradient white-text card-header text-center font-weight-bold text-uppercase py-4">
        {this.state.task.name && <span>EDIT {this.state.task.name}</span>}
        {!this.state.task.name && <span>ADD TASK</span>}
        </h3>
        <div className="card-body">
        <div className="form-inline">
          <input name="name" value={this.state.task.id} readOnly type="hidden"/>
          <input name="name" value={this.state.task.userId} readOnly type="hidden"/>

          <div className="form-inline mt-5 mx-5 d-flex flex-column">
            <div className="md-form md-outline form-group mt-2 form-lg mb-0">
              <MDBInput name="name" label="Task Name" value={this.state.task.name} 
              onChange={this.onChangeTask} className="form-control form-control-lg nameInput" required/>
              {this.state.errors.name && <span className="invalid-feedback">{this.state.errors.name}</span>}
            </div>
          </div>
          <div className="form-inline mt-5 mx-5 d-flex flex-column">
            <div className="md-form md-outline form-group mt-2 form-lg mb-0">
            <MDBInput id="sum" type="number" min="0" max="999999999" name="sum" label="Sum" 
              value={`${this.state.task.sum}`} onChange={this.onChangeTask} className="form-control form-control-lg" required/>
              {this.state.errors.sum.deposit && <span className="invalid-feedback">{this.state.errors.sum.deposit}</span>}
              {this.state.errors.sum.debt && <span className="invalid-feedback">{this.state.errors.sum.debt}</span>}
          
            </div>
          </div>
          </div>
          <div className="mt-3 table-responsive text-center">

          <MDBBtn color="primary" className="float-left" onClick={this.add}>Add new</MDBBtn>
          <MDBBtn id="saveBtn" color="success" className="float-left" onClick={this.save} disabled={this.checkErrors()}>Save</MDBBtn>
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
                    <MDBInput required name ="name" type="text" value={`${item.name}`} onChange={this.onChangeMembers} className="form-control name"/>
                    {this.state.errors.members[index].name && <span className="invalid-feedback">{this.state.errors.members[index].name}</span>}
                  </td>
                  <td>
                    <MDBInput required name ="deposit" type="number" value={`${item.deposit}`} onChange={this.onChangeMembers} className="form-control"/>
                    {this.state.errors.members[index].deposit && <span className="invalid-feedback">{this.state.errors.members[index].deposit}</span>}
                    </td>
                  <td>
                    <MDBInput required name ="debt" type="number" value={`${item.debt}`} onChange={this.onChangeMembers} className="form-control"/>
                    {this.state.errors.members[index].debt && <span className="invalid-feedback">{this.state.errors.members[index].debt}</span>}
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
      </form>
      );
  }
}

