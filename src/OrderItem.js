import React from 'react';
import GlobalStyles from './styles';

export default class OrderItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      quantity: this.props.item.quantity,
      selectedVariantId: this.props.item.variant_id,
      variants: [],
    };

    this.handleSelectProduct = this.handleSelectProduct.bind(this);
    this.submitUpdateQuantity = this.submitUpdateQuantity.bind(this);
    this.handleQuantity = this.handleQuantity.bind(this);
    this.editShipping = this.editShipping.bind(this);
    this.setSelectedVariant = this.setSelectedVariant.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.submitUpdateVariant = this.submitUpdateVariant.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  handleSelectProduct(e) {
    if (this.props.disableChange) return;
    this.setState({ selectedProducts: { ...this.state.selectedProducts, [e.target.name]: e.target.checked } });
  }

  handleQuantity(e) {
    if (this.props.disableChange) return this.props.showError();
    const quantity = e.target.value;
    if (this.props.setItemQuantity) this.props.setItemQuantity(this.props.item.product_id, this.state.selectedVariantId, quantity);
    this.setState({ quantity });
  }

  submitUpdateQuantity() {
    if (this.props.disableChange) return this.props.showError();
    const oldQuantity = this.props.item.quantity;
    const newQuantity = this.state.quantity;
    let chargePrice, chargeTax, chargeTotal, refundAmount;
    if (oldQuantity < newQuantity) {
      chargePrice = this.props.item.unit_price;
      chargeTax = this.props.item.unit_tax;
      chargeTotal = (chargePrice + chargeTax) * (newQuantity - oldQuantity);
      refundAmount = 0;
    } else {
      chargePrice = 0;
      chargeTax = 0;
      chargeTotal = 0;
      refundAmount = (this.props.item.unit_price + this.props.item.unit_tax) * (oldQuantity - newQuantity);
    }

    const change = {
      action: 'Update Quantity',
      productId: this.props.item.product_id,
      variantId: this.state.selectedVariantId,
      oldValue: this.props.item.quantity,
      newValue: this.state.quantity,
      quantity: this.state.quantity,
      unitPrice: this.props.item.unit_price,
      unitTax: this.props.item.unit_tax,
      chargePrice,
      chargeTax,
      chargeTotal,
      refundAmount
    };
    this.props.saveChange(change, this.props.orderItemIndex);
  }

  editShipping() {
    if (this.props.disableChange) return this.props.showError();
    if (this.props.newOrder) return;

    this.props.editItemShipping(this.props.item);
  }

  setSelectedVariant(e) {
    if (this.props.disableChange) return this.props.showError();
    const selectedVariantId = e.target.value;
    if (this.props.newOrder) this.props.setItemVariant(this.props.orderItemIndex, this.props.item.product_id, selectedVariantId, this.state.quantity)

    this.setState({ selectedVariantId });
  }

  deleteItem() {
    if (this.props.disableChange) return this.props.showError();
    if (this.props.removeItem) return this.props.removeItem(this.props.orderItemIndex);
    const change = {
      action: 'Delete Item',
      productId: this.props.item.product_id,
      variantId: this.props.item.variant_id,
      oldValue: this.props.item.quantity,
      newValue: 0,
      quantity: 0,
      unitPrice: this.props.item.unit_price,
      unitTax: this.props.item.unit_tax,
      refundAmount: (this.props.item.unit_price * this.props.item.quantity) + (this.props.item.unit_tax * this.props.item.quantity)
    };
    this.props.saveChange(change, this.props.orderItemIndex);
  }

  submitUpdateVariant() {
    if (this.props.disableChange) return this.props.showError();

    const change = {
      action: 'Update Variant',
      productId: this.props.item.product_id,
      variantId: this.state.selectedVariantId,
      oldValue: this.props.item.variant_id,
      newValue: this.state.selectedVariantId,
      unitPrice: this.props.item.unit_price,
      unitTax: this.props.item.unit_tax,
    };
    this.props.saveChange(change, this.props.orderItemIndex);
  }

  cancel() {
    this.setState({
      quantity: this.props.item.quantity,
      selectedVariantId: this.props.item.variant_id,
    })
  }

  render() {
    const { item, orderItemIndex, orderCurrency, products, uniqProductIdVariantIdPairs } = this.props;
    const product = products.find(product => product.product_id === item.product_id);
    const variants = product ? product.variants : [];
    let possibleVariants = uniqProductIdVariantIdPairs ? variants.filter(variant => !uniqProductIdVariantIdPairs.includes(`${item.product_id}-${variant}`) || variant === item.variant_id) : variants;

    return (
      <div style={styles.componentContainer}>
        <div style={{...styles.orderRow, backgroundColor: orderItemIndex % 2 === 0 ? '#F1F1FF' : '#FFFFFF'}}>
          {/* <input style={styles.checkbox} item={item} name={item.product_id} type='checkbox' checked={this.state.selected} onChange={this.handleSelectProduct} /> */}
          <p style={{...styles.orderRowItem, flex: 1.5 }}>{item.product_id}</p>
          <p style={{ ...styles.orderRowItem, flex: 2, flexDirection: 'column', justifyContent: 'space-around' }}>
            <select value={this.state.selectedVariantId} onChange={this.setSelectedVariant}>
              {possibleVariants.map(variant => (
                <option key={variant} value={variant}>{variant}</option>
              ))}
            </select>
            {!this.props.newOrder ? <button style={{...GlobalStyles.button, padding: '0.2rem 0.8rem' }} onClick={this.submitUpdateVariant}>Submit</button> : null}
          </p>
          <p style={styles.orderRowItem}>{item.unit_price.toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: orderCurrency})}</p>
          <p style={styles.orderRowItem}>{item.unit_tax.toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: orderCurrency})}</p>
          <p style={{ ...styles.orderRowItem, flexDirection: 'column', justifyContent: 'space-around', flex: 0.5 }}>
            <input type="text" value={this.state.quantity} onChange={this.handleQuantity} style={{ color: 'black', borderColor: 'black', textAlign: 'center', padding: '0.3rem 0', width: '80%' }} />
            {!this.props.newOrder ? <button style={{...GlobalStyles.button, padding: '0.2rem 0.8rem' }} onClick={this.submitUpdateQuantity}>Submit</button> : null}
          </p>
          <p style={styles.orderRowItem}>{((item.unit_price * item.quantity) + (item.unit_tax * item.quantity)).toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: orderCurrency})}</p>
          <p style={{...styles.orderRowItem, flex: 2, cursor: this.props.newOrder ? 'auto' : 'pointer' }} onClick={this.editShipping}>{`${item.ship_first_name} ${item.ship_last_name}\n${item.ship_line1} ${item.ship_line2 ? item.ship_line2 : ''}\n${item.ship_city} ${item.ship_region}\n${item.ship_postal} ${item.ship_country}`}</p>
          <p style={{ ...styles.orderRowItem, flex: 0.3 }}><button style={styles.deleteButton} onClick={this.deleteItem}>X</button></p>
        </div>
      </div>
    );
  }
}

const styles = {
  componentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  orderRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '0.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    listStyle: 'none',
    width: '100%',
  },
  orderRowItem: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 500,
    whiteSpace: 'pre-wrap',
    height: '100%',
  },
  deleteButton: {
    display: 'flex',
    fontFamily: 'Rubik',
    fontSize: '1rem',
    fontWeight: 500,
    height: '2rem',
    width: '2rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '100px',
    backgroundColor: 'red',
    color: 'white',
  },
};
