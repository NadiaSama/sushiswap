const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  const accounts = await ethers.getSigners();
  const masterKey = accounts[accounts.length - 1];
  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(masterKey.address);
  await factory.deployed()
  console.log("Factory deployed to:", factory.address);

  const SushiToken = await ethers.getContractFactory("SushiToken");
  const sushitToken = await SushiToken.deploy();
  await sushitToken.deployed();
  console.log("SushiToken deployed to:", sushitToken.address);

  const SushiBar = await ethers.getContractFactory("SushiBar");
  const sushiBar = await SushiBar.deploy(sushitToken.address);
  await sushiBar.deployed();
  console.log("SushiBar deployed to:", sushiBar.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
