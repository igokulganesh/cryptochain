import React, { useEffect, useState } from "react";
import logo from "../assets/images/blockchain.png";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function App() {
  const navigate = useNavigate();
  const [walletInfo, setWalletInfo] = useState({});

  console.log(document.location.origin);

  useEffect(() => {
    fetch(`${document.location.origin}/api/wallet-info`)
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
      <Button onClick={() => navigate("/blocks")}>Blocks</Button>
      <Button onClick={() => navigate("/transact")}>Make Transaction</Button>
      <Button onClick={() => navigate("/transaction-pool")}>
        Transaction Pool
      </Button>
    </div>
  );
}
