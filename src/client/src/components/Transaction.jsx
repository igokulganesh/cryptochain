import React from "react";
import useShortTextFormatter from "../utils/useShortTextFormatter";

export default function Transaction({ transaction }) {
  const { input, outputMap } = transaction;
  const recipients = Object.keys(outputMap);

  return (
    <div className="p-5">
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
    </div>
  );
}
