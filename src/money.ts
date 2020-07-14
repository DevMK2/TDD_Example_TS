
abstract class Expression {
  constructor(public amount: number, public currency: string) {}

  plus = (addend: Expression): Expression => new Sum(this, addend);
  abstract times(multiplier: number): Expression;
  abstract reduce(bank: Bank, to: string): Money;
  equals = (other: Expression): boolean => (this.currency === other.currency) && (this.amount === other.amount);
}

export class Money extends Expression {
  constructor(public amount: number, public currency: string) {
    super(amount, currency);
  }

  times = (multiplier: number): Expression => new Money(this.amount * multiplier, this.currency);

  reduce = (bank: Bank, to: string): Money => {
    const rate = bank.rate(this.currency, to);
    this.amount *= rate;
    this.currency = to;
    return this;
  };

  static dollar = (amount: number): Money => new Money(amount, 'USD');
  static franc = (amount: number): Money => new Money(amount, 'CHF');
}

export class Sum extends Expression {
  constructor(private augend: Expression, private addend: Expression) {
    super(-1, '');
    if (augend.currency == addend.currency) {
      this.amount = augend.amount + addend.amount;
      this.currency = augend.currency; // TODO FIXME or addend.currency
    }
  }


  times = (multiplier: number): Expression => new Sum (
    this.augend.times(multiplier), this.addend.times(multiplier)
  );


  reduce = (bank: Bank, to: string): Money => {
    if(this.amount !== -1)
      return new Money(this.amount, to);

    this.amount = this.augend.reduce(bank, to).amount + this.addend.reduce(bank, to).amount;

    return new Money(this.amount, to);
  }
}

export class Bank {
  public rateTable: RateTable = new RateTable; 

  reduce = (source: Expression, to: string): Money => source.reduce(this, to);

  addRate = (src: string, dest: string, rate: number) => {
    if (src === dest)
      return;

    this.rateTable.store(src, dest, rate);
  }

  rate = (src: string, dest: string): number => {
    if (src === dest)
      return 1;

    return this.rateTable.get(src, dest);
  };
}

interface Hash { 
  [key: string]: any;
};

class RateTable { 
  private table: Hash = {};

  store(from: string, to: string, value: any) {
    this.table[RateTable.key(from, to)] = value;
  }

  get(from: string, to: string): any { 
    // TODO [exception] Pair.key: keyerror
    const value = this.table[RateTable.key(from, to)];

    return RateTable.isReversing(from, to)? value : 1 / value;
  }

  static key = (key1: string, key2: string): string => {
    const keys = [key1, key2].sort();
    return keys[0] + keys[1];
  }

  static isReversing = (key1: string, key2: string): boolean => {
    return key1 > key2;
  };
};