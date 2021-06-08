import React from 'react';
import web3 from './web3.js';
import lottery from './lottery.js';

class App extends React.Component {
  state = {
    manager: '', 
    players: [], 
    balance: '', 
    value: '', 
    message: '',
  };

  async componentDidMount() {
    const manager = (await lottery.methods.manager().call()).toLowerCase();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    if (!this.state.value || this.state.value === "") {
      return;
    }

    this.setState({ message: 'Waiting on transaction...' });

    await lottery.methods.enter().send({ 
      from: window.ethereum.selectedAddress, 
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'Your entry is complete!' });
  }

  onClick = async () => {
    if (this.players <= 0) {
      return;
    }

    this.setState({ message: 'Picking a winner...' });

    await lottery.methods.pickWinner().send({ 
      from: window.ethereum.selectedAddress
    });

    this.setState({ message: 'Winner selected!' });
  }

  isManager = () => {
    if (window.ethereum.selectedAddress === this.state.manager) {
      return(
        <div>
        <hr />
        <h4>Pick a winner?</h4>
        <button onClick={this.onClick}>Award a lotto winner!</button>
        </div>
      );
    } 
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contact is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} players entered. </p>
        <p>Players available are: {this.state.players}</p>
        <p>Total pot contains: {web3.utils.fromWei(this.state.balance, 'ether')} eth</p>

        <form onSubmit={this.onSubmit}>
          <h2>Enter lotto?</h2>
          <div>
            <label>Amount of ETH to bet: </label>
            <input 
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })} />
          </div>
          <button>Enter</button>
        </form>

        {this.isManager()}

        <hr />
        <p style={{fontStyle: 'italic'}}>{this.state.message}</p>
      </div>
    );
  }
}
export default App;
