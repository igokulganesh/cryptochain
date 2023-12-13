import Wallet from "../wallet";
import { verifySignature } from "../utils";
import Transaction from "../wallet/transaction";
import BlockChain from "../blockchain";
import { INITIAL_BALANCE } from "../config";

describe("Wallet()", () => {
  let wallet;

  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has a `balance`", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has a `publicKey`", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("Signing data", () => {
    const data = "some-data";

    it("verifies a valid signature", () => {
      expect(
        verifySignature({
          data,
          publicKey: wallet.publicKey,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });

    it("does not verify an invalid signature", () => {
      expect(
        verifySignature({
          data,
          publicKey: wallet.publicKey,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });

  describe("createTransaction()", () => {
    describe("and the amount exceeds the balance", () => {
      it("throws an error", () => {
        expect(() =>
          wallet.createTransaction({ amount: 999999, recipient: "dummy" })
        ).toThrow("Amount exceeds balance");
      });
    });

    describe("and the amount valid", () => {
      let transaction, amount, recipient;

      beforeEach(() => {
        amount = 50;
        recipient = "dummy";
        transaction = wallet.createTransaction({ amount, recipient });
      });

      it("creates an instance of `Transaction`", () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it("matches the transaction input with the wallet", () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it("output the amount the recipient", () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });

    describe("and a chain is passed", () => {
      it("calls Wallet.CalculateBalance method", () => {
        const calculateBalanceMock = jest.fn();

        const originalMethod = Wallet.calculateBalance;
        Wallet.calculateBalance = calculateBalanceMock;

        wallet.createTransaction({
          recipient: "some",
          amount: 50,
          chain: new BlockChain().chain,
        });

        expect(calculateBalanceMock).toHaveBeenCalled();

        Wallet.calculateBalance = originalMethod;
      });
    });
  });

  describe("calculateBalance()", () => {
    let blockchain;

    beforeEach(() => {
      blockchain = new BlockChain();
    });

    describe("and the there are no outputs for the wallet", () => {
      it("returns the `INITIAL_BALANCE`", () => {
        const balance = Wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.publicKey,
        });
        expect(balance).toEqual(INITIAL_BALANCE);
      });
    });

    describe("and the there are outputs for the wallet", () => {
      let transaction_1, transaction_2;

      beforeEach(() => {
        transaction_1 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 100,
        });

        transaction_2 = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 50,
        });

        blockchain.addBlock({ data: [transaction_1, transaction_2] });
      });

      it("adds the sum of all outputs to the wallet balance", () => {
        const balance = Wallet.calculateBalance({
          chain: blockchain.chain,
          address: wallet.publicKey,
        });
        const actualBalance =
          INITIAL_BALANCE +
          transaction_1.outputMap[wallet.publicKey] +
          transaction_2.outputMap[wallet.publicKey];

        expect(balance).toEqual(actualBalance);
      });

      describe("and the wallet has made a transaction", () => {
        let recentTransaction;

        beforeEach(() => {
          recentTransaction = wallet.createTransaction({
            amount: 50,
            recipient: "random",
          });
          blockchain.addBlock({ data: [recentTransaction] });
        });

        it("returns the output amount of the recent transaction", () => {
          const balance = Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          });

          expect(balance).toEqual(
            recentTransaction.outputMap[wallet.publicKey]
          );
        });

        describe("and there are outputs next to and after the recent transaction", () => {
          let sameBlockTransaction, nextBlockTransaction;

          beforeEach(() => {
            recentTransaction = wallet.createTransaction({
              recipient: "new-address",
              amount: 10,
            });

            sameBlockTransaction = Transaction.rewardTransaction({
              minerWallet: wallet,
            });

            blockchain.addBlock({
              data: [recentTransaction, sameBlockTransaction],
            });

            nextBlockTransaction = new Wallet().createTransaction({
              recipient: wallet.publicKey,
              amount: 75,
            });

            blockchain.addBlock({
              data: [nextBlockTransaction],
            });
          });

          it("includes the output amounts in the returned balance", () => {
            const balance = Wallet.calculateBalance({
              chain: blockchain.chain,
              address: wallet.publicKey,
            });
            const actualBalance =
              recentTransaction.outputMap[wallet.publicKey] +
              sameBlockTransaction.outputMap[wallet.publicKey] +
              nextBlockTransaction.outputMap[wallet.publicKey];

            expect(balance).toEqual(actualBalance);
          });
        });
      });
    });
  });
});
