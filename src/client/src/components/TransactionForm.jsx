import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControl, Button } from "react-bootstrap";

export default function TransactionForm() {
  const navigate = useNavigate();

  const initial_data = { recipient: "", amount: 0 };
  const [formData, setFormData] = useState(initial_data);

  const makeTransaction = () => {
    if (formData.recipient === "" || formData.amount <= 0) {
      return;
    }

    fetch("http://localhost:3000/api/transact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
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
