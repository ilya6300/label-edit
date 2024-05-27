import React from "react";

export const ExchangeWithServer = () => {
  return (
    <ul className="message_exchange_with_server_container bar_label">
      <li>Подождите, идёт обмен с сервером</li>
      <li className="message_loader"></li>
    </ul>
  );
};
