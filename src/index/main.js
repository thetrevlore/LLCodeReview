import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import EditOrder from '../EditOrder';
import Header from '../Header';
import Settings from '../Settings';
import NewOrder from '../NewOrder';
import SignIn from '../SignIn';

export default class IndexMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      representative: '',
    };

    this.setRep = this.setRep.bind(this);
  }

  componentDidMount() {
    if(!window.localStorage.getItem('session_token')) {
      this.props.history.push('/');
    }
  }

  setRep(firstName) {
    this.setState({ representative: firstName });
  }

	render() {
		return (
      <div id='index'>
			  <div className='content-container'>
          <Header />
          <div className='main-and-order-summary'>
            <main className='main--container'>
            <Switch>
              <Route name='SignIn' exact path='/' render={(routeProps) => <SignIn {...routeProps} setRep={this.setRep} />} />
              <Route name='NewOrder' path='/new-order' render={(routeProps) => <NewOrder {...routeProps} representative={this.state.representative} setRep={this.setRep} />} />
              <Route name='EditOrder' path='/edit-order' render={(routeProps) => <EditOrder {...routeProps} representative={this.state.representative} setRep={this.setRep} />} />
              {/* <Route name='settings' path='/settings' component={Settings} /> */}
            </Switch>
            </main>
          </div>
			  </div>
      </div>
    );
	}
}
