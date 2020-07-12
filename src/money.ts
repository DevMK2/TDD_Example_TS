
export class Money {
  constructor(protected amount: number) {}

  equals = (money: Money): boolean =>
    (this.amount === money.amount) && (this.constructor.name === money.constructor.name);

  static dollar = (amount: number): Dollar => new Dollar(amount);
  static franc = (amount: number): Franc => new Franc(amount);
}


class Dollar extends Money {
  constructor(protected amount: number) {
    super(amount);
  }

  times = (multiplier: number): Money =>
    new Dollar(this.amount * multiplier);
};


export class Franc extends Money {
  constructor(protected amount: number) {
    super(amount);
  }

  times = (multiplier: number): Money =>
    new Franc(this.amount * multiplier);
};
