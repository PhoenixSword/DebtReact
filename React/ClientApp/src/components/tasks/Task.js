import React, { Component } from 'react';
import { taskService } from "../services/TaskService";
import { MDBCard, MDBCardHeader, MDBCardBody, MDBTableEditable, MDBBtn, } from "mdbreact";

import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

function TaskMembers(props) {

  const member = (
    <td>
    {props.members.map((post) =>
      <React.Fragment key={post.id}>{post.name}&nbsp;</React.Fragment>
      )}
    </td>
    );

  return <React.Fragment>{member}</React.Fragment>;
}

function TaskItem(props) {

  const rows = (
    <tbody>
    {props.taskItems.map((post, index) =>
      <tr key={post.id}>
      <td>{index+1}</td>
      <td>{post.name}</td>
      <td>{post.sum}</td>
      <TaskMembers members={post.members}/>
      <td><MDBBtn style={{padding: "5px 20px"}} onClick={() => Task.remove(post.id)} color="danger">Remove</MDBBtn></td>
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

  static remove(id)
  {
    taskService.remove(id);
  }

  componentDidMount() {
    this.service.getAll().then(response => this.setState({
      data: response
    }));
  }

  render() {
    return (
      <div className="card">
        <h3 className="blue-gradient white-text card-header text-center font-weight-bold text-uppercase py-4">
        Tasks
        </h3>
        <div className="card-body text-center">
          <div className="table-responsive">
            <table className="table">
              <thead className="">
                <tr>
                  <th className="">#</th>
                  <th className="">Name</th>
                  <th className="">Money</th>
                  <th className="">Members</th>
                  <th className="">Remove</th>
                </tr>
              </thead>
              <TaskItem taskItems={this.state.data}/>
            </table>
          </div>
        </div>
      </div>
      );
  }
}