import axios from 'axios';
import React, { Component } from 'react';
import CustomerInfo from './CustomerInfo';
import CustomerOrders from './CustomerOrders';
import GlobalStyles from './styles';

const TEST_ORDER_ID = 'f66f96c7-7b42-416c-8003-41fcb99dd1a1';
const orders = [
  {
    status: 'shipped',
    order: {
      id: TEST_ORDER_ID,
      currency: 'USD',
      checkout_date: (new Date()).toISOString(),
      ship_date: (new Date()).toISOString(),
      charges: [
        {
          id: 1,
          price: 1.01,
          tax: 0.07,
          shipping: 2.05,
          refunds: [
            {
              amount: 0.05,
            }
          ],
        }
      ],
    },
    fulfillment: { id: 1 },
    items: [
      {
        product_id: 'soccer-ball',
        variant_id: 'size-4',
        unit_price: 1.01,
        unit_tax: 0.07,
        quantity: 1,
        ship_first_name: 'trevor',
        ship_last_name: 'storey',
        ship_line1: '866 Myrtle Ave',
        ship_line2: '#3',
        ship_country: 'US',
        ship_city: 'Brooklyn',
        ship_region: 'New York',
        ship_postal: '11206',
      }
    ],
    notes: [
      {
        ts: (new Date()).toISOString(),
        representative: 'trevor',
        text: 'test order note',
        reason: 'Customer Request',
        action: 'Update Quantity',
        unit_price: 0,
        unit_tax: 0,
        charge_price: 0,
        charge_tax: 0,
        charge_shipping: 0,
        charge_total: 0,
        refund_amount: 1,
      }
    ],
  },
];
const customer = {
  id: 1,
  email: 'trevorstorey23@gmail.com',
};

