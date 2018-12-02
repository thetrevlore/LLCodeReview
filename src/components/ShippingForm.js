import React from 'react';
import Countries from '../data/countries';
import UsStates from '../data/usStates';

export default class ShippingForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newAddress: {
        firstName: this.props.firstName || '',
        lastName: this.props.lastName || '',
        line1: this.props.line1 || '',
        line2: this.props.line2 || '',
        country: this.props.country || 'US',
        city: this.props.city || '',
        region: this.props.region || '',
        postalCode: this.props.postalCode || ''
      }
    };

    this.updateField = this.updateField.bind(this);
    this.submitShipping = this.submitShipping.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  updateField(field, value) {
    if (this.props.removeError) this.props.removeError();
		this.setState({ newAddress: { ...this.state.newAddress, [field]: value } })
  }
  
  submitShipping() {
    const { firstName, lastName, city, country, line1, line2, region, postalCode } = this.state.newAddress;
    const change = {
      action: 'Update Shipping',
      oldValue: `${this.props.firstName} ${this.props.lastName}\n${this.props.line1} ${this.props.line2}\n${this.props.city} ${this.props.region}\n${this.props.postalCode} ${this.props.country}`,
      newValue: `${firstName} ${lastName}\n${line1} ${line2}\n${city} ${region}\n${postalCode} ${country}`,
      newAddress: this.state.newAddress,
    };
    this.props.saveChange(change);
  }

  cancel() {
    this.props.cancelChange();
  }

  render() {
    return (
      <div style={styles.componentContainer}>
        <h2 style={styles.title}>Shipping Address</h2>

        <div style={styles.row}>
        <div style={{ ...styles.colFullWidth, ...styles.colHalfWidth }}>
            <input
              type='text'
              value={this.state.newAddress.firstName}
              placeholder='Customer First Name'
              onChange={({ target }) => this.updateField('firstName', target.value)}
            />
          </div>
          <div style={{ ...styles.colFullWidth, ...styles.colHalfWidth }}>
            <input
              type='text'
              value={this.state.newAddress.lastName}
              placeholder='Customer Last Name'
              onChange={({ target }) => this.updateField('lastName', target.value)}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.colFullWidth}>
            <input
              type='text'
              value={this.state.newAddress.line1}
              placeholder='Address Line 1'
              onChange={({ target }) => this.updateField('line1', target.value)}
              style={{ width: '100%'}}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.colFullWidth}>
            <input
              type='text'
              value={this.state.newAddress.line2}
              placeholder='Address Line 2'
              onChange={({ target }) => this.updateField('line2', target.value)}
              style={{ width: '100%'}}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.colFullWidth}>
            <select value={this.state.newAddress.country} onChange={({ target }) => this.updateField('country', target.value)}>
              <option value='' disabled>Country</option>
              {Countries.map(c => (<option key={c.code} value={c.code}>{c.name}</option>))}
            </select>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.colFullWidth}>
            <input
              type='text'
              value={this.state.newAddress.city}
              placeholder='City'
              onChange={({ target }) => this.updateField('city', target.value)}
              style={{ width: '100%'}}
            />
          </div>
        </div>

        <div style={styles.row}>

          {this.state.newAddress.country == 'US' ? (
            <div style={{ ...styles.colFullWidth, ...styles.colHalfWidth }}>
              <select value={this.state.newAddress.region} onChange={({ target }) => this.updateField('region', target.value)}>
                <option value='' disabled>State / Region</option>
                {UsStates.map(s => (<option key={s.abbreviation} value={s.abbreviation}>{s.name}</option>))}
              </select>
            </div>
          ) : (
            <div style={{ ...styles.colFullWidth, ...styles.colHalfWidth }}>
              <input
                type='text'
                value={this.state.newAddress.region}
                placeholder='State / Region'
                onChange={({ target }) => this.updateField('region', target.value)}
              />
            </div>
          )}

          <div style={{ ...styles.colFullWidth, ...styles.colHalfWidth }}>
            <input
              type='text'
              value={this.state.newAddress.postalCode}
              placeholder='Postal Code'
              onChange={({ target }) => this.updateField('postalCode', target.value)}
            />
          </div>

        </div>

        <div style={styles.saveButtonContainer}>
          <button style={styles.saveButton} onClick={this.submitShipping}>Save Shipping Address</button>
          {this.props.cancelChange ? <button style={styles.saveButton} onClick={this.cancel}>Cancel</button> : null}
        </div>
      </div>
    );
  }
}

const styles = {
  componentContainer: {
    marginTop: '2rem',
    width: '50%',
  },
  title: {
    padding: '1rem'
  },
  row: {
    display: 'flex',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  colFullWidth: {
    boxSizing: 'border-box',
    width: '100%',
    paddingRight: '0.5rem',
    paddingLeft: '0.5rem',
  },
  colHalfWidth: {
    width: '50%'
  },
  saveButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem',
    marginBottom: '3rem'
  },
  saveButton: {
    padding: '15px 45px',
    fontWeight: 500,
    fontSize: '18px',
    textAlign: 'center',
    letterSpacing: '0.6px',
    borderRadius: '50px',
    cursor: 'pointer',
    backgroundColor: '#5666CC',
    color: 'white',
    transition: 'background-color 0.2s ease',
  }
};

