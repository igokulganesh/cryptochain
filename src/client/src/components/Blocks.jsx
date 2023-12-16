import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Block from "./Block";
import { Button } from "react-bootstrap";

export default function Blocks() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/blocks")
      .then((response) => response.json())
      .then((data) => setBlocks(data));
  }, []);

  return (
    <div className="Blocks">
      <Button onClick={() => navigate("/")}>Home</Button>
      <h1>Blocks</h1>
      {blocks.map((block) => (
        <Block block={block} key={block.hash} />
      ))}
    </div>
  );
}
