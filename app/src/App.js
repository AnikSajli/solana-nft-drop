import React, { useEffect, useState } from 'react';
import './App.css';
import CandyMachine from './CandyMachine';

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        console.log("Phantom wallet found.");
        const response = await solana.connect({onlyIfTrusted: true});
        console.log('Connected with public key', response.publicKey.toString());
      } else {
        console.log("Solana object not found. Get a phantom wallet!");
      }
    } catch(error) {
      console.log(error);
    } 
  }

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  useEffect(() => {
    const onload = async() => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onload);
    return () => window.removeEventListener('load', onload);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="sub-text">NFT drop machine</p>
          { !walletAddress && renderNotConnectedContainer()}
        </div>
        {
          walletAddress && <CandyMachine walletAddress={window.solana} />
        }
      </div>
    </div>
  );
};

export default App;
