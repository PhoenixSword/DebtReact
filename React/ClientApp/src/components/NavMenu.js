import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import {userService} from "./services/UserService.js";
import './NavMenu.css';

function Greeting(props) {
    if (userService.authorize()) {
      return <UserGreeting />;
    }
    return <GuestGreeting />;
  }

  function UserGreeting(props) {
  return <React.Fragment> 
          <NavItem>
            <NavLink tag={Link} className="text-dark" to="#">{JSON.parse(localStorage.getItem('currentUser')).email}</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} className="text-dark" to="#" onClick={userService.logout}>Logout</NavLink>
          </NavItem>
        </React.Fragment>;
  }

  function GuestGreeting(props) {
  return <React.Fragment>  
          <NavItem>
            <NavLink tag={Link} className="text-dark" to="/login">Login</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} className="text-dark" to="/register">Register</NavLink>
          </NavItem>
        </React.Fragment> ;
  }


export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      collapsed: true
    };
  }


  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render () {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">React</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/tasks">Tasks</NavLink>
                </NavItem>
              </ul>
              <ul className="navbar-nav flex-grow ml-auto">
                <Greeting/>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
