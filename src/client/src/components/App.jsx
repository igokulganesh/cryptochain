import React, { useEffect, useState } from "react";
import logo from "../assets/images/blockchain.png";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function App() {
  const navigate = useNavigate();
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
      <Button onClick={() => navigate("/blocks")}>Blocks</Button>
    </div>
  );
}
