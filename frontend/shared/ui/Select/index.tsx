import React, {ChangeEvent, FC, ReactElement, useRef, useState} from "react";
import cn from "classnames";

import CheckIcon from "@/assets/svg/lined/check.svg";
import LoupeIcon from "@/assets/svg/lined/loupe.svg";
import ArrowIcon from "@/assets/svg/lined/arrow-right-simple.svg";
import {useClickOutside} from "@/shared/lib/hooks/useClickOutside";
import {Input, Spinner} from "@/shared/ui";

import css from "./styles.module.scss";

export type SelectProps<T> = {
  list: (T & { name: string })[] | null;
  value: string | null;
  valueField: string;
  item: ((props: T) => ReactElement) | FC<T>;
  searchBy: string;
  isLoading?: boolean;
  error?: boolean;
  selectedItem?:
    | ((props: { value: string | null }) => ReactElement)
    | FC<{ value: string | null }>;
  withSearch?: boolean;
  onChange: (value: string) => void;
};

export default function Select<T extends Record<string, any>>(
  props: SelectProps<T>,
) {
  const {
    value,
    list,
    item: ListItem,
    selectedItem: SelectedItem,
    searchBy,
    isLoading,
    withSearch,
    valueField: valueFieldInitial,
    error,
    onChange,
  } = props;

  const [search, setSearch] = useState("");
  const [isOpened, setIsOpened] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggleOpened = () => {
    setIsOpened(true);
  };

  const handleClickOutside = () => {
    setIsOpened(false);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value.toLowerCase());

  const handleChange = (value: string) => {
    onChange(value);
    setIsOpened(false);
  };

  const isFC = (item: ((props: T) => ReactElement) | FC<T>): item is FC<T> => {
    return "name" in item;
  };
  const isSelectedFC = (
    item:
      | ((props: { value: string | null }) => ReactElement)
      | FC<{ value: string | null }>,
  ): item is FC<{ value: string | null }> => {
    return "name" in item;
  };

  const valueField = valueFieldInitial ?? "name";

  const filteredList = !list
    ? null
    : withSearch
      ? list.filter((item) =>
          item[searchBy ?? valueField].toLowerCase().includes(search),
        )
      : list;

  useClickOutside(containerRef, handleClickOutside);

  return (
    <div
      className={cn(
        css.container,
        isLoading && css.isLoading,
        isOpened && css.isOpened,
        error && css.error,
      )}
    >
      <div className={css.overlay}></div>
      <div className={css.content} onClick={toggleOpened}>
        {!value ? (
          isLoading ? (
            <Spinner />
          ) : (
            <p className={css.empty}>Select currency</p>
          )
        ) : SelectedItem ? (
          isSelectedFC(SelectedItem) ? (
            <SelectedItem value={value} />
          ) : (
            SelectedItem({ value: value })
          )
        ) : (
          <p className={css.text}>{value}</p>
        )}
        <ArrowIcon className={css.arrow} />
      </div>
      <div ref={containerRef} className={css.listWrapper}>
        <div className={css.listContent}>
          <p className={css.title}>Select currency</p>
          {withSearch && (
            <Input
              value={search}
              variant={"default"}
              className={css.search}
              contentLeft={<LoupeIcon className={css.loupe} />}
              placeholder={"Search currency"}
              onChange={handleSearch}
            />
          )}
          <ul className={css.list}>
            {filteredList && filteredList.length ? (
              filteredList.map((props) => (
                <li
                  key={props.id}
                  value={props[valueField]}
                  onClick={() => handleChange(props[valueField])}
                >
                  {isFC(ListItem) ? <ListItem {...props} /> : ListItem(props)}
                  {value === props[valueField] && (
                    <CheckIcon className={css.check} />
                  )}
                </li>
              ))
            ) : (
              <p className={css.emptyLabel}>Empty list</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
