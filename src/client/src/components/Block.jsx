import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";
import useShortTextFormatter from "../utils/useShortTextFormatter";

const DisplayTransaction = ({ data }) => {
  const stringified = JSON.stringify(data);

  const [viewData, setViewData] = useState(false);

  return (
    <>
      Data:{" "}
      <div>
        {viewData
          ? data.map((transaction) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))
          : useShortTextFormatter(stringified, 40)}
      </div>
      <Button variant="danger" size="sm" onClick={() => setViewData(!viewData)}>
        {viewData ? "Show Less" : "Show More"}
      </Button>
    </>
  );
};

export default function Block({ block }) {
  const { timestamp, data, hash } = block;

  return (
    <div className="block">
      <p>Hash: {useShortTextFormatter(hash)}</p>
      <p>Timestamp: {new Date(timestamp).toLocaleDateString()}</p>
      <DisplayTransaction data={data} />
    </div>
  );
}
