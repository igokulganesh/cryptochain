import React from "react";
import useShortTextFormatter from "../utils/useShortTextFormatter";

export default function Transaction({ transaction }) {
  const { input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);

  return (
    <>
      <p>
        From: {useShortTextFormatter(input.address, 20)} | Balace:{" "}
        {input.amount}
      </p>
      {recipients.map((recipient) => {
        return (
          <p key={recipient}>
            To: {useShortTextFormatter(recipient, 20)} | Sent:{" "}
            {outputMap[recipient]}
          </p>
        );
      })}
    </>
  );
}
