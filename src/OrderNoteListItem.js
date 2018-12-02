import React from 'react';

export default class OrderNoteListItem extends React.Component {
  constructor(props) {
    super(props);

    this.renderNote = this.renderNote.bind(this);
  }

  renderNote() {
    let sanitizedNote = {};
    Object.keys(this.props.note).forEach(prop => {
      if (this.props.note[prop]) sanitizedNote[prop] = this.props.note[prop];
      if (this.props.note.charge_total > 0 && (prop === 'charge_price' || prop === 'charge_tax' || prop === 'charge_shipping')) {
        sanitizedNote[prop] = this.props.note[prop];
      }
      if (this.props.note.refund_amount > 0 && (prop === 'unit_price' || prop === 'unit_tax')) {
        sanitizedNote[prop] = this.props.note[prop];
      }
    });

    return Object.keys(sanitizedNote).map(key => {
      if (key === 'ts' || key === 'representative') return;

      const value = (key === 'unit_price' || key === 'unit_tax' || key === 'charge_price' || key === 'charge_tax' || key === 'charge_shipping' || key === 'charge_total' || key === 'refund_amount') ?
        Number(this.props.note[key]).toLocaleString('en-US', { style: 'currency', currencyDisplay: 'symbol', currency: this.props.orderCurrency})
      : this.props.note[key];

      return (
        <div style={{ display: 'flex', flexDirection: 'row' }} key={key}>
          <h4 style={{ marginRight: '0.5rem' }}>{key.split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') + ':'}</h4>
          <p>{value}</p>
        </div>
      );
    });
  }

  render() {

    return (
      <div style={styles.noteContainer}>
        <div style={styles.orderNoteParagraph}>
          {this.renderNote()}
        </div>
        <p style={styles.orderNoteDate}>{`${(new Date(this.props.note.ts)).toUTCString()} - by ${this.props.note.representative}`}</p>
      </div>
    );
  }
}

const styles = {
  noteContainer: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  orderNoteDate: {
    paddingLeft: '1rem'
  },
  orderNoteParagraph: {
    padding: '0.8rem',
    backgroundColor: '#f7e5ff',
    borderRadius: '20px',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.4rem'
  },
  enterNoteTitle: {
    display: 'flex',
    fontSize: '1.2rem',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textArea: {
    height: '8rem',
    width: '100%',
    marginTop: '0.5rem',
    marginBottom: '1rem',
  },
  enterNoteForm: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1rem',
    height: '16rem',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
};