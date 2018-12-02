import React from 'react';
import OrderChargesListItem from './OrderChargesListItem';
import GlobalStyles from './styles';

class OrderChargesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      price: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      selectedListItemIndex: null,
    };

    this.handlePrice = this.handlePrice.bind(this);
    this.handleTax = this.handleTax.bind(this);
    this.handleShipping = this.handleShipping.bind(this);
    this.submitCharge = this.submitCharge.bind(this);
    this.resetState = this.resetState.bind(this);
    this.saveChange = this.saveChange.bind(this);

    this.charges = [];
  }

  handlePrice(e) {
    if (this.props.disableChange) return this.props.showError();
    this.setState({ price: e.target.value, total: (Number(e.target.value) + Number(this.state.tax) + Number(this.state.shipping)) });
  }
  handleTax(e) {
    if (this.props.disableChange) return this.props.showError();
    this.setState({ tax: e.target.value, total: (Number(e.target.value) + Number(this.state.price) + Number(this.state.shipping)) });
  }
  handleShipping(e) {
    if (this.props.disableChange) return this.props.showError();
    this.setState({ shipping: e.target.value, total: (Number(e.target.value) + Number(this.state.tax) + Number(this.state.price)) });
  }

  submitCharge() {
    if (this.props.disableChange) return this.props.showError();
    const change = {
      action: 'New Charge',
      chargePrice: Number(this.state.price),
      chargeTax: Number(this.state.tax),
      chargeShipping: Number(this.state.shipping),
      chargeTotal: Number(this.state.total),
    };
    this.props.saveChange(change);
  }

  resetState() {
    if (this.state.selectedListItemIndex || this.state.selectedListItemIndex === 0) this.charges[this.state.selectedListItemIndex].resetState();
    
    this.setState({
      price: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      selectedListItemIndex: null,
    });
  }

  saveChange(change, selectedListItemIndex) {
    if (this.props.disableChange) return this.props.showError();
    this.setState({ selectedListItemIndex });
    this.props.saveChange(change);
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem', padding: '1rem', border: '1px solid black', justifyContent: 'center', alignItems: 'center' }}>
        {this.props.charges ?
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <h3 style={{ display: 'flex', alignSelf: 'center', marginBottom: '1rem' }}>Charges</h3>
      
          <div style={styles.titleRow}>
            <p style={styles.titleRowItem}>Status</p>
            <p style={styles.titleRowItem}>Price</p>
            <p style={styles.titleRowItem}>Tax</p>
            <p style={styles.titleRowItem}>Shipping</p>
            <p style={styles.titleRowItem}>Total</p>
            <p style={styles.titleRowItem}>Refundable Amount</p>
            <p style={{...styles.titleRowItem, flex: 1.5}} />
            <p style={{...styles.titleRowItem, flex: 2}} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            {this.props.charges.map((charge, i) => (
              <OrderChargesListItem
                disableChange={this.props.disableChange}
                showError={this.props.showError}
                key={charge.id}
                charge={charge} 
                listItemIndex={i}
                orderCurrency={this.props.orderCurrency}
                saveChange={this.saveChange}
                ref={(component) => { this.charges[i] = component; }}
              />
            ))}
          </div>
        </div> : null}

        <h3 style={{ display: 'flex', alignSelf: 'center', marginTop: '1rem', marginBottom: '1rem' }}>New Charge</h3>
        
        <div style={styles.row}>
          <div style={styles.rowItem}>
            <input value={this.state.price || ''} type="text" onChange={this.handlePrice} placeholder='Price' style={styles.input} />
          </div>

          <div style={styles.rowItem}>
            <input value={this.state.tax || ''} type="text" onChange={this.handleTax} placeholder='Tax' style={styles.input} />
          </div>

          <div style={styles.rowItem}>
            <input value={this.state.shipping || ''} type="text" onChange={this.handleShipping} placeholder='Shipping' style={styles.input} />
          </div>

          <div style={styles.rowItem}>
            <h4 style={{ marginRight: '1rem' }}>Total Charge:</h4>
            <p>{this.state.total.toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: 'usd'})}</p>
          </div>

          <div>
            <button style={GlobalStyles.button} onClick={this.submitCharge}>Submit Charge</button>
          </div>
        </div>
    </div>
    );
  }
}

const styles = {
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
    flex: 0.8,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '18px',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  input: {
    borderColor: 'black',
    padding: '0.5rem 0',
    paddingLeft: '1rem',
    width: '80%'
  },
};

export default OrderChargesList;
