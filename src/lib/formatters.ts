export const valueFormatter = (number: number) =>
  `${Intl.NumberFormat("no").format(number).toString()}`
