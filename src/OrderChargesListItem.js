import React from 'react';
import GlobalStyles from './styles';

export default class OrderChargesListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      refundAmount: '',
      totalChargeAmount: 0,
    }

    this.handleRefundInput = this.handleRefundInput.bind(this);
    this.submitFullRefund = this.submitFullRefund.bind(this);
    this.submitPartialRefund = this.submitPartialRefund.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  componentDidMount() {
    const totalChargeAmount = (this.props.charge.price + this.props.charge.tax + this.props.charge.shipping);
    this.setState({ totalChargeAmount });
  }

  handleRefundInput(e) {
    if (this.props.disableChange) return this.props.showError();
    this.setState({ refundAmount: e.target.value, error: '' });
  }

  submitFullRefund() {
    if (this.props.disableChange) return this.props.showError();
    const change = {
      action: 'Full Refund',
      refundAmount: this.props.charge.refundableAmount,
      refundChargeId: this.props.charge.id,
    };
    this.props.saveChange(change, this.props.listItemIndex);
  }

  submitPartialRefund() {
    if (this.props.disableChange) return this.props.showError();
    if (this.props.charge.refundableAmount < Number(this.state.refundAmount)) {
      return this.setState({ error: 'charge cannot cover that refund amount' })
    }
    const change = {
      action: 'Partial Refund',
      refundAmount: Number(this.state.refundAmount),
      refundChargeId: this.props.charge.id
    };

    this.props.saveChange(change, this.props.listItemIndex);
  }

  resetState() {
    this.setState({ refundAmount: '' });
  }

  render() {
    const { charge, listItemIndex } = this.props;

    return (
      <div style={{...styles.chargeRow, backgroundColor: listItemIndex % 2 === 0 ? '#F1F1FF' : '#FFFFFF' }}>
        <p style={styles.chargeRowItem}>{charge.charge_status}</p>
        <p style={styles.chargeRowItem}>{charge.price.toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: this.props.orderCurrency})}</p>
        <p style={styles.chargeRowItem}>{charge.tax.toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: this.props.orderCurrency})}</p>
        <p style={styles.chargeRowItem}>{charge.shipping.toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: this.props.orderCurrency})}</p>
        <p style={styles.chargeRowItem}>{this.state.totalChargeAmount.toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: this.props.orderCurrency})}</p>
        <p style={styles.chargeRowItem}>{this.props.charge.refundableAmount.toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: this.props.orderCurrency})}</p>

        <div style={{...styles.chargeRowItem, flex: 1.5 }}>
          <button style={GlobalStyles.button} onClick={this.submitFullRefund}>Submit Full Refund</button>
        </div>

        <div style={{ ...styles.chargeRowItem, flexDirection: 'column', padding: '0.5rem 0', flex: 2 }}>
          {this.state.error ? <p style={{ color: 'red', fontWeight: 400, fontSize: '16px' }}>{this.state.error}</p> : null}
          <input value={this.state.refundAmount} type="text" onChange={this.handleRefundInput} placeholder='Partial Refund Amount' style={{ borderColor: 'black', padding: '0.5rem 0', paddingLeft: '1rem', marginBottom: '0.5rem' }} />
          <button style={GlobalStyles.button} onClick={this.submitPartialRefund}>Submit Partial Refund</button>
        </div>
      </div>
    );
  }
}

const styles = {
  chargeRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    listStyle: 'none',
    width: '100%',
  },
  chargeRowItem: {
    display: 'flex',
    flex: 0.8,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 500,
    whiteSpace: 'pre-wrap',
    height: '100%',
  },
};
