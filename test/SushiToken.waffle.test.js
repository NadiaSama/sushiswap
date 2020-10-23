const { expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SushiToken", function(){
    beforeEach(async() => {
        const alice = await ethers.getSigners();
        const Sushi = await ethers.getContractFactory("SushiToken", alice);
        const sushi = await Sushi.deploy();
        await sushi.deployed();
        this.sushi = sushi;
    })
    it("test sushitoken", async() => {
        const [alice, bod, none] = await ethers.getSigners();
        await this.sushi.mint(alice.address, 100, {"from": alice.address});
        await this.sushi.mint(bod.address, 1000, {"from": alice.address});
        await expectRevert(
            this.sushi.mint(none.address, 200, {"from": none.address}),
            'Contract with a Signer cannot override from (operation="overrides.from", code=UNSUPPORTED_OPERATION, version=contracts/5.0.5)',
        );

        expect(await this.sushi.totalSupply()).to.equal(1100);
        expect(await this.sushi.balanceOf(alice.address)).to.equal(100);
        expect(await this.sushi.balanceOf(bod.address)).to.equal(1000);
        expect(await this.sushi.balanceOf(none.address)).to.equal(0);
    })
});