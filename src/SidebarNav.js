// import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

// const styles = {
//   componentContainer: {
//     width: '12vw',
//     borderRight: '1px solid black',
//     height: '15rem'
//   },
//   logoContainer: {
//     display: 'flex',
//     width: '100%',
//     padding: '1rem',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoImage: {
//     width: '50px',
//     height: '50px'
//   },
//   listContainer: {
//     padding: '1rem',
//     listStyle: 'none',
//   },
//   listItem: {
//     marginBottom: '1rem'
//   },
//   link: {
//     textDecoration: 'none',
//     cursor: 'pointer',
//   }
// };

// export default class SidebarNav extends Component {
//   constructor(props) {
//     super(props);
//     this.selectPage = this.selectPage.bind(this);
//   }

//   selectPage(pageName) {
//     return ((e) => {
//       this.props.goToPage(pageName);
//     });
//   }

// 	render() {
// 		return (
//       <div style={styles.componentContainer}>
//         <div style={styles.logoContainer}>
//           <img src='../assets/img/du-logo.svg' style={styles.logoImage} />
//         </div>

//         <ul style={styles.listContainer}>
//           <li style={styles.listItem}><Link style={styles.link} to='/shipping' onClick={this.selectPage('Shipping')}>Shipping</Link></li>
//           <li style={styles.listItem}><Link style={styles.link} to='/edit-order' onClick={this.selectPage('Edit Order')}>Edit Order</Link></li>
//           <li style={styles.listItem}><Link style={styles.link} to='/settings' onClick={this.selectPage('Settings')}>Settings</Link></li>
//         </ul>
//       </div>
//     );
// 	}
// }