import React from 'react';

export default class CustomerInfo extends React.Component {
  render() {
    return (
      // <div style={styles.componentContainer}>
        <div style={styles.titleContainer}>
          <h2 style={styles.customerEmail}>{this.props.customerEmail}</h2>
          {/* <button style={styles.zendeskButton}>Zendesk Tickets</button> */}
        </div>
      // </div>
    );
  }
}

const styles = {
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: '1rem',
  },
  customerEmail: {

  },
  // zendeskButton: {
  //   fontFamily: 'Rubik',
  //   fontSize: '1rem',
  //   fontWeight: 500,
  //   padding: '0.5rem 1.2rem',
  //   borderRadius: '100px',
  //   backgroundColor: '#5666CC',
  //   color: 'white',
  // },
};
