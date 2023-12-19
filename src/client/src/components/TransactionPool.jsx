import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Transaction from "./Transaction";

const POLL_INTERVAL_MS = 10000;

export default function TransacationPool() {
  const navigate = useNavigate();
  const [transacationPoolMap, setTransactionMap] = useState({});

  const fetchMineTransaction = () => {
    fetch(`${document.location.origin}/api/mine-transactions`).then(
      (response) => {
        if (response.status === 200) {
          console.log(response);
          navigate("/blocks");
        } else {
          alert("The Mine Transactions block request fails");
        }
      }
    );
  };

  const fetchTransactionPoolMap = () => {
    console.log("get Transaction Pool");
    fetch(`${document.location.origin}/api/transaction-pool-map`)
      .then((response) => response.json())
      .then((data) => setTransactionMap(data));
  };

  useEffect(() => {
    fetchTransactionPoolMap();
  }, []);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      fetchTransactionPoolMap();
    }, POLL_INTERVAL_MS);

    return () => {
      clearInterval(intervalRef);
    };
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
      <hr />
      <Button onClick={fetchMineTransaction} variant="danger">
        Mine the Transaction
      </Button>
    </div>
  );
}
