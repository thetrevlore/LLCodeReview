import React from 'react';
import GlobalStyles from './styles';

export default class AddProductToOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      variants: [],
      productId: '',
      variantId: '',
      unitPrice: '',
      unitTax: '',
      quantity: '',
    };

    this.handleProductId = this.handleProductId.bind(this);
    this.handleProductVariant = this.handleProductVariant.bind(this);
    this.handleProductQuantity = this.handleProductQuantity.bind(this);
    this.handleSubmitAddProduct = this.handleSubmitAddProduct.bind(this);
    this.handleProductPrice = this.handleProductPrice.bind(this);
    this.handleProductTax = this.handleProductTax.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  handleProductId(e) {
    if (this.props.disableChange) return this.props.showError();
    const selectedProductId = e.target.value;
    const selectedProduct = this.props.products.find(product => product.product_id === selectedProductId);
    const variants = selectedProduct ? selectedProduct.variants : [];
    const possibleVariants = this.props.uniqProductIdVariantIdPairs ? variants.filter(variant => !this.props.uniqProductIdVariantIdPairs.includes(`${selectedProductId}-${variant}`)) : variants;
    this.setState({ productId: selectedProductId, variants: possibleVariants });
  }

  handleProductVariant(e) {
    if (this.props.disableChange) return this.props.showError();
    this.setState({ variantId: e.target.value });
  }

  handleProductQuantity(e) {
    if (this.props.disableChange) return this.props.showError();
    this.setState({ quantity: e.target.value });
  }

  handleProductPrice(e) {
    if (this.props.disableChange) return this.props.showError();
    this.setState({ unitPrice: e.target.value });
  }

  handleProductTax(e) {
    if (this.props.disableChange) return this.props.showError();
    this.setState({ unitTax: e.target.value });
  }

  handleSubmitAddProduct(e) {
    if (this.props.disableChange) return this.props.showError();
    const chargePrice = Number(this.state.unitPrice);
    const chargeTax = Number(this.state.unitTax);
    const chargeTotal = (chargePrice + chargeTax) * Number(this.state.quantity);
    const change = {
      action: 'Add Item',
      productId: this.state.productId,
      variantId: this.state.variantId,
      unitPrice: Number(this.state.unitPrice),
      unitTax: Number(this.state.unitTax),
      quantity: Number(this.state.quantity),
      addr: this.props.addr,
      oldValue: 0,
      newValue: Number(this.state.quantity),
      chargePrice,
      chargeTax,
      chargeTotal,
    }
    this.props.saveChange(change);
    if (this.props.newOrder) this.resetState();
  }

  resetState() {
    this.setState({
      variants: [],
      productId: '',
      variantId: '',
      unitPrice: '',
      unitTax: '',
      quantity: '',
    });
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', border: '1px solid black', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ display: 'flex', alignSelf: 'center', marginBottom: '1rem' }}>Add Product</h3>

        <div style={styles.row}>
          <div style={styles.rowItem}>
            <select value={this.state.productId} onChange={this.handleProductId}>
              <option value='' disabled>Product</option>
              {(this.props.products || []).map(product => (<option key={product.product_id} value={product.product_id}>{product.product_id}</option>))}
            </select>
          </div>

          <div style={styles.rowItem}>
            <select value={this.state.variantId} onChange={this.handleProductVariant}>
              <option value='' disabled>Variant</option>
              {this.state.variants.map(variant => (<option key={variant} value={variant}>{variant}</option>))}
            </select>
          </div>

          
          {!this.props.newOrder ? <div style={{ display: 'flex' }}>
            <div style={styles.rowItem}>
              <input value={this.state.unitPrice} type="text" placeholder="Price" onChange={this.handleProductPrice} style={{ borderColor: 'black', padding: '0.5rem 0', paddingLeft: '1rem', width: '80%' }} />
            </div>

            <div style={styles.rowItem}>
              <input value={this.state.unitTax} type="text" placeholder="Tax" onChange={this.handleProductTax} style={{ borderColor: 'black', padding: '0.5rem 0', paddingLeft: '1rem', width: '80%' }} />
            </div>
          </div> : null}

          <div style={styles.rowItem}>
            <input value={this.state.quantity} type="text" placeholder="Quantity" onChange={this.handleProductQuantity} style={{ borderColor: 'black', padding: '0.5rem 0', paddingLeft: '1rem', width: '80%' }} />
          </div>

          <div style={styles.rowItem}>
            <button style={GlobalStyles.button} onClick={this.handleSubmitAddProduct}>Add Product</button>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '0.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
  rowItem: {
    display: 'flex',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 500,
    whiteSpace: 'pre-wrap',
    height: '100%',
  },
};
