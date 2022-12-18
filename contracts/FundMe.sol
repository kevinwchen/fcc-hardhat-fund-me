// SPDX-License-Identifier: MIT

// Pragma Statements
pragma solidity ^0.8.8;

// Import Statements
import "./PriceConverter.sol";

// Error Codes
error FundMe__NotOwner();

// Interfaces, Libraries, Contracts
// none

/** @title A contract for crowd funding
 * @author Kevin
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint256;

    // State Variables
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;
    address public immutable i_owner; // variable set only once but not on the same line as initialisation can be set as immutable
    AggregatorV3Interface public priceFeed;

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert FundMe__NotOwner();
        }
        _; // underscore represents the code of the function being modified
    }

    // Functions
    constructor(address priceFeedAddress) {
        // constructors are functions that get called immediately after deploying the contract
        i_owner = msg.sender; // sender of constructor is the address that deployed the contract
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /**
     * @notice This function funds this contract
     * @dev This implements price feeds as our library
     */
    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // 1. How do we send ETH to this contract?

        // require(boolean, revert message)
        // Reverting undoes any previous action, send remaining gas back
        require(
            msg.value.getConversionRate(priceFeed) >= MINIMUM_USD,
            "Didn't send enough!"
        ); // 1e18 wei = 1ETH
        funders.push(msg.sender); // add funder address to funders list
        addressToAmountFunded[msg.sender] = msg.value; // add funder address to mapping to amount funded
    }

    function withdraw() public onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex]; // get address for each funder on the list
            addressToAmountFunded[funder] = 0; // reset amount funded to zero
        }

        // Reset the array
        funders = new address[](0); // (0) means 0 objects upon declaration
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }
}
