import React, { useEffect, useState } from "react";
import Blocks from "./Blocks";

export default function App() {
  const [walletInfo, setWalletInfo] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/wallet-info")
      .then((response) => response.json())
      .then((data) => setWalletInfo(data));
  }, []);

  return (
    <>
      <h1>Welcome to blockchain</h1>
      <p>Address: {walletInfo.address}</p>
      <p>balance: {walletInfo.balance}</p>
      <Blocks />
    </>
  );
}
