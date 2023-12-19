import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControl, Button } from "react-bootstrap";

export default function TransactionForm() {
  const navigate = useNavigate();

  const initial_data = { recipient: "", amount: 0 };
  const [formData, setFormData] = useState(initial_data);

  const makeTransaction = () => {
    const { recipient, amount } = formData;
    if (recipient === "" || amount <= 0) {
      return;
    }

    fetch(`${document.location.origin}/api/transact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, amount }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/transaction-pool");
      });
  };

  return (
    <div className="TransacationForm">
      <h3>Make a Transaction</h3>
      <FormGroup>
        <FormControl
          type="text"
          placeholder="recipient"
          value={formData.recipient}
          onChange={(e) =>
            setFormData({ ...formData, recipient: e.target.value })
          }
        />
      </FormGroup>
      <FormGroup>
        <FormControl
          type="number"
          placeholder="amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </FormGroup>
      <Button onClick={() => navigate("/")}>Home</Button>
      <Button onClick={makeTransaction}>Submit</Button>
    </div>
  );
}
