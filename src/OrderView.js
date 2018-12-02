import React from 'react';
import AddProductToOrder from './AddProductToOrder';
import ShippingForm from './components/ShippingForm';
import OrderChargesList from './OrderChargesList';
import OrderItem from './OrderItem';
import OrderNoteListItem from './OrderNoteListItem';
import OrderNotePrompt from './OrderNotePrompt';

export default class OrderView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectAll: false,
      selectedItems: {},
      reshipItems: [],
      editShipping: false,
      editShippingItem: {},
      errorMessage: '',
      products: [],
      uniqProductIdVariantIdPairs: [],
      change: {
        action: '',
        oldValue: '',
        newValue: '',
        productId: '',
        variantId: '',
        unitPrice: 0,
        unitTax: 0,
        quantity: '',
        refundAmount: 0,
        refundChargeId: '',
        chargePrice: 0,
        chargeTax: 0,
        chargeShipping: 0,
        chargeTotal: 0,
        newAddress: {
          firstName: '',
          lastName: '',
          line1: '',
          line2: '',
          country: '',
          city: '',
          region: '',
          postal: '',
        }
      },
      promptOrderNote: false,
      selectedOrderItemIndex: null,
      error: '',
    };

    // this.handleSelectProduct = this.handleSelectProduct.bind(this);
    // this.handleReshipItems = this.handleReshipItems.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.editItemShipping = this.editItemShipping.bind(this);
    this.showError = this.showError.bind(this);
    this.saveChange = this.saveChange.bind(this);
    this.submitChange = this.submitChange.bind(this);
    this.cancelChange = this.cancelChange.bind(this);

    this.addProductComponent;
    this.orderItems = [];
    this.orderNoteComponent;
  }

  async componentDidMount() {
    try {
      // const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      // const productsResponse = await axios.get(`/api/products`, headersObj);
      // const products = productsResponse.data.products;
      const products = [
        { product_id: 'soccer-ball', variants: ['size-4', 'size-5'] },
        { product_id: 'basket-ball', variants: ['junior-size', 'full-size'] },
      ];
      const uniqProductIdVariantIdPairs = this.props.selectedOrder.items.map(item => (`${item.product_id}-${item.variant_id}`));
      this.setState({ products, uniqProductIdVariantIdPairs });
    } catch(e) {
      this.setState({ error: 'get products failed' });
      console.log(' componentDidMount in OrderView.js error ->', e);
    }
  }

  // handleSelectProduct(e) {
  //   if (this.state.promptOrderNote) return;
  //   this.setState({ selectedItems: { ...this.state.selectedItems, [e.target.name]: e.target.checked } });
  // }

  // handleReshipItems() {
  //   if (this.state.promptOrderNote) return;
  //   let selectedProductUIDs = [];
  //   for (let product_id in this.state.selectedItems) {
  //     if (this.state.selectedItems[product_id] === true) selectedProductUIDs.push(product_id);
  //   }
  //   const selectedItems = this.props.selectedOrder.products.filter(item => selectedProductUIDs.includes(item.product_id));
  //   this.setState({ reshipItems: selectedItems });
  // }

  cancelOrder() {
    if (this.state.promptOrderNote) return;
    if (!this.props.selectedOrder.isEditable) return this.showError();
    const change = {
      action: 'Cancel Order',
    };
    this.saveChange(change);
  }

  editItemShipping(item) {
    if (this.state.promptOrderNote) return;
    this.setState({ editShipping: true, editShippingItem: item });
    this.orderNoteComponent.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

  showError(message) {
    this.setState({ errorMessage: message || 'Order is not editable right now' });
    setTimeout(() => { this.setState({ errorMessage: '' }); }, 3000);
  }

  saveChange(change, selectedOrderItemIndex) {
    this.setState({ change, promptOrderNote: true, editShipping: false, selectedOrderItemIndex });
    this.orderNoteComponent.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

  async submitChange(reason) {
    console.log(' OrderView.js submitChange - reason ->', reason);
    console.log(' this.state.change ->', this.state.change);

    const chargePrice = reason.chargePrice || 0;
    const chargeTax = reason.chargeTax || 0;
    const chargeShipping = reason.chargeShipping || 0;
    const chargeTotal = (chargePrice + chargeTax + chargeShipping);
    const refundAmount = reason.refundAmount || 0;
    const chargeOrRefund = {
      price: chargePrice,
      tax: chargeTax,
      shipping: chargeShipping,
      total: chargeTotal,
      refundAmount,
    };

    const note = {
      action: this.state.change.action,
      product_id: this.state.change.productId,
      variant_id: this.state.change.variantId,
      old_value: this.state.change.oldValue,
      new_value: this.state.change.newValue,
      quantity: this.state.change.quantity,
      unit_price: this.state.change.unitPrice,
      unit_tax: this.state.change.unitTax,
      refund_amount: refundAmount,
      charge_price: chargePrice,
      charge_tax: chargeTax,
      charge_shipping: chargeShipping,
      charge_total: chargeTotal,
      reason: reason.reason,
      note: reason.note,
      representative: this.props.representative,
      ts: reason.ts,
    }

    if (this.state.change.action === 'Add Item') {
      await this.props.addProduct(
        this.state.change.productId,
        this.state.change.variantId,
        this.state.change.quantity,
        this.state.change.unitPrice,
        this.state.change.unitTax,
        note,
        chargeOrRefund
      );
      this.addProductComponent.resetState();
    } else if (this.state.change.action === 'Update Quantity') {
      await this.props.updateQuantity(
        this.state.change.productId,
        this.state.change.variantId,
        this.state.change.quantity,
        note,
        chargeOrRefund
      );
    } else if (this.state.change.action === 'Delete Item') {
      await this.props.deleteItem(this.state.change.productId, this.state.change.variantId, note, chargeOrRefund);
    } else if (this.state.change.action === 'Update Variant') {
      await this.props.updateItemVariant(
        this.state.change.productId,
        this.state.change.oldValue,
        this.state.change.newValue,
        note,
        chargeOrRefund
      );
    } else if (this.state.change.action === 'Update Shipping') {
      await this.props.updateShippingAddress(this.state.change.newAddress, note, chargeOrRefund);
    } else if (this.state.change.action === 'Cancel Order') {
      await this.props.cancelOrder(note, chargeOrRefund);
    } else if (this.state.change.action === 'Full Refund' || this.state.change.action === 'Partial Refund') {
      await this.props.submitRefund(this.state.change.refundChargeId, refundAmount, note);
      this.orderChargesListRef.resetState();
    } else if (this.state.change.action === 'New Charge') {
      await this.props.submitCharge(chargePrice, chargeTax, chargeShipping, note);
      this.orderChargesListRef.resetState();
    }
    this.setState({ promptOrderNote: false });
  }

  cancelChange() {
    this.setState({ promptOrderNote: false, editShipping: false });
    if (this.state.selectedOrderItemIndex || this.state.selectedOrderItemIndex === 0) {
      this.orderItems[this.state.selectedOrderItemIndex].cancel();
    }
    if (this.state.change.action === 'New Charge' || this.state.change.action === 'Partial Refund') {
      console.log(' calling this.orderChargesListRef.resetState()');
      this.orderChargesListRef.resetState();
    }
  }

  render() {

    return (
      <div style={styles.componentContainer}>
        {this.state.error ?
          <div>
            <p style={{ color: 'red' }}>{this.state.error}</p>
          </div>
        : null}
        <div style={styles.lhs}>
          <h2 style={styles.title}>{`Order #${this.props.selectedOrder.order.id}`}</h2>
          <h3 style={styles.subtitle}>{`Status: ${this.props.selectedOrder.status}`}</h3>
          <p style={styles.errorMessage}>{this.state.errorMessage}</p>

          <div style={styles.tableContainer}>
            <div style={styles.titleRow}>
              {/* <input style={styles.checkbox} type='checkbox' checked={this.state.selectAll} onChange={this.handleSelectAll} /> */}
              <p style={{...styles.titleRowItem, flex: 1.5 }}>Product ID</p>
              <p style={{...styles.titleRowItem, flex: 2 }}>Variant ID</p>
              <p style={{ ...styles.titleRowItem }}>Price</p>
              <p style={{ ...styles.titleRowItem }}>Tax</p>
              <p style={{ ...styles.titleRowItem, flex: 0.5 }}>Quantity</p>
              <p style={{ ...styles.titleRowItem }}>Total</p>
              <p style={{ ...styles.titleRowItem, flex: 2 }}>Shipping Address</p>
              <p style={{ ...styles.titleRowItem, flex: 0.3 }} />
            </div>

            {this.props.selectedOrder.items.map((item, i) => (
              <OrderItem
                products={this.state.products}
                uniqProductIdVariantIdPairs={this.state.uniqProductIdVariantIdPairs}
                disableChange={this.state.promptOrderNote || !this.props.selectedOrder.isEditable}
                showError={this.showError}
                orderCurrency={this.props.selectedOrder.order.currency}
                saveChange={this.saveChange}
                editItemShipping={this.editItemShipping}
                item={item}
                orderItemIndex={i}
                key={`${item.product_id}-${item.variant_id}`}
                ref={(component) => { this.orderItems[i] = component; }}
              />
            ))}
          </div>

          <div ref={(component) => { this.orderNoteComponent = component; }} style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem', marginBottom: '2rem', width: '75%' }}>
              {this.state.promptOrderNote ?
              <OrderNotePrompt
                showComponent={this.state.promptOrderNote}
                change={this.state.change}
                representative={this.props.representative}
                submitChange={this.submitChange}
                cancelChange={this.cancelChange}
                orderCurrency={this.props.selectedOrder.order.currency}
              />
              : null}
              {this.state.editShipping ?
              <ShippingForm
                saveChange={this.saveChange}
                cancelChange={this.cancelChange}
                orderItem={this.state.editShippingItem}
                firstName={this.state.editShippingItem.ship_first_name}
                lastName={this.state.editShippingItem.ship_last_name}
                line1={this.state.editShippingItem.ship_line1}
                line2={this.state.editShippingItem.ship_line2}
                country={this.state.editShippingItem.ship_country}
                city={this.state.editShippingItem.ship_city}
                region={this.state.editShippingItem.ship_region}
                postalCode={this.state.editShippingItem.ship_postal}
              />
              : null}

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <AddProductToOrder
                  ref={(component) => { this.addProductComponent = component; }}
                  disableChange={this.state.promptOrderNote || !this.props.selectedOrder.isEditable}
                  showError={this.showError}
                  saveChange={this.saveChange}
                  products={this.state.products}
                  addr={this.props.selectedOrder.shippingAddr}
                  uniqProductIdVariantIdPairs={this.state.uniqProductIdVariantIdPairs}
                />
                <OrderChargesList
                  ref={(component) => { this.orderChargesListRef = component; }}
                  charges={this.props.selectedOrder.order.charges}
                  orderCurrency={this.props.selectedOrder.order.currency}
                  saveChange={this.saveChange}
                  disableChange={this.state.promptOrderNote}
                  showError={this.showError}
                />
              </div>

              <div style={styles.actionButtonContainer}>
                <button style={styles.addNoteButton} onClick={this.handleReshipItems}>Reship Items</button>
                <button style={styles.addNoteButton} onClick={this.cancelOrder}>{this.props.selectedOrder.isEditable ? 'Cancel Order' : 'Request Order Cancellation' }</button>
              </div>
            </div>

            <div style={styles.orderNotesContainer}>
              <h3 style={styles.orderNoteTitle}>Order Notes</h3>
              {this.props.selectedOrder.notes ? this.props.selectedOrder.notes.map((note, i) => <OrderNoteListItem note={note} key={i} orderCurrency={this.props.selectedOrder.order.currency} /> ) : null}
            </div>
          </div>
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
    padding: '1rem',
    marginTop: '5rem'
  },
  lhs: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    width: '95%',
    border: '1px solid black',
  },
  title: {
    marginBottom: '0.5rem',
    fontSize: '28px'
  },
  subtitle: {
    fontSize: '20px',
    fontWeight: 500,
    marginBottom: '2rem',
    marginLeft: '0.5rem',
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '0.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%'
  },
  titleRowItem: {
    display: 'flex',
    flex: 1,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '18px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNoteButton: {
    display: 'flex',
    fontFamily: 'Rubik',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '0.5rem 1.2rem',
    textAlign: 'center',
    borderRadius: '100px',
    backgroundColor: '#5666CC',
    color: 'white',
  },
  orderNotesContainer: {
    padding: '1rem',
    width: '25%',
  },
  orderNoteTitle: {

  },
  checkbox: {

  },
  actionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '2rem',
    marginBottom: '1rem',
    width: '100%',
    justifyContent: 'space-around'
  },
  errorMessage: {
    position: 'absolute',
    left: '35%',
    top: '2.8rem',
    color: 'red'
  }
};
