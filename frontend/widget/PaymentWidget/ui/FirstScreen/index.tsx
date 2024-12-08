'use client'

import {FC} from "react";
import {FormikProvider} from "formik";

import {InputField} from "@/shared/ui/Fields/Input";
import {ArrowButton} from "@/shared/ui";
import {FormState, useForm} from "./hooks/useForm";

import {getFormikErrorMessage} from "@/shared/lib/helpers/getFormikErrorMessage";

import css from "../common.module.scss";

export type FirstScreenProps = {
  onSuccess: (values: FormState) => void;
};

export const FirstScreen: FC<FirstScreenProps> = (props) => {
  const { onSuccess } = props;

  const formik = useForm(onSuccess);

  const handleSubmitClick = () => {
    formik.handleSubmit();
  };

  const errorMessage = getFormikErrorMessage(formik.errors);

  return (
    <div className={css.content}>
      <p className={css.subtitle}>Step 1/2. Fill student&#39;s info</p>
      <FormikProvider value={formik}>
        <div className={css.inputsWrapper}>
          <InputField name={"payerName"} type="text" placeholder={"Enter payer name"} />
          <InputField name={"studentName"} type="text" placeholder={"Enter student name"} />
        </div>
        <InputField
          name={"passport"}
          type="text"
          placeholder={"Enter passport number"}
        />
        <InputField
          name={"birth"}
          type="text"
          placeholder={"Enter birth date (example MM.DD.YYYY)"}
        />
        <InputField name={"email"} type="text" placeholder={"Enter e-mail"} />

        <div className={css.footer}>
          {errorMessage ? <p className={css.error}>{errorMessage}</p> : null}
          <ArrowButton
            className={css.button}
            type={"submit"}
            onClick={handleSubmitClick}
          >
            Next
          </ArrowButton>
        </div>
      </FormikProvider>
    </div>
  );
};
