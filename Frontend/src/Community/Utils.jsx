// Frontend/src/utils.js
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};