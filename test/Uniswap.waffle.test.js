const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');

describe("UniSwap Test", () => {
    beforeEach(async() => {
        const [masterKey] = await ethers.getSigners();

        const Factory = await ethers.getContractFactory("UniswapV2Factory");
        //const factory = await Factory.deploy("0x0000000000000000000000000000000000000000"); //disable fee
        const factory = await Factory.deploy(masterKey.address); //disable fee
        await factory.deployed();
        console.log("Factory deployed to:", factory.address);

        const amount = 1000000000000;
        const MockERC20 = await ethers.getContractFactory("MockERC20");
        const weth = await MockERC20.deploy("Wrapped ETH", "WETH", amount);
        await weth.deployed();
        console.log("WETH deployed to:", weth.address)

        const tokenA = await MockERC20.deploy("Mock tokenA", "TA", amount);
        await tokenA.deployed();
        const tokenB = await MockERC20.deploy("Mock tokenB", "TB", amount * 5);
        await tokenB.deployed();

        const Router02 = await ethers.getContractFactory("UniswapV2Router02");
        const router02 = await Router02.deploy(factory.address, weth.address);
        await router02.deployed();
        console.log("Router02 deployed to:", router02.address);

        this.factory = factory;
        this.router = router02;
        this.weth = weth;
        this.tokenA = tokenA;
        this.tokenB = tokenB;
    }); 
    const endTS =  10000000000;

    it("test add liquid", async() => {
        const Pair = await ethers.getContractFactory("UniswapV2Pair");
        const [masterKey] = await ethers.getSigners();
        await this.factory.createPair(this.tokenA.address, this.tokenB.address);
        const address = await this.factory.getPair(this.tokenA.address, this.tokenB.address);
        const pair = await Pair.attach(address);

        await this.tokenA.approve(this.router.address, 1000);
        await this.tokenB.approve(this.router.address, 5000);
        await this.router.addLiquidity(this.tokenA.address, this.tokenB.address, 1000, 5000, 0, 0, masterKey.address, endTS);
        expect(await pair.getReserves()).to.satisfies(function(elems){
            return elems[0].toNumber() == 1000 && elems[1].toNumber() == 5000;
        });
        expect(await pair.balanceOf(masterKey.address)).to.equal(1236);

        await this.tokenA.approve(this.router.address, 2000);
        await this.tokenB.approve(this.router.address, 3000);
        await expectRevert(
            this.router.addLiquidity(this.tokenA.address, this.tokenB.address, 2000, 3000, 2000, 3000, masterKey.address, endTS),
            "VM Exception while processing transaction: revert UniswapV2Router: INSUFFICIENT_A_AMOUN");
        expect(await pair.balanceOf(masterKey.address)).to.equal(1236);
        expect(await pair.totalSupply()).to.equal(2236);
        await this.router.addLiquidity(this.tokenA.address, this.tokenB.address, 2000, 3000, 600, 3000, masterKey.address, endTS);
        expect(await pair.getReserves()).to.satisfies(function(elems){
            return elems[0].toNumber() == 1600 && elems[1].toNumber() == 8000;
        });
        expect(await pair.balanceOf(masterKey.address)).to.equal(1236 + 1341); //totalSupply(2236) * 0.6

    });
})