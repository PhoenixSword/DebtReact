import React, { Component } from 'react';
import { taskService } from "../services/TaskService";
import { MDBBtn } from "mdbreact";
import { Redirect } from 'react-router'

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
          }))
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
    }))
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
    this.validateDuplicateNames();
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
          {this.state.errors.name && <span className="text-danger">{this.state.errors.name}</span>}
          <input name="sum" type="number" value={this.state.task.sum} onChange={this.onChangeTask} />
          {this.state.errors.sum && <span className="text-danger">{this.state.errors.sum}</span>}
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
                    <input name ="name" value={item.name} onChange={this.onChangeMembers}/>
                    {this.state.errors.members[index].name && <span className="text-danger">{this.state.errors.members[index].name}</span>}
                  </td>
                  <td>
                    <input name ="deposit" type="number" value={item.deposit} onChange={this.onChangeMembers}/>
                    {this.state.errors.members[index].deposit && <span className="text-danger">{this.state.errors.members[index].deposit}</span>}
                    </td>
                  <td>
                    <input name ="debt" type="number" value={item.debt} onChange={this.onChangeMembers}/>
                    {this.state.errors.members[index].debt && <span className="text-danger">{this.state.errors.members[index].debt}</span>}
                  </td>
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