"use client";

import React, { FC } from "react";

import css from "./styles.module.scss";

type CurrencyFiatType = {
  id: string;
  ticker: string;
  name: string;
  networks: [
    {
      logo_url: string;
    },
  ];
};

export type ListItemProps = CurrencyFiatType;

export const ListItem: FC<ListItemProps> = (props) => {
  const { ticker, name, networks } = props;

  return (
    <div className={css.item}>
      <img
        className={css.image}
        width={24}
        height={24}
        src={`${process.env.NEXT_PUBLIC_GUARDARIAN_DOMAIN}${networks[0].logo_url}`}
        alt={name}
      />
      <p className={css.itemText}>{ticker}</p>
      <p className={css.itemInfo}>{name}</p>
    </div>
  );
};
