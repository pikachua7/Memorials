import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from './NavBar/Navbar';
import TroveIt from '../abis/NFT.json'
import Web3 from 'web3';
import Upload from './Upload/Upload';
import Feed from './Feed/Feed';
import Profile from './Profile/Profile';
import Portis from '@portis/web3';

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    // const web3 = window.web3
    const portis = new Portis('c0f465f7-8289-42c1-98a6-cec427ceecc6', 'maticMumbai');
    const web3 = new Web3(portis.provider);
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = TroveIt.networks[networkId]
    if(networkData) {
      const troveit = new web3.eth.Contract(TroveIt.abi, networkData.address)
      this.setState({ troveit })

      this.setState({ loading: false})

    } else {
      window.alert('TroveIt contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      troveit: null
    }
  }

  render() {
    return (
      // <div className="App" style={{backgroundSize: "cover",
      // height: "100vh",
      // color: "#f5f5f5"}}>
        // {/* App NavBar */}
        <Router>
          <Navbar account={this.state.account}/>
          <Switch>           
            <Route path="/" exact component={() => <Upload/>} />
            <Route path ="/feed" exact component={()=><Feed/>}/>
            <Route path ="/profile" exact component={()=><Profile/>}/>
          </Switch>          
        </Router>
      // </div>
    );
  }
  
}

export default App;