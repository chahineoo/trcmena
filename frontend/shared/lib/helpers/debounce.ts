export const debounced = <Args extends any[]>(
  callback: (...args: Args) => void,
  delay: number,
) => {
  let timer: NodeJS.Timeout | null = null;

  return (...args: Args) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => callback(...args), delay);
  };
};
