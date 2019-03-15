import React, { Component } from 'react';
import {taskService} from "../services/TaskService";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBModalFooter,
  MDBIcon,
  MDBCardHeader,
  MDBBtn,
  MDBInput
} from "mdbreact";

function TaskMembers(props) {

  const member = (
    <td>
      {props.members.map((post) =>
          <React.Fragment>{post.name}&nbsp;</React.Fragment>
      )}
    </td>
  );

  return <React.Fragment>{member}</React.Fragment>;
}

function TaskItem(props) {

    const rows = (
      <tbody>
        {props.taskItems.map((post) =>
          <tr>
            <td>{post.name}</td>
            <td>{post.sum}</td>
            <TaskMembers members={post.members}/>
            <td><MDBBtn  color="danger">Remove</MDBBtn></td>
          </tr>
        )}
      </tbody>
    );

    return <React.Fragment>{rows}</React.Fragment>;
}

export class Task extends Component {

  constructor (props) {
    super(props);
    this.service = taskService;
    this.taskItems;

    this.state = {
      data: []
    }
  }

  componentDidMount() {
    this.service.getAll().then(res => this.taskItems = res).then(response => this.setState({
      data: response}));
  }

  render () {
    return (
        <div className="card">
        <h3>Tasks</h3>
        <div className="card-body">
          <div id="table" className="table-editable">
            <table className="table table-bordered table-responsive-md text-center">
              <thead className="blue-gradient white-text">
                <tr>
                  <th>
                    Name
                  </th>
                  <th>
                    Money
                  </th>
                  <th>
                    Members
                  </th>
                  <th>
                    Remove
                  </th>
                </tr>
              </thead>
                <TaskItem taskItems={this.state.data}/>
            </table>
            <a className="btn btn-primary">Add new</a>
          </div>
        </div>
      </div>
  );
  }
}
