const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1") // 1 ETH

    beforeEach(async function () {
        // deploy FundMe contract using hardhat deploy
        // const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer // extract deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer) // gets most recent FundMe contract
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        )
    })

    describe("constructor", async function () {
        it("Sets the aggregator addresses correctly", async function () {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    // yarn add --dev ethereum-waffle
    describe("fund", async function () {
        it("Fails if not enough ETH sent", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to send more ETH!"
            )
        })
        it("Updates the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
    })
})
