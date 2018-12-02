import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import IndexMain from '../../index/main';

export default class AppContainer extends Component {
	constructor(props) {
    super(props);
	}

	async componentWillMount() {
		const url = new URL(window.location.href);
		if(url.protocol != 'https:' && url.hostname != 'localhost') {
			window.location.href = `https://${url.href.substring(7)}`;
			return;
    }
	}

  render() {
		return (
			<BrowserRouter onUpdate={() => window.scrollTo(0, 0)}>
				<Route name='index' path='/' component={IndexMain} />
      </BrowserRouter>
		);
  }
}
