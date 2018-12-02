import React from 'react';

const styles = {
  productContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    padding: '1rem',
    borderBottom: '1px solid gray',
  },
  productImage: {
    margin: '1rem',
    height: '50px',
    width: '50px'
  },
  addToShipmentButton: {
    fontFamily: 'Rubik',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '0.5rem 1.2rem',
    borderRadius: '100px',
    backgroundColor: '#5666CC',
    color: 'white',
  },
  liCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
  liRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
}

export default class SkuListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedVariant: '' };

    this.addToShipment = this.addToShipment.bind(this);
    this.setSelectedVariant = this.setSelectedVariant.bind(this);
  }

  componentDidMount() {
    this.setState({ selectedVariant: this.props.product.data.variants[0].variant.slug })
  }

  setSelectedVariant(event) {
    this.setState({ selectedVariant: event.target.value });
  }

  addToShipment() {
    this.props.addToOrder(this.state.selectedVariant);
  }

  render() {
    console.log(' this.state', this.state);
    return (
      <li key={this.props.product.uid} style={styles.productContainer}>
        <div style={styles.liCol}>
          <div style={styles.liRow}>
            <img src={this.props.product.data.product_image.url} style={styles.productImage} />
            <h3 style={styles.productTitle}>{this.props.product.data.product_name[0].text}</h3>
          </div>

          <select value={this.state.selectedVariant} onChange={this.setSelectedVariant}>
            {this.props.product.data.variants.map(productVariant => (
              <option key={productVariant.variant.uid} value={productVariant.variant.uid}>{productVariant.variant.slug}</option>
            ))}
          </select>
        </div>

        <div style={{ ...styles.liCol, alignItems: 'center', height: '7.5rem', justifyContent: 'flex-end' }}>
          <button style={styles.addToShipmentButton} onClick={this.addToShipment}>Add to Shipment</button>
        </div>
      </li>
    );
  }
}