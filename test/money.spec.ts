import {Bank, Sum, Money} from '../src/money';

// 주기는 다음과 같다.
// 1. 작은 테스트를 하나 추가한다
// 2. 모든 테스트를 실행해서 테스트가 실패하는 것을 확인한다
// 3. 조금 수정한다.
// 4. 모든 테스트를 실행해서 테스트가 성공하는 것을 확인한다.
// 5. 중복을 제거하기 위해 리팩토링 한다.

describe('Test 통화 개념', ()=>{
  test('For USD', ()=>{
    expect('USD').toEqual(Money.dollar(1).currency);
  });

  test('For CHF', ()=>{
    expect('CHF').toEqual(Money.franc(1).currency);
  });
});

describe('Test times()', ()=>{
  test('For Dollar', ()=>{
    const five = Money.dollar(5);

    expect(
      five.times(2).equals(Money.dollar(10))
    ).toBeTruthy();

    expect(
      five.times(3).equals(Money.dollar(15))
    ).toBeTruthy();
  });

  test('For Franc', ()=>{
    const five = Money.franc(5);

    expect(
      five.times(2).equals(Money.franc(10))
    ).toBeTruthy();

    expect(
      five.times(3).equals(Money.franc(15))
    ).toBeTruthy();
  });

  test('For Sum expression', () => {
    const bank = new Bank;
    bank.addRate('CHF', 'USD', 2);

    const fiveDollar = Money.dollar(5);
    const tenFranc = Money.franc(10);

    const sum = new Sum(fiveDollar, tenFranc).times(2);
    const result: Money = bank.reduce(sum, 'USD');

    expect(result.equals(Money.dollar(20))).toBeTruthy();
  });
});

describe('Test equal()', ()=>{
  test('True Dollar', ()=>{
    const A = Money.dollar(5);
    const B = Money.dollar(5);
    expect(A.equals(B)).toBeTruthy();
  });

  test('False Dollar', ()=>{
    const A = Money.dollar(5); // 테스트의 삼각측량전략
    const B = Money.dollar(6); // 두 개의 테스트 코드, 하나의 구현으로
    expect(A.equals(B)).toBeFalsy(); // 동치성을 일반화 한다.
  });

  test('True Franc', ()=>{
    const five = Money.franc(5);
    expect(five.equals(Money.franc(5))).toBeTruthy();
  });

  test('False Franc', ()=>{
    const five = Money.franc(5);
    expect(five.equals(Money.franc(6))).toBeFalsy();
  });

  test('Dollar and Franc are different', ()=>{
    const fiveDollar = Money.dollar(5);
    const fiveFranc = Money.franc(5);

    expect(fiveDollar.equals(fiveFranc)).toBeFalsy();
    expect(fiveFranc.equals(fiveDollar)).toBeFalsy();
  });
});

describe('Test simple addition', ()=>{
  test('For dollar', ()=>{
    const sum = new Sum(Money.dollar(3), Money.dollar(4));
    const bank = new Bank();
    const result= bank.reduce(sum, 'USD');
    expect(result.equals(Money.dollar(7))).toBeTruthy();
  });

  test('Mixed addition $5 + 10CHF = $10', () => {
    const bank = new Bank;
    bank.addRate('CHF', 'USD', 2);

    const result = bank.reduce(
      new Sum(Money.dollar(5), Money.franc(10)), 'USD'
    );

    expect(result.equals(Money.dollar(10))).toBeTruthy();
  })

  test('Sum Plus Money', () => {
    const bank = new Bank;
    bank.addRate('CHF', 'USD', 2);

    const fiveDollar = Money.dollar(5);
    const tenFranc = Money.franc(10);

    const sum = new Sum(fiveDollar, tenFranc).plus(fiveDollar);
    const result: Money = bank.reduce(sum, 'USD');

    expect(result.equals(Money.dollar(15))).toBeTruthy();
  });
});

describe('Test bank reduce', ()=>{
  test('Dollar reduce', ()=>{
    const bank = new Bank();
    const result = bank.reduce(Money.dollar(1), 'USD');

    expect(result.equals(Money.dollar(1))).toBeTruthy();
  });

  test('Reduce money dollar to dollar', () => {
    const bank = new Bank();
    bank.addRate('USD', 'USD', 2);

    const result = bank.reduce(Money.dollar(2), 'USD');
    expect(result.equals(Money.dollar(2))).toBeTruthy();
  });

  test('Reduce money franc to dollar', () => {
    const bank = new Bank();
    bank.addRate('CHF', 'USD', 2);

    const result = bank.reduce(Money.franc(2), 'USD');
    expect(result.equals(Money.dollar(1))).toBeTruthy();
  });

  test('Reduce money dollar to franc', () => {
    const bank = new Bank();
    bank.addRate('CHF', 'USD', 2);

    const result = bank.reduce(Money.dollar(1), 'CHF');
    expect(result.equals(Money.franc(2))).toBeTruthy();
  });
});
