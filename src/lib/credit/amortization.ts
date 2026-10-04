/** Fixed monthly payment for a fully amortizing loan. `apr` is a yearly decimal. */
export function monthlyPayment(principal: number, apr: number, months: number): number {
  if (months <= 0) return principal;
  const r = apr / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export interface AmortRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface AmortResult {
  rows: AmortRow[];
  payment: number;
  totalInterest: number;
  totalPaid: number;
  months: number;
}

/**
 * Month-by-month schedule. `extra` is added to every payment and goes
 * straight to principal, which shortens the loan.
 */
export function amortize(principal: number, apr: number, months: number, extra = 0): AmortResult {
  const r = apr / 12;
  const payment = monthlyPayment(principal, apr, months);
  const rows: AmortRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  for (let m = 1; balance > 0.005 && m <= months; m++) {
    const interest = balance * r;
    const pay = Math.min(payment + extra, balance + interest);
    balance = balance + interest - pay;
    totalInterest += interest;
    rows.push({ month: m, payment: pay, interest, principal: pay - interest, balance: Math.max(0, balance) });
  }
  return { rows, payment, totalInterest, totalPaid: principal + totalInterest, months: rows.length };
}

/**
 * Months to pay off a balance with a fixed payment, from the standard
 * formula n = −ln(1 − rB/P) ÷ ln(1 + r). Infinity if the payment doesn't
 * cover the interest.
 */
export function monthsToPayOff(balance: number, apr: number, payment: number): number {
  const r = apr / 12;
  if (balance <= 0) return 0;
  if (r === 0) return payment > 0 ? balance / payment : Infinity;
  if (payment <= balance * r) return Infinity;
  return -Math.log(1 - (r * balance) / payment) / Math.log(1 + r);
}