export default class EditOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailSearch: '',
      customer: {},
      orders: [],
      selectedOrder: {},
    };

    this.handleEmailSearchInput = this.handleEmailSearchInput.bind(this);
    this.getCustomerAccount = this.getCustomerAccount.bind(this);
    this.selectOrder = this.selectOrder.bind(this);
    this.updateShippingAddress = this.updateShippingAddress.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.getCustomerOrders = this.getCustomerOrders.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.updateItemVariant = this.updateItemVariant.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
    this.submitRefund = this.submitRefund.bind(this);
    this.submitCharge = this.submitCharge.bind(this);
    this.submitNote = this.submitNote.bind(this);
    this.shouldChargeOrRefund = this.shouldChargeOrRefund.bind(this);
  }

  handleEmailSearchInput(e) {
    this.setState({ emailSearch: e.target.value, error: '' });
  }

  async submitNote(note, chargeOrRefund) {
    try {
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      await axios.post(`/api/order/${this.state.selectedOrder.order.id}/notes`, note, headersObj);
      if (chargeOrRefund) await this.shouldChargeOrRefund(chargeOrRefund.price, chargeOrRefund.tax, chargeOrRefund.shipping, chargeOrRefund.total, chargeOrRefund.refundAmount);
      await this.getCustomerOrders(this.state.customer.id);
    } catch(e) {
      this.setState({ error: 'submitNote failed' });
      console.log(' submitNote error ->', e);
    }
  }

  async shouldChargeOrRefund(chargePrice, chargeTax, chargeShipping, chargeTotal, refundAmount) {
    if (refundAmount > 0) {
      let chargeId;
      for (let i = 0; i < this.state.selectedOrder.order.charges.length; i++) {
        if (this.state.selectedOrder.order.charges[i].refundableAmount >= refundAmount) {
          chargeId = this.state.selectedOrder.order.charges[i].id;
          break;
        }
      }

      if (chargeId) {
        await this.submitRefund(chargeId, refundAmount);
      } else {
        this.setState({ error: 'no single charge found that can cover that refund amount' })
      }
    }

    if (chargeTotal > 0) {
      await this.submitCharge(chargePrice, chargeTax, chargeShipping);
    }
  }

  async getCustomerAccount(e) {
    if (e) e.preventDefault();
    try {
      // const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      // const customerResponse = await axios.get(`api/customer?email=${this.state.emailSearch}`, headersObj);
      // const customer = customerResponse.data;

      await this.getCustomerOrders(customer.id);
      if (!this.props.representative) {
        const firstName = window.localStorage.getItem('representative');
        this.props.setRep(firstName);
      }
      this.setState({ customer });
    } catch(e) {
      this.setState({ error: 'noooooope. typo?' });
      console.log(' getCustomerAccount error ->', e);
    }
  }

  async getCustomerOrders(customerId) {
    try {
      // const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      // const ordersResponse = await axios.get(`/api/customer_order/${customerId}`, headersObj);
      // const orders = ordersResponse.data;

      for (let i = 0; i < orders.length; i++) {
        orders[i].isEditable = !orders[i].fulfillment.id || orders[i].order.id === TEST_ORDER_ID;
        // orders[i].isEditable = !orders[i].fulfillment.id;
        orders[i].refundAmount = '';
        orders[i].chargeAmount = '';
        orders[i].shippingAddr = {
          ship_first_name: orders[i].items[0].ship_first_name,
          ship_last_name: orders[i].items[0].ship_last_name,
          ship_line1: orders[i].items[0].ship_line1,
          ship_line2: orders[i].items[0].ship_line2,
          ship_country: orders[i].items[0].ship_country,
          ship_city: orders[i].items[0].ship_city,
          ship_region: orders[i].items[0].ship_region,
          ship_postal: orders[i].items[0].ship_postal,
        }
        orders[i].order.charges.forEach(charge => {
          const totalChargeAmount = (charge.price + charge.tax + charge.shipping);
          const alreadyRefundedAmount = charge.refunds ? charge.refunds.reduce((accum, refund) => (accum + refund.amount), 0) / 100 : 0;
          const refundableAmount = Number((totalChargeAmount - alreadyRefundedAmount).toFixed(2));
          charge.refundableAmount = refundableAmount;
        });

        if (orders[i].notes) orders[i].notes.sort((currNote, nextNote) => new Date(nextNote.ts).getTime() - new Date(currNote.ts).getTime());
        if (orders[i].order.charges) orders[i].order.charges.reverse(); // sorts them so the most recent charge is the first one listed in OrderChargesList. Doing it this way because charges don't have timestamps. It just so happens that whenever a charge is added, it seems to be placed at the end of the array.
      }
      this.setState({ orders, selectedOrder: orders[0] });
    } catch(e) {
      this.setState({ error: 'found the email. no orders though' });
      console.log(' getCustomerOrders error ->', e);
    }

  }

  selectOrder(selectedOrder) {
    this.setState({ selectedOrder });
  }

  async submitCharge(chargePrice, chargeTax, chargeShipping, note) {
    try {
      const chargePayload = {
        customer_id: this.state.customer.id,
        price: chargePrice,
        tax: chargeTax,
        shipping: chargeShipping,
        currency: this.state.selectedOrder.order.currency,
      };
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      await axios.post(`/api/charge/${this.state.selectedOrder.order.id}`, chargePayload, headersObj);
      if (note) await this.submitNote(note);
    } catch(e) {
      this.setState({ error: 'submitCharge to du_internal db failed' });
      console.log(' submitCharge error ->', e);
    }
  }

  async submitRefund(chargeId, refundAmount, note) {
    try {
      const refundPayload = {
        amount: refundAmount,
        charge_id: chargeId
      };
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      await axios.post(`/api/refund/${this.state.selectedOrder.order.id}`, refundPayload, headersObj);
      if (note) await this.submitNote(note);
    } catch(e) {
      this.setState({ error: 'submitRefund to du_internal db failed' });
      console.log(' submitRefund error ->', e);
    }
  }

  async cancelOrder(note, chargeOrRefund) {
    try {
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      await axios.put(`/api/cancel/${this.state.selectedOrder.order.id}`, {}, headersObj);
      await this.submitNote(note, chargeOrRefund);
    } catch(e) {
      this.setState({ error: 'cancelOrder failed '});
      console.log('cancelOrder error ->', e)
    }
  }

  async updateShippingAddress(address, note, chargeOrRefund) {
    try {
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      await axios.put(`/api/shipping/${this.state.selectedOrder.order.id}`, {
        ship_city: address.city,
        ship_country: address.country,
        ship_first_name: address.firstName,
        ship_last_name: address.lastName,
        ship_line1: address.line1,
        ship_line2: address.line2,
        ship_postal: address.postalCode,
        ship_region: address.region,
      }, headersObj);
      await this.submitNote(note, chargeOrRefund);
    } catch(e) {
      this.setState({ error: 'updateShippingAddress failed' });
      console.log(' updateShippingAddress error ->', e);
    }
  }

  async updateQuantity(productId, variantId, quantity, note, chargeOrRefund) {
    try {
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      await axios.put(`/api/cart/${this.state.selectedOrder.order.id}`, {
        product_id: productId,
        variant_id: variantId,
        qty: Number(quantity)
      }, headersObj);
      await this.submitNote(note, chargeOrRefund);
    } catch(e) {
      this.setState({ error: 'updateQuantity failed'});
      console.log(' updateQuantity error ->', e);
    }
  }

  async deleteItem(productId, variantId, note, chargeOrRefund) {
    try {
      await axios.delete(`/api/cart/${this.state.selectedOrder.order.id}`, { data: { product_id: productId, variant_id: variantId }, headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } });
      await this.submitNote(note, chargeOrRefund);
    } catch(e) {
      this.setState({ error: 'deleteItem failed' });
      console.log(' deleteItem error ->', e);
    }
  }

  async addProduct(productId, variantId, quantity, unitPrice, unitTax, note, chargeOrRefund) {
    try {
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      await axios.post(
        `/api/orders/${this.state.selectedOrder.order.id}/products`,
        {
          product_id: productId,
          variant_id: variantId,
          unit_price: Number(unitPrice),
          unit_tax: Number(unitTax),
          quantity: Number(quantity),
          ship_first_name: this.state.selectedOrder.shippingAddr.ship_first_name,
          ship_last_name: this.state.selectedOrder.shippingAddr.ship_last_name,
          ship_line1: this.state.selectedOrder.shippingAddr.ship_line1,
          ship_line2: this.state.selectedOrder.shippingAddr.ship_line2,
          ship_country: this.state.selectedOrder.shippingAddr.ship_country,
          ship_city: this.state.selectedOrder.shippingAddr.ship_city,
          ship_region: this.state.selectedOrder.shippingAddr.ship_region,
          ship_postal: this.state.selectedOrder.shippingAddr.ship_postal,
        }, headersObj);
        await this.submitNote(note, chargeOrRefund);
      } catch(e) {
        this.setState({ error: 'addProduct failed' });
        console.log(' addProduct error ->', e);
      }
  }

  async updateItemVariant(productId, oldVariantId, newVariantId, note, chargeOrRefund) {
    try {
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      await axios.put(`/api/orders/${this.state.selectedOrder.order.id}/products`, {
        product_id: productId,
        old_variant_id: oldVariantId,
        new_variant_id: newVariantId
      }, headersObj);
      await this.submitNote(note, chargeOrRefund);
    } catch(e) {
      this.setState({ error: 'updateItemVariant failed' });
      console.log(' updateItemVariant error ->', e);
    }
  }

	render() {
		return (
      <div style={styles.componentContainer}>
        <form style={styles.searchContainer} onSubmit={this.getCustomerAccount}>
          <input
            type='text'
            value={this.state.emailSearch}
            placeholder='Customer Email'
            onChange={this.handleEmailSearchInput}
            style={{...GlobalStyles.input, marginRight: '2rem' }}
          />

          <button type='submit' style={styles.lookupButton}>Find Customer Orders</button>
        </form>

        {this.state.error ?
          <div>
            <p style={{ color: 'red' }}>{this.state.error}</p>
          </div>
        : null}

        {this.state.orders.length ?
          <div style={styles.orderListContainer}>
            <CustomerInfo
              customerEmail={this.state.customer.email}
              customerAccountNotes={this.state.customer.accountNotes}
              representative={this.props.representative}
            />

            <CustomerOrders
              updateShippingAddress={this.updateShippingAddress}
              deleteItem={this.deleteItem}
              addProduct={this.addProduct}
              updateQuantity={this.updateQuantity}
              updateItemVariant={this.updateItemVariant}
              orders={this.state.orders}
              submitOrderChanges={this.submitOrderChanges}
              cancelOrder={this.cancelOrder}
              selectedOrder={this.state.selectedOrder}
              selectOrder={this.selectOrder}
              addOrderNote={this.addOrderNote}
              representative={this.props.representative}
              submitRefund={this.submitRefund}
              submitCharge={this.submitCharge}
              submitNote={this.submitNote}
            />
          </div>
        : null}
      </div>
    );
	}
}

const styles = {
  componentContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  input: {
    // width: '20rem',
    marginRight: '1rem',
  },
  lookupButton: {
    fontFamily: 'Rubik',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '0.5rem 1.2rem',
    borderRadius: '100px',
    backgroundColor: '#5666CC',
    color: 'white',
  },
  orderListContainer: {
    width: '100%',
  }
};
