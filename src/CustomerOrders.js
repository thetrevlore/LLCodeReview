import React from 'react';
import OrderView from './OrderView';

export default class CustomerOrders extends React.Component {
  constructor(props) {
    super(props);
    this.selectOrder = this.selectOrder.bind(this);
  }

  selectOrder(selectedOrder) {
    this.props.selectOrder(selectedOrder);
  }

  render() {
    return (
      <div style={styles.componentContainer}>
        <h2 style={styles.title}>Orders</h2>
        <div style={styles.tableContainer}>
          <div style={styles.titleRow}>
            <p style={styles.titleRowItem}>Order #</p>
            <p style={styles.titleRowItem}>DU Status</p>
            <p style={styles.titleRowItem}>Checkout Date</p>
            <p style={styles.titleRowItem}>Ship Date</p>
            <p style={styles.titleRowItem}>Courier Status</p>
            <p style={styles.titleRowItem}>Tracking #</p>
            <p style={{...styles.titleRowItem, flex: 0.5 }}>Shipping</p>
            <p style={{...styles.titleRowItem, flex: 0.5 }}>Total</p>
          </div>
          {this.props.orders.map((order, i) => (
            <div style={{...styles.orderRow, backgroundColor: i % 2 === 0 ? '#F1F1FF' : '#FFFFFF'}} key={order.order.id}>
              <p onClick={this.selectOrder.bind(this, order)} style={{...styles.orderRowItem, cursor: 'pointer'}}>{order.order.id}</p>
              <p style={styles.orderRowItem}>{order.status}</p>
              <p style={styles.orderRowItem}>{order.order.checkout_date ? (new Date(order.order.checkout_date)).toUTCString() : null}</p>
              <p style={styles.orderRowItem}>{order.order.ship_date ? (new Date(order.fulfillment.ship_date)).toUTCString() : null}</p>
              <p style={styles.orderRowItem}>{order.fulfillment.last_tracking_event ? order.fulfillment.last_tracking_event.status : 'Unfulfilled'}</p>
              <a style={styles.orderRowItem} target='_blank' href={`http://www.google.com/search?q=${order.fulfillment.tracking_number}`}>{order.fulfillment.tracking_number}</a>
              <p style={{...styles.orderRowItem, flex: 0.5 }}>{`${order.order.charges.reduce((accum, curr) => { return accum + curr.shipping }, 0).toFixed(2)} ${order.order.currency}`}</p>
              <p style={{...styles.orderRowItem, flex: 0.5 }}>{`${order.order.charges.reduce((accum, curr) => { return accum + curr.price + curr.shipping + curr.tax }, 0).toFixed(2)} ${order.order.currency}`}</p>
            </div>
          ))}
        </div>
        {this.props.selectedOrder ?
          <OrderView
            updateShippingAddress={this.props.updateShippingAddress}
            deleteItem={this.props.deleteItem}
            addProduct={this.props.addProduct}
            updateQuantity={this.props.updateQuantity}
            updateItemVariant={this.props.updateItemVariant}
            submitOrderChanges={this.props.submitOrderChanges}
            selectedOrder={this.props.selectedOrder}
            addOrderNote={this.props.addOrderNote}
            representative={this.props.representative}
            cancelOrder={this.props.cancelOrder}
            submitRefund={this.props.submitRefund}
            submitCharge={this.props.submitCharge}
          /> : null}
      </div>
    );
  }
}

const styles = {
  componentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '1rem',
    marginTop: '3rem',
  },
  title: {
    marginBottom: '2rem',
    fontSize: '28px'
  },
  tableContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '0.5rem',
  },
  titleRowItem: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '18px'
  },
  orderRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'row',
    marginBottom: '0.5rem',
  },
  orderRowItem: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 500
  }
};
