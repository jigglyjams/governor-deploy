import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

import type { MyGovernor } from "../../types";
import type { MyGovernor__factory } from "../../types";

import type { Nance } from "../../types";
import type { Nance__factory } from "../../types"

task("deploy:Dao")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const tokenFactory: Nance__factory = <Nance__factory>await ethers.getContractFactory("Nance");
    const signers: SignerWithAddress[] = await ethers.getSigners();
    console.log(signers[0].address);
    const token = <Nance>await tokenFactory.connect(signers[0]).deploy();
    await token.deployed();
    console.log("Token deployed to: ", token.address);

    const governorFactory: MyGovernor__factory = <MyGovernor__factory>await ethers.getContractFactory("MyGovernor");
    const governor: MyGovernor = <MyGovernor>await governorFactory.connect(signers[0]).deploy(token.address);
    const address = (await governor.deployed()).address;
    console.log("Governor deployed to: ", address);

    await token.safeMint(signers[0].address); // mint 1 token to the deployer
  });
