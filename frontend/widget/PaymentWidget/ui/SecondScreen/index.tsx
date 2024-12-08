"use client";

import React, {FC, useCallback, useEffect, useState} from "react";
import {FormikProvider} from "formik";

import {InputField} from "@/shared/ui/Fields/Input";
import {ArrowButton} from "@/shared/ui";
import {FormState, useForm} from "./hooks/useForm";

import {apiClientBase, apiClientGuardarian} from "@/shared/lib/fetch";
import {ListItem} from "@/widget/PaymentWidget/ui/SecondScreen/ui/ListItem";
import {SelectField} from "@/shared/ui/Fields/Select";
import {getFormikErrorMessage} from "@/shared/lib/helpers/getFormikErrorMessage";

import css from "../common.module.scss";

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

export type SecondScreenProps = {
  onSuccess: (amount: string, currency: string) => void;
};

export const SecondScreen: FC<SecondScreenProps> = (props) => {
  const { onSuccess } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<string | null>(null);
  const [list, setList] = useState<CurrencyFiatType[] | null>(null);

  const formik = useForm(handleSuccess);

  const errorMessage = getFormikErrorMessage(formik.errors);

  const usdLogoSrc = list?.find((currency) => currency.ticker === "USD")
    ?.networks[0].logo_url;

  const renderSelectedItem = useCallback(
    (props: { value: string | null }) => {
      const { value } = props;

      const selectedCurrency = list?.find(
        (currency) => currency.ticker === value,
      );

      if (!selectedCurrency) {
        return null;
      }

      const { name, networks, ticker } = selectedCurrency;

      const logoUrl = networks[0].logo_url;

      return (
        <div className={css.selectedItem}>
          <img
            className={css.image}
            width={24}
            height={24}
            src={`${process.env.NEXT_PUBLIC_GUARDARIAN_DOMAIN}${logoUrl}`}
            alt={name}
          />
          <p className={css.selectedItemText}>{ticker}</p>
        </div>
      );
    },
    [list],
  );

  const handleSubmitClick = () => {
    formik.handleSubmit();
  };

  async function handleSuccess(values: FormState) {
    if (!values.currency) {
      return;
    }

    setIsLoading(true);

    await onSuccess(values.amount, values.currency);

    setIsLoading(false);
  }

  useEffect(() => {
    const calculateFee = async () => {
      try {
        const {data} = await apiClientBase.get<{
          amount: string;
          percent: string;
        }>("/calculate-fee", {
          params: {
            amount: formik.values.amount,
          },
        });

        setTotal(data.amount);
      } catch (error) {
        console.error(error);
      }
    };

    if (formik.values.amount) {
      void calculateFee();
    }
  }, [formik.values.amount]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await apiClientGuardarian.get<CurrencyFiatType[]>(
          "/currencies/fiat?available=true",
        );

        setList(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchCurrencies();
  }, []);

  return (
    <div className={css.content}>
      <p className={css.subtitle}>Step 2/2. Fill payment details</p>

      <FormikProvider value={formik}>
        <InputField
          name="amount"
          type="number"
          debounce={300}
          contentRight={
            <div className={css.currency}>
              {usdLogoSrc && (
                <img
                  width={24}
                  height={24}
                  src={`${process.env.NEXT_PUBLIC_GUARDARIAN_DOMAIN}${usdLogoSrc}`}
                  alt={"usd logo"}
                />
              )}{" "}
              USD
            </div>
          }
          placeholder={`Enter amount in USD to pay`}
        />

        <div className={css.selectWrapper}>
          <p className={css.selectTitle}>Choose currency to pay with</p>
          <SelectField
            name={"currency"}
            list={list}
            valueField={"ticker"}
            selectedItem={renderSelectedItem}
            item={ListItem}
            searchBy={"name"}
            isLoading={!list}
            withSearch
          />
        </div>

        {total && formik.values.amount ? (
          <div className={css.totalWrapper}>
            <p className={css.totalTitle}>Total to pay</p>
            <p className={css.totalValue}>{total} USD</p>
            <p className={css.totalSubtitle}>Payment fees included</p>
          </div>
        ) : null}

        <div className={css.footer}>
          {errorMessage ? <p className={css.error}>{errorMessage}</p> : null}
          <ArrowButton
            className={css.button}
            type={"submit"}
            isLoading={isLoading}
            onClick={handleSubmitClick}
          >
            Pay
          </ArrowButton>
        </div>
      </FormikProvider>
    </div>
  );
};
