import React, { Component } from 'react';

const styles = {
  componentContainer: {
    width: '20%',
    borderLeft: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    height: '15rem',
  },
  productList: {
    listStyle: 'none'
  },
  confirmButton: {
    fontFamily: 'Rubik',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '0.5rem 1.2rem',
    borderRadius: '100px',
    backgroundColor: '#5666CC',
    color: 'white',
  },
}
export default class OrderSummary extends Component {
	render() {
		return (
      <div style={styles.componentContainer}>
        <h1>Order Summary</h1>
        <ul style={styles.productList}>
          {this.props.orderProducts.map((productVariant, i) => <li key={i}>{productVariant}</li>)}
        </ul>
        <button style={styles.confirmButton}>Confirm Shipment</button>
      </div>
    );
	}
}