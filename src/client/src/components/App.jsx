import React, { useEffect, useState } from "react";

export default function App() {
  const [walletInfo, setWalletInfo] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/wallet-info")
      .then((response) => response.json())
      .then((json) => setWalletInfo(json));
  }, []);

  return (
    <>
      <h1>Welcome to blockchain</h1>
      <p>Address: {walletInfo.address}</p>
      <p>balance: {walletInfo.balance}</p>
    </>
  );
}
