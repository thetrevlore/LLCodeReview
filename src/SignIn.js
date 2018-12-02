import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';

export default class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
    };

    this.onSignIn = this.onSignIn.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  async onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log("ID Token: " + id_token);
    try {
      const response = await axios.post(`/api/signin`, { id_token });
      const { session_token, first_name } = response.data;
      window.localStorage.setItem('session_token', session_token);
      window.localStorage.setItem('representative', first_name);
      this.props.setRep(first_name);
      this.props.history.push('/edit-order');
    } catch(e) {
      this.setState({ error: e.message });
    }
  };

  onFailure(err) {
    this.setState({ error: err.error });
    // console.log(' err ->', err);
  }

	render() {
		return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingTop: 20, justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>You will be redirected to Google for Login.</h1>
        <GoogleLogin
          clientId="GOOGLE_CLIENT_ID"
          autoLoad={true}
          onSuccess={this.onSignIn}
          onFailure={this.onFailure}
         />
        {this.state.error ?
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', marginTop: '1rem' }}>
            <p style={{ color: 'red', fontSize: '1.5rem' }}>{this.state.error}</p>
          </div>
        : null}
      </div>
    );
	}
}
