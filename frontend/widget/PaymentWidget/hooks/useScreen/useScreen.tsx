import { FC, useState } from "react";

import css from "./style.module.scss";
import cn from "classnames";

type Distribute<U> = U extends any ? FC<U> : never;

export const useScreen = <T extends Record<string, any>>(
  screen: [Distribute<T>, T],
) => {
  const [screens, setScreens] = useState<
    { id: number; screen: FC<T>; props: T }[]
  >([{ id: 0, screen: screen[0], props: screen[1] }]);

  const goTo = (data: [Distribute<T>, T]) => {
    setScreens((prev) => [
      ...prev,
      { id: prev.length, screen: data[0], props: data[1] },
    ]);
  };
  const goToStart = () => {
    setScreens((prev) => [prev[0]]);
  };

  const list = screens.map(({ id, screen: Screen, props }, idx) => (
    <div
      key={id}
      className={cn(css.content, idx !== screens.length - 1 && css.hidden)}
    >
      <Screen {...props} />
    </div>
  ));

  return {
    list,
    goToStart,
    goTo,
  };
};
