import {Component} from 'react';
import getWeb3 from './getWeb3';
import ProductManagementContract from './contracts/ProductManagement.json';
import TransitManagementContract from './contracts/TransitManagement.json';
import './App.css';
import Loading from './Containers/Loading';
import MainNavBar from './Components/MainNavBar';
import TransitHome from './Containers/TransitView/TransitHome';
import ProductHome from './Containers/ProductView/ProductHome';

const TRANSIT = process.env.REACT_APP_TRANSIT.toLowerCase() === 'true';
const PRODUCT = process.env.REACT_APP_PRODUCT.toLowerCase() === 'true';

console.log({TRANSIT, PRODUCT});

class App extends Component {

  state = {
    isLoaded: false,
    service: PRODUCT,
  }

  changeService = (service) => {
    this.setState({service: service});
  }

  componentDidMount = async () => {
    try{
      // Initialising web3
      this.web3 = await getWeb3();

      // Setting Gas and Gas Price
      this.gas = 3000000;
      this.gasPrice = this.web3.utils.toWei('2','Gwei');

      // Creating Event Listener for change account
      window.ethereum.on(
        'accountsChanged',
        (accounts)=>
              this.setState( {
                currentAccount : accounts[0]
              })
        );

        // Fetching account for the very first time.
      const accounts = await this.web3.eth.getAccounts();

      // Fetching current chain ID
      this.networkId = await this.web3.eth.net.getId();

      // Initialising ProductManagement Smart Contract Instance
      const ProductNetwork = ProductManagementContract.networks[this.networkId];
      this.ProductInstance = new this.web3.eth.Contract(
        ProductManagementContract.abi,
        ProductNetwork && ProductNetwork.address
      );

      // Initialising TransitManagement Smart Contract Instance
      const TransitNetwork = TransitManagementContract.networks[this.networkId];
      this.TransitInstance = new this.web3.eth.Contract(
        TransitManagementContract.abi,
        TransitNetwork && TransitNetwork.address
      );

      // Setting state and setting isLoaded true to display the page.
      setTimeout(
        ()=>{
          this.setState({
            isLoaded: true,
            currentAccount: accounts[0]
          })
        },500
      )

    } catch (error) {
      console.error(error)
      alert("Ooops! Some Error Occurered");
    }
  }

  render() {
    
    const {isLoaded, service} = this.state;
    const {changeService} = this;

    return (
        
          isLoaded?
              <div className={'App'}>
                <MainNavBar changeService={changeService} />
                {
                  service?
                    <TransitHome />
                    :
                    <ProductHome />
                }
              </div>
            :
              <Loading />
            
        
      );
  }
}

export default App;
