interface Expression {
  amount: number;
  reduce: Function;
}

export class Money implements Expression {
  constructor(public amount: number, public currency: string) {}

  equals = (money: Money): boolean =>
    (this.amount === money.amount) && (this.currency === money.currency);

  times = (multiplier: number): Money =>
    new Money(this.amount * multiplier, this.currency);

  plus = (money: Money): Sum => new Sum(this, money);

  reduce = (): Money => this;

  static dollar = (amount: number): Money => new Money(amount, 'USD');
  static franc = (amount: number): Money => new Money(amount, 'CHF');
}

export class Sum implements Expression {
  public amount: number;

  constructor(augend: Money, addend: Money) {
    this.amount = augend.amount + addend.amount;
  }

  reduce = (to: string): Money => new Money(this.amount, to);
}

export class Bank {
  reduce = (source: Expression, to: string): Money => source.reduce(to);
}
