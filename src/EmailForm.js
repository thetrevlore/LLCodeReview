import React from 'react';

const styles = {
  formContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: '1rem',
    marginTop: '5rem',
  },
  inputStyle: {
    width: '20rem',
    marginRight: '2rem',
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
};

export default class EmailForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { email: '' };
    this.handleEmailInput = this.handleEmailInput.bind(this);
  }

  handleEmailInput(e) {
    this.setState({ email: e.target.value })
  }

  render() {
    return (
      <form style={styles.formContainer}>
        <input
          type='text'
          value={this.state.email}
          placeholder='Customer Email'
          onChange={this.handleEmailInput}
          style={styles.inputStyle}
        />
        <button style={styles.lookupButton}>Lookup Customer Email</button>
      </form>
    );
  }
}