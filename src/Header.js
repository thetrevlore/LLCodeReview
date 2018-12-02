import React, { Component } from 'react';
// import { GoogleLogout } from 'react-google-login';
import { Link } from 'react-router-dom';

const styles = {
  componentContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0.8rem 2rem',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(to bottom, #394959 0%,#262f3a 100%)',
    color: 'white',
    borderBottom: '1px solid black',
  },
  title: {
    paddingLeft: '2rem',
    fontSize: 15,
    textTransform: 'uppercase'
  },
  logoContainer: {

  },
  listContainer: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: '2rem'
  },
  logoImage: {
    width: '30px',
    height: '30px'
  },
  listItem: {
    marginLeft: '1.5rem'
  },
  link: {
    textDecoration: 'none',
    cursor: 'pointer',
    color: 'white',
    fontSize: '0.9rem',
    letterSpacing: '0.01rem',
    fontWeight: 500,
    textTransform: 'uppercase'
  }
}

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

	render() {
    let title;
    if (window.location.pathname === '/edit-order') {
      title = 'Edit Order'
    } else if (window.location.pathname === '/new-order') {
      title = 'New Order'
    } else {
      title = 'HQ'
    }
		return (
      <div style={styles.componentContainer}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to='/' style={styles.logoContainer} style={{ cursor: 'pointer'}}>
            <img src='../assets/img/du-logo.svg' style={styles.logoImage} />
          </Link>
          <h1 style={styles.title}>{title}</h1>
        </div>

        <ul style={styles.listContainer}>
          <li style={styles.listItem}><Link style={styles.link} to='/new-order'>New Order</Link></li>
          <li style={styles.listItem}><Link style={styles.link} to='/edit-order'>Edit Order</Link></li>
        </ul>
      </div>
    );
	}
}
