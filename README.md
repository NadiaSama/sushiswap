# README
this repository is used to learn sushiswap code and smart contract development.

it fork from [sushiswap/sushiswap](#https://github.com/sushiswap/sushiswap) with the following changes

* use `HardHat(buidler)`,`ethers.js`,`Waffle` instead of `web3.js`, `truffle`


## install
```bash
yarn
```

## deploy
start harhat testnet
```bash
npx hardhat node
```

open another console and running deploy script
```bash
npx hardhat run --network localhost scripts/deploy.js
```
