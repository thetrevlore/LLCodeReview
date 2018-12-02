import React from 'react';
import GlobalStyles from './styles';

class OrderNotePrompt extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      reason: '',
      refundAmount: this.props.change.refundAmount || 0,
      chargeTotal: this.props.change.chargeTotal || 0,
      chargePrice: (this.props.change.action === 'Update Quantity' && this.props.change.oldValue < this.props.change.newValue) ? this.props.change.chargePrice * (this.props.change.newValue - this.props.change.oldValue) : this.props.change.chargePrice * this.props.change.quantity || 0,
      chargeTax: (this.props.change.action === 'Update Quantity' && this.props.change.oldValue < this.props.change.newValue) ? this.props.change.chargeTax * (this.props.change.newValue - this.props.change.oldValue) : this.props.change.chargeTax * this.props.change.quantity || 0,
      chargeShipping: this.props.change.chargeShipping || 0,
      orderReferenceId: '',
      noteReasons: [
        'Wrong Product Shipped',
        'Shipped Late',
        'Over Charged',
        'Ordered Too Many',
        'Ordered Wrong Variant',
        'Ordered By Mistake',
        'Missed Sale',
        'Wanted Additional Product',
        'Incorrect Address',
        'Customer Service Discretion',
        'Fulfillment Center Mistake',
        'Customer Request',
        'Other (fill out additional note!)',
      ],
      error: '',
    }

    this.handleReason = this.handleReason.bind(this);
    this.handleTextArea = this.handleTextArea.bind(this);
    this.handleRefundAmount = this.handleRefundAmount.bind(this);
    this.handleChargePrice = this.handleChargePrice.bind(this);
    this.handleChargeTax = this.handleChargeTax.bind(this);
    this.handleChargeShipping = this.handleChargeShipping.bind(this);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.renderNoteItems = this.renderNoteItems.bind(this);
    this.handleOrderReferenceId = this.handleOrderReferenceId.bind(this);
  }

  handleReason(e) {
    this.setState({ reason: e.target.value, error: '' });
  }

  handleTextArea(e) {
    this.setState({ text: e.target.value });
  }

  handleRefundAmount(e) {
    this.setState({ refundAmount: e.target.value });
  }

  handleChargePrice(e) {
    const chargeTotal = Number(e.target.value) + Number(this.state.chargeTax) + Number(this.state.chargeShipping);
    this.setState({ chargePrice: e.target.value, chargeTotal });
  }

  handleChargeTax(e) {
    const chargeTotal = Number(e.target.value) + Number(this.state.chargePrice) + Number(this.state.chargeShipping);
    this.setState({ chargeTax: e.target.value, chargeTotal });
  }

  handleChargeShipping(e) {
    const chargeTotal = Number(e.target.value) + Number(this.state.chargeTax) + Number(this.state.chargePrice);
    this.setState({ chargeShipping: e.target.value, chargeTotal });
  }

  submit() {
    if (!this.state.reason) {
      return this.setState({ error: 'you must select a Reason for the change before submission' });
    }
    const reason = {
      refundAmount: Number(this.state.refundAmount) || 0,
      chargePrice: Number(this.state.chargePrice) || 0,
      chargeTax: Number(this.state.chargeTax) || 0,
      chargeShipping: Number(this.state.chargeShipping) || 0,
      chargeTotal: Number(this.state.chargeTotal) || 0,
      orderReferenceId: this.state.orderReferenceId,
      reason: this.state.reason,
      note: this.state.text,
      ts: (new Date()).toISOString()
    };

    this.props.submitChange(reason);
  }

  cancel() {
    this.props.cancelChange();
  }

  handleOrderReferenceId(e) {
    this.setState({ orderReferenceId: e.target.value }); // TODO: check if orderReferenceId exists.
  }

  renderNoteItems() {
    const noteItems = Object.keys(this.props.change);
    return noteItems.map(noteItem => {
      if (noteItem !== 'chargePrice' && noteItem !== 'chargeTax' && noteItem !== 'chargeShipping' && noteItem !== 'chargeTotal' && noteItem !== 'newAddress' && noteItem !== 'addr') {
        return (
          <div style={styles.item} key={noteItem}>
            <h4 style={styles.itemHeader}>{`${noteItem[0].toUpperCase()}${noteItem.slice(1)}:`}</h4>
            <p>{this.props.change[noteItem]}</p>
          </div>
        );
      }

    });
  }

  render() {
    if (!this.props.showComponent) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: '1px solid black' }}>
        <h3 style={{ marginBottom: '1rem' }}>{`Enter Reason for ${this.props.change.action || 'New Order'}`}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '50%' }}>

          {this.renderNoteItems()}

          {this.props.change.action !== 'New Order' ?
            <div>
              <div style={styles.item}>
                <h4 style={styles.itemHeader}>Refund Amount:</h4>
                <input value={this.state.refundAmount} type="text" onChange={this.handleRefundAmount} style={styles.input} />
              </div>

              <div style={styles.item}>
                <h4 style={styles.itemHeader}>Charge Price:</h4>
                <input value={this.state.chargePrice} type="text" onChange={this.handleChargePrice} style={styles.input} />
              </div>

              <div style={styles.item}>
                <h4 style={styles.itemHeader}>Charge Tax:</h4>
                <input value={this.state.chargeTax} type="text" onChange={this.handleChargeTax} style={styles.input} />
              </div>

              <div style={styles.item}>
                <h4 style={styles.itemHeader}>Charge Shipping:</h4>
                <input value={this.state.chargeShipping} type="text" onChange={this.handleChargeShipping} style={styles.input} />
              </div>
            </div>
          : <div style={styles.item}>
              <h4 style={styles.itemHeader}>Order Reference Id:</h4>
              <input value={this.state.orderReferenceId} type="text" onChange={this.handleOrderReferenceId} style={{...styles.input, width: '70%'}} />
            </div>
          }

          <div style={styles.item}>
            <h4 style={styles.itemHeader}>Charge Total:</h4>
            <p>{this.state.chargeTotal.toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: this.props.orderCurrency})}</p>
          </div>

          {this.state.error ?
            <div style={styles.item}>
              <p style={{ color: 'red' }}>{this.state.error}</p>
            </div>
          : null}

          <div style={styles.item}>
            <h4 style={styles.itemHeader}>Reason:</h4>
            <select value={this.state.reason} onChange={this.handleReason} style={{ borderColor: this.state.error ? 'red' : 'black'}}>
              <option value='' disabled>Select Reason</option>
              {this.state.noteReasons.map(reason => (<option key={reason} value={reason}>{reason}</option>))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '0.5rem' }}>
            <h4>Additional Note:</h4>
            <textarea style={styles.textArea} value={this.state.text} onChange={this.handleTextArea} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', width: '50%', justifyContent: 'space-around' }}>
          <button style={{...GlobalStyles.button, marginTop: '1rem' }} onClick={this.submit}>{`${this.props.change.action !== 'New Order' ? 'Submit' : 'Submit New Order'}`}</button>
          {this.props.change.action !== 'New Order' ? <button style={{...GlobalStyles.button, marginTop: '1rem' }} onClick={this.cancel}>{`Cancel`}</button> : null}
        </div>
      </div>
    );
  }
}

export default OrderNotePrompt;

const styles = {
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  itemHeader: {
    marginRight: '1rem',
  },
  input: {
    borderColor: 'black',
    padding: '0.5rem 0',
    paddingLeft: '1rem',
  },
  textArea: {
    height: '8rem',
    width: '100%',
    marginTop: '0.5rem',
    marginBottom: '1rem',
  },
};