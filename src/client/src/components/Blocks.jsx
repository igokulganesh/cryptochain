import React, { useEffect, useState } from "react";
import Block from "./Block";

export default function Blocks() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/blocks")
      .then((response) => response.json())
      .then((data) => setBlocks(data));
  }, []);

  return (
    <>
      <h1>Blocks</h1>
      {blocks.map((block) => (
        <Block block={block} key={block.hash} />
      ))}
    </>
  );
}
