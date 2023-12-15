import React, { useEffect, useState } from "react";
import Blocks from "./Blocks";
import logo from "../assets/images/blockchain.png";

export default function App() {
  const [walletInfo, setWalletInfo] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/wallet-info")
      .then((response) => response.json())
      .then((data) => setWalletInfo(data));
  }, []);

  return (
    <div className="App">
      <img src={logo} width="550px" style={{ margin: "5%" }} />
      <h1>Welcome to blockchain</h1>
      <div className="walletInfo">
        <p>Address: {walletInfo.address}</p>
        <p>balance: {walletInfo.balance}</p>
      </div>
      <Blocks />
    </div>
  );
}
