// import { getERC5725Contract, supportsIERC5725 } from '@ape.swap/erc-5725'
import { getERC5725Contract, supportsIERC5725 } from '../src'
import { ethers } from 'ethers';

async function script() {
    const CONFIG = {
        vestingNFT: '0xB75BE16984A27d3023e1cF744E2587e9Aa8750c9',
        tokenId: 1,
    }
    const provider = await ethers.getDefaultProvider('https://bscrpc.com');
    const erc5725Contract = getERC5725Contract(CONFIG.vestingNFT, provider);
    const supportsInterface = await supportsIERC5725(CONFIG.vestingNFT, provider)

    const { vestingStart, vestingEnd } = await erc5725Contract.vestingPeriod(CONFIG.tokenId)

    console.dir({vestingStart: vestingStart.toString(), vestingEnd: vestingEnd.toString(), supportsInterface})
}

(async function () {
    try {
        await script();
        console.log('🎉');
        process.exit(0);
    }
    catch (e) {
        console.error('Error running script.')
        console.dir(e);
        process.exit(1);
    }
}());