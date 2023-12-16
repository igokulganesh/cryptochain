import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControl, Button } from "react-bootstrap";

export default function TransactionForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ recipient: "", amount: 0 });

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
    </div>
  );
}
