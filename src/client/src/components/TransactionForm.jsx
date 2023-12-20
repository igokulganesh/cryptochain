import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import useShortTextFormatter from "../utils/useShortTextFormatter";

export default function TransactionForm() {
  const navigate = useNavigate();

  const initial_data = { recipient: "", amount: undefined };
  const [formData, setFormData] = useState(initial_data);
  const [knowAddresses, setKnownAddresses] = useState([]);

  useEffect(() => {
    fetch(`${document.location.origin}/api/known-addresses`)
      .then((response) => response.json())
      .then((data) => {
        setKnownAddresses(data);
      });
  }, []);

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
      <Dropdown>
        <Dropdown.Toggle>
          {formData.recipient
            ? useShortTextFormatter(formData.recipient)
            : "Select Recipient"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {knowAddresses.map((address) => (
            <Dropdown.Item
              key={address}
              onClick={() => setFormData({ ...formData, recipient: address })}
            >
              {useShortTextFormatter(address, 50)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
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
