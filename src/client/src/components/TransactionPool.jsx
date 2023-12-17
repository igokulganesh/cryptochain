import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Transaction from "./Transaction";

export default function TransacationPool() {
  const navigate = useNavigate();
  const [transacationPoolMap, setTransactionMap] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/api/transaction-pool-map")
      .then((response) => response.json())
      .then((data) => setTransactionMap(data));
  }, []);

  return (
    <div className="TransactionPool">
      <Button onClick={() => navigate("/")}>Home</Button>
      <h3>Transaction Pool</h3>
      {Object.values(transacationPoolMap).map((transaction) => {
        return (
          <div key={transaction.id}>
            <hr />
            <Transaction transaction={transaction} />
          </div>
        );
      })}
    </div>
  );
}
