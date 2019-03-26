import React, { Component } from 'react';
import { taskService } from "../services/TaskService";
import { MDBBtn, } from "mdbreact";
import { Link } from 'react-router-dom';

function TaskMembers(props) {

  const member = (
    <td>
    {props.members.map((post) =>
      <Link key={post.id} to={`/debts?memberId=${post.id}`}>{post.name}&nbsp;</Link>
      )}
    </td>
    );

  return <React.Fragment>{member}</React.Fragment>;
}

function TaskItem(props) {

  const rows = (
    <tbody>
    {props.taskItems.map((post, index) =>
      <tr key={post.id} id={post.id}>
      <td><Link to={`/AddOrEditTasks?taskId=${index+1}`}>{post.name}</Link></td>
      <td>{post.sum}</td>
      <TaskMembers members={post.members}/>
      <td><MDBBtn style={{padding: "5px 20px"}} onClick={Task.remove} color="danger">Remove</MDBBtn></td>
      </tr>
      )}
    </tbody>
    );

  

  return <React.Fragment>{rows}</React.Fragment>;
}

export class Task extends Component {

  constructor(props) {
    super(props);
    this.service = taskService;
    this.state = {
      data: []
    }
  }

  static remove(e){
    var index = e.target.parentNode.parentNode.id;
    taskService.remove(index);
    e.target.parentNode.parentNode.remove();
  }

  componentDidMount() {
    this.service.getAll().then(response => this.setState({
      data: response
    }));
  }


  render() {
    return (
      <div className="card tasks">
        <h3 class="blue-gradient card-header text-center font-weight-bold text-uppercase py-4">Tasks</h3>
        <div className="card-body">
          <div className="table-responsive text-center">
            <table class="table table-bordered text-center">
              <thead class="blue-gradient white-text">
                <tr>
                  <th className="">Name</th>
                  <th className="">Money</th>
                  <th className="">Members</th>
                  <th className="">Remove</th>
                </tr>
              </thead>
              <TaskItem taskItems={this.state.data}/>
            </table>
          </div>
          <Link to="/AddOrEditTasks"><MDBBtn color="primary">Add new</MDBBtn></Link>
        </div>
      </div>
      );
  }
}