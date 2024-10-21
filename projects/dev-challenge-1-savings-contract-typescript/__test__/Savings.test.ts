import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk, { makePaymentTxnWithSuggestedParamsFromObject } from 'algosdk';
import { SavingsClient } from '../contracts/clients/SavingsClient';

const fixture = algorandFixture();
algokit.Config.configure({ populateAppCallResources: true });

let appClient: SavingsClient;
const TARGET_AMOUNT = 10;

describe('Savings', () => {
  beforeEach(fixture.beforeEach);
  let defaultAccount: algosdk.Account;
  let secondAccount: algosdk.Account;
  let algod: algosdk.Algodv2;

  beforeAll(async () => {
    await fixture.beforeEach();
    const { testAccount } = fixture.context;
    const { algorand } = fixture;
    defaultAccount = testAccount;
    algod = algorand.client.algod;

    secondAccount = await algokit.getOrCreateKmdWalletAccount(
      {
        name: 'dao-sender',
        fundWith: algokit.algos(20),
      },
      algorand.client.algod,
      algorand.client.kmd
    );

    appClient = new SavingsClient(
      {
        sender: testAccount,
        resolveBy: 'id',
        id: 0,
      },
      algorand.client.algod
    );
  });

  test('No zero target amount', async () => {
    await expect(appClient.create.createApplication({ targetAmount: 0 })).rejects.toThrow();
  });

  test('Target amount set to global state after creation', async () => {
    await appClient.create.createApplication({ targetAmount: algokit.algos(TARGET_AMOUNT).microAlgos });
    const globalState = await appClient.getGlobalState();
    await appClient.appClient.fundAppAccount({ amount: algokit.microAlgos(200_000) });
    expect(globalState.targetAmount?.asNumber()).toEqual(algokit.algos(TARGET_AMOUNT).microAlgos);
  });

  test('Cannot delete if target amount is not reached', async () => {
    await expect(
      appClient.delete.deleteApplication({}, { sendParams: { fee: algokit.microAlgos(2_000) } })
    ).rejects.toThrow();
  });

  test('Only creator can delete', async () => {
    // Fund savings smart contract with 5 algos from second account
    const suggestedParams = await algokit.getTransactionParams(undefined, algod);
    const sendTransaction = makePaymentTxnWithSuggestedParamsFromObject({
      from: secondAccount.addr,
      to: (await appClient.appClient.getAppReference()).appAddress,
      amount: algokit.algos(5).microAlgos,
      suggestedParams,
    });
    const signedTxn = sendTransaction.signTxn(secondAccount.sk);
    await algod.sendRawTransaction(signedTxn).do();

    await expect(
      appClient.delete.deleteApplication({}, { sender: secondAccount, sendParams: { fee: algokit.microAlgos(2_000) } })
    ).rejects.toThrow();
  });

  test('Creator receives all savings after successful delete', async () => {
    const creatorBalanceBeforeDelete = (await algod.accountInformation(defaultAccount.addr).do()).amount;

    // Fund savings smart contract with 5 algos from first account
    const suggestedParams = await algokit.getTransactionParams(undefined, algod);
    const sendTransaction = makePaymentTxnWithSuggestedParamsFromObject({
      from: defaultAccount.addr,
      to: (await appClient.appClient.getAppReference()).appAddress,
      amount: algokit.algos(5).microAlgos,
      suggestedParams,
    });
    const signedTxn = sendTransaction.signTxn(defaultAccount.sk);
    await algod.sendRawTransaction(signedTxn).do();

    await appClient.delete.deleteApplication({}, { sendParams: { fee: algokit.microAlgos(2_000) } });

    const creatorBalanceAfterDelete = (await algod.accountInformation(defaultAccount.addr).do()).amount;

    expect(creatorBalanceAfterDelete).toBeGreaterThan(creatorBalanceBeforeDelete);
  });
});
