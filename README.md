# NFT airdrop distribution contract

Gas efficient distribution contract.

## :bookmark_tabs: How to run

```
yarn 
```

```
npx hardhat test
```

## :bookmark_tabs: Concept

Contract uses offchain generated Merkle Proofs to validate claim requests. Bitmap dictionarry allows efficiently track significant a lists of airdropped account.

## :bookmark_tabs: Nice to have

There's no check if contract owns NFTs to distribute, but we are smart enough to make sure it has NFTs.

## :see_no_evil: Issues

Use at your own risk)
