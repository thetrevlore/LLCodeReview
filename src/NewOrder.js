import React, { Component } from 'react';
import axios from 'axios';
import ShippingForm from './components/ShippingForm';
import OrderItem from './OrderItem';
import AddProductToOrder from './AddProductToOrder';
import GlobalStyles from './styles';
import OrderNotePrompt from './OrderNotePrompt';


export default class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProducts: [],
      orderItems: [],
      customerEmail: '',
      shippingAddress: {
        firstName: '',
        lastName: '',
        line1: '',
        line2: '',
        country: '',
        city: '',
        region: '',
        postalCode: '',
      },
      uniqProductIdVariantIdPairs: [],
      emailError: '',
      error: '',
      shippingConfirm: '',
      newOrderConfirm: '',
    };

    this.getProducts = this.getProducts.bind(this);
    this.addToOrder = this.addToOrder.bind(this);
    this.saveShippingAddress = this.saveShippingAddress.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleCustomerEmail = this.handleCustomerEmail.bind(this);
    this.submitNote = this.submitNote.bind(this);
    this.setItemVariant = this.setItemVariant.bind(this);
    this.setItemQuantity = this.setItemQuantity.bind(this);
    this.getCustomer = this.getCustomer.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.findOrCreateCustomerByEmail = this.findOrCreateCustomerByEmail.bind(this);
    this.removeError = this.removeError.bind(this);
  }

  async componentWillMount() {
    await this.getProducts();
  }

  componentDidMount() {
    if (!this.props.representative) {
      const firstName = window.localStorage.getItem('representative');
      this.props.setRep(firstName);
    }
  }

  async getProducts() {
    try {
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      const productsResponse = await axios.get(`/api/products`, headersObj);
      const allProducts = productsResponse.data.products;
      this.setState({ allProducts });
    } catch(e) {
      this.setState({ error: 'get products failed' });
      console.log(' getProducts error ->', e);
    }
  }

  addToOrder(change) {
    if (!this.state.shippingAddress.firstName || !this.state.shippingAddress.lastName || !this.state.shippingAddress.line1 || !this.state.shippingAddress.country || !this.state.shippingAddress.city || !this.state.shippingAddress.region || !this.state.shippingAddress.postalCode) {
      return this.setState({ error: 'you need to set a shipping address before adding any products' });
    }
    const productToAdd = {
      product_id: change.productId,
      variant_id: change.variantId,
      unit_price: 0,
      unit_tax: 0,
      quantity: Number(change.quantity),
      ship_first_name: this.state.shippingAddress.firstName,
      ship_last_name: this.state.shippingAddress.lastName,
      ship_line1: this.state.shippingAddress.line1,
      ship_line2: this.state.shippingAddress.line2,
      ship_country: this.state.shippingAddress.country,
      ship_city: this.state.shippingAddress.city,
      ship_region: this.state.shippingAddress.region,
      ship_postal: this.state.shippingAddress.postalCode,
      price_id: null,
      charge_id: null,
    }
    console.log(' productToAdd', productToAdd)
    const orderItems = [...this.state.orderItems, productToAdd];
    const uniqProductIdVariantIdPairs = orderItems.map(item => (`${item.product_id}-${item.variant_id}`));
    this.setState({ orderItems, uniqProductIdVariantIdPairs });
  }

  saveShippingAddress(change) {
    if (this.state.orderItems.length) {
      let orderItems = [...this.state.orderItems];
      orderItems.forEach(item => {
        item.ship_first_name = change.newAddress.firstName;
        item.ship_last_name = change.newAddress.lastName;
        item.ship_line1 = change.newAddress.line1;
        item.ship_line2 = change.newAddress.line2;
        item.ship_country = change.newAddress.country;
        item.ship_city = change.newAddress.city;
        item.ship_region = change.newAddress.region;
        item.ship_postal = change.newAddress.postalCode;
      });
      this.setState({
        orderItems,
        shippingAddress: {
          firstName: change.newAddress.firstName,
          lastName: change.newAddress.lastName,
          line1: change.newAddress.line1,
          line2: change.newAddress.line2,
          country: change.newAddress.country,
          city: change.newAddress.city,
          region: change.newAddress.region,
          postalCode: change.newAddress.postalCode,
        },
        shippingConfirm: 'Shipping Saved',
      });
    } else {
      this.setState({
        shippingAddress: {
          firstName: change.newAddress.firstName,
          lastName: change.newAddress.lastName,
          line1: change.newAddress.line1,
          line2: change.newAddress.line2,
          country: change.newAddress.country,
          city: change.newAddress.city,
          region: change.newAddress.region,
          postalCode: change.newAddress.postalCode,
        },
        shippingConfirm: 'Shipping Saved',
      });
    }
    setTimeout(() => { this.setState({ shippingConfirm: '' }); }, 4000);
  }

  handleCustomerEmail(e) {
    const email = e.target.value;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmailValid = re.test(String(email).toLowerCase());
    if (isEmailValid) {
      this.setState({ customerEmail: email, emailError: '' });
    } else {
      this.setState({ customerEmail: email, emailError: 'invalid email' });
    }
  }

  removeItem(orderItemIndex) {
    let orderItems = [...this.state.orderItems];
    orderItems.splice(orderItemIndex, 1);
    const uniqProductIdVariantIdPairs = orderItems.map(item => (`${item.product_id}-${item.variant_id}`));
    this.setState({ orderItems, uniqProductIdVariantIdPairs });
  }

  setItemVariant(orderItemIndex, productId, newVariantId, quantity) {
    const replacementProduct = {
      product_id: productId,
      variant_id: newVariantId,
      unit_price: 0,
      unit_tax: 0,
      quantity: quantity,
      ship_first_name: this.state.shippingAddress.firstName,
      ship_last_name: this.state.shippingAddress.lastName,
      ship_line1: this.state.shippingAddress.line1,
      ship_line2: this.state.shippingAddress.line2,
      ship_country: this.state.shippingAddress.country,
      ship_city: this.state.shippingAddress.city,
      ship_region: this.state.shippingAddress.region,
      ship_postal: this.state.shippingAddress.postalCode,
    };
    let orderItems = [...this.state.orderItems];
    orderItems.splice(orderItemIndex, 1, replacementProduct);
    const uniqProductIdVariantIdPairs = orderItems.map(item => (`${item.product_id}-${item.variant_id}`));
    this.setState({ orderItems, uniqProductIdVariantIdPairs });
  }

  setItemQuantity(productId, variantId, quantity) {
    let orderItems = [...this.state.orderItems];
    for (let i = 0; i < orderItems.length; i++) {
      if (orderItems[i].product_id === productId && orderItems[i].variant_id === variantId) {
        orderItems[i].quantity = Number(quantity);
        break;
      }
    }
    this.setState({ orderItems });
  }

  async submitNote(note) {
    try {
      const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
      await axios.post(`/api/orders/${this.state.selectedOrder.order.id}/notes`, note, headersObj);
    } catch(e) {
      this.setState({ error: 'submitNote failed' });
      console.log(' submitNote error ->', e);
    }
  }

  async getCustomer() {
    const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
    const customerResponse = await axios.get(`/api/customer?email=${this.state.customerEmail}`, headersObj);
    const customer = customerResponse.data;
    return customer;
  }

  async findOrCreateCustomerByEmail(email) {
    try {
      var customer = await this.getCustomer();
      var customerId = customer.id;
    } catch(e) {
      try {
        const resp = await axios.post(`/api/new_customer`, { email });
        if (resp.status == 200) {
          customer = await this.getCustomer();
          customerId = customer.id;
        }
      } catch(e) {
        console.log(' findOrCreateCustomerByEmail Error ->', e);
      }
    }
    return customerId;
  }

  removeError() {
    this.setState({ error: '' });
  }

  async submitOrder(reason) {
    console.log(' reason ->', reason);
    console.log(' this.state ->', this.state);
    if (this.state.customerEmail === '') {
      this.setState({ newOrderConfirm: 'need an email!' });
      setTimeout(() => { this.setState({ newOrderConfirm: '' }); }, 4000);
      return;
    }
    if (this.state.emailError || this.state.orderItems.length < 1) return;

    const customerId = await this.findOrCreateCustomerByEmail(this.state.customerEmail);
    if (customerId) {
      const note = {
        action: 'New Order',
        order_reference_id: reason.orderReferenceId,
        charge_price: 0,
        charge_tax: 0,
        reason: reason.reason,
        note: reason.note,
        ts: reason.ts,
        representative: this.props.representative,
      }

      const orderPayload = {
        customer_id: customerId,
        items: this.state.orderItems,
        notes: [note],
      }

      try {
        const headersObj = { headers: { Authorization: `internal ${window.localStorage.getItem('session_token')}` } };
        const postNewOrderResponse = await axios.post(`/api/orders/`, orderPayload, headersObj);
        if (postNewOrderResponse.data.status === 'OK') {
          this.setState({ newOrderConfirm: 'Order Placed' });
        } else {
          this.setState({ newOrderConfirm: 'Something went wrong...check console' });
          console.log(' postNewOrderResponse ->', postNewOrderResponse);
        }
        setTimeout(() => { this.setState({ newOrderConfirm: '' }); }, 4000);
      } catch(e) {
        console.log(' submitOrder - post req - Error ->', e);
      }
    } else {
      console.log(' submitOrder error. No customerId.');
    }

    // console.log(' resp', resp);
    // find or create customer
    // submit order
    // TODO: some kind of confirmation that all actions worked
  }

  // saveChange(change, selectedOrderItemIndex) {
  //   this.setState({ change, promptOrderNote: true, editShipping: false, selectedOrderItemIndex });
  //   this.orderNoteComponent.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  // }

	render() {
		return (
      <div style={styles.componentContainer}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '1rem' }}>
          <h3>Customer Email</h3>
          <input
            type='text'
            value={this.state.customerEmail}
            placeholder='Customer Email'
            onChange={this.handleCustomerEmail}
            style={{...GlobalStyles.input, marginLeft: '2rem' }}
          />
          {this.state.emailError ? <div style={{ color: 'red' }}>{this.state.emailError}</div> : null}
        </div>
        <ShippingForm
          saveChange={this.saveShippingAddress}
          firstName={this.state.shippingAddress.firstName}
          lastName={this.state.shippingAddress.lastName}
          line1={this.state.shippingAddress.line1}
          line2={this.state.shippingAddress.line2}
          country={this.state.shippingAddress.country}
          city={this.state.shippingAddress.city}
          region={this.state.shippingAddress.region}
          postalCode={this.state.shippingAddress.postalCode}
          removeError={this.removeError}
        />

        {this.state.error ?
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <p style={{ color: 'red', fontSize: '1.5rem' }}>{this.state.error}</p>
          </div>
        : null}
        {this.state.shippingConfirm ?
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <p style={{ color: 'green', fontSize: '1.5rem' }}>{this.state.shippingConfirm}</p>
          </div>
        : null}

        <AddProductToOrder
          newOrder
          saveChange={this.addToOrder}
          products={this.state.allProducts}
          addr={this.state.shippingAddress}
          uniqProductIdVariantIdPairs={this.state.uniqProductIdVariantIdPairs}
        />

        <div style={styles.tableContainer}>
          <h3 style={{ display: 'flex', alignSelf: 'center', marginBottom: '1rem' }}>Order Items</h3>
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
          {this.state.orderItems.map((item, i) => (
            <OrderItem
              products={this.state.allProducts}
              newOrder
              setItemVariant={this.setItemVariant}
              setItemQuantity={this.setItemQuantity}
              removeItem={this.removeItem}
              uniqProductIdVariantIdPairs={this.state.uniqProductIdVariantIdPairs}
              orderCurrency={'usd'}
              saveChange={this.saveChange}
              item={item}
              orderItemIndex={i}
              key={`${item.product_id}-${item.variant_id}`}
            />
          ))}
        </div>

        {this.state.newOrderConfirm ?
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <p style={{ color: this.state.newOrderConfirm === 'Order Placed' ? 'green' : 'red', fontSize: '1.5rem' }}>{this.state.newOrderConfirm}</p>
          </div>
        : null}

        <OrderNotePrompt
          showComponent={true}
          change={{ action: 'New Order' }}
          representative={this.props.representative}
          submitChange={this.submitOrder}
          orderCurrency={'usd'}
        />
      </div>
    );
	}
}

const styles = {
  componentContainer: {
    width: '100%'
  },
  productList: {
    listStyle: 'none',
    width: '80%',
  },
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
    width: '50%',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
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
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid black',
    minHeight: '10rem',
    marginBottom: '2rem',
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
};
