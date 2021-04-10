const ProductManagement = artifacts.require('ProductManagement');
const TransitManagement = artifacts.require('TransitManagement');

module.exports = async deployer => {
    // Deploying ProductManagement Smart Contract and then storing the instance of deployed ProductManagement Smart Contract
    await deployer.deploy(ProductManagement);
    const productInstance = await ProductManagement.deployed();

    // Deploying TransitManagement Smart Contract and then storing the instance of deployed TransitManagement Smart Contract
    await deployer.deploy(TransitManagement, productInstance.address);
    const transitInstance = await TransitManagement.deployed();

    productInstance.setTransitManager(transitInstance.address);
}