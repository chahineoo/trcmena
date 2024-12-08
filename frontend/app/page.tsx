import cn from "classnames";

import {PaymentWidget} from "@/widget/PaymentWidget";
import GuardarianLogo from "@/assets/svg/logo/guardarian.svg";

import css from "./page.module.scss";

export type HomePageProps = {
  searchParams: Promise<{
    created?: string;
  }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const { created } = await searchParams;

  return (
    <div className={css.page}>
      <div className={css.aside}>
        <div className={css.header}>
          <img src={'/images/logo/TCP.png'} className={css.logo} alt={'logotip'} />
          <p>TRC Education</p>
        </div>
        <h1 className={css.title}>
          Student fees <br /> <span>Payment Gateway</span>
        </h1>
        <p className={cn(css.poweredBy, css.poweredByDesktop)}>
          Powered by <GuardarianLogo />
        </p>
      </div>
      <div className={css.widgetWrapper}>
        <PaymentWidget paymentId={created} />
      </div>
      <p className={cn(css.poweredBy, css.poweredByMobile)}>
        Powered by <GuardarianLogo />
      </p>
    </div>
  );
}
