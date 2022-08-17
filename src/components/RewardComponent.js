import * as React from "react";
import '../css/RewardComponent.css';
import telegram from '../images/telegram.png';
import twitter from '../images/twitter.png';
import facebook from '../images/facebook.png';
import website from '../images/website.png';
import TradeContext from '../context/TradeContext';
import { addressSet, walletSet } from '../constant/addressSet';
import {
    pancakeRouterABI, routerAddress,
    pancakePairABI, tokenABI, powABI, distributorAddress, distributorABI, CMCCABI
} from '../constant/contractABI';

import {
    getContractInstance, getAmountOut, getDecimal
} from '../support/coreFunc';

import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
  } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { easeQuadInOut } from "d3-ease";
import { Row, Col } from 'react-grid-system';

function RewardComponent(props) {
    const [holding, setHolding] = React.useState(0);
    const [rewarded, setRewarded] = React.useState(0);
    const [weeklyRewardInfo, setWeeklyRewardInfo] = React.useState({0: "", 1: "", 2: "", 3: "0", 4: "0"});
    const [monthlyRewardInfo, setMonthlyRewardInfo]= React.useState({0: "", 1: "", 2: "", 3: "0", 4: "0"});
    const [inputAddress, setInputAddress] = React.useState('');
    const { walletAddress, web3Instance, openTransak, setWalletAddress } = React.useContext(TradeContext);
    const requireTokenImg = (address) =>{
        try {
            return require("../images/tokens/"+address+".jpg").default;
        }
        catch (e) {
            return require("../images/tokens/default.jpg").default;
        }
    }

    const getContractInstanceForMetaMask = (contractABI, contractAddress) => {
        if (web3Instance) {
            let contract = new web3Instance.eth.Contract(contractABI, contractAddress);
            return contract;
        }
        else {
            return null;
        }
    }
    const handleSearch = async ()=>{
        setWalletAddress(inputAddress);
        await init();
        console.log('inputAddress', inputAddress)
    }
    const setCMCCBalance = async ()=>{
        if(!walletAddress){
            setHolding(0);
        }
        else{
            var tokenContract= getContractInstance(tokenABI, addressSet['CMCC']);
            var decimals= await getDecimal(addressSet['CMCC']);
            var result= await tokenContract.methods.balanceOf(walletAddress).call()
            var balance = parseInt(result) / Math.pow(10, decimals);
            console.log("CMCC", balance);
            setHolding(balance);
        }
        
    }
    const getWeeklyAccountDividendsInfo= async ()=>{
        if(walletAddress){
            var cmccContract= getContractInstance(CMCCABI, addressSet['CMCC']);
            var result= await cmccContract.methods.getWeeklyAccountDividendsInfo(walletAddress).call()
            setWeeklyRewardInfo(result);
            console.log("week", result)
        }
    }

    const getMonthlyAccountDividendsInfo= async ()=>{
        if(walletAddress){
            var cmccContract= getContractInstance(CMCCABI, addressSet['CMCC']);
            var result= await cmccContract.methods.getMonthlyAccountDividendsInfo(walletAddress).call()
            setMonthlyRewardInfo(result);
            console.log("month", result)
        }
    }
    const handleBuy= ()=>{
        window.open("https://pancakeswap.finance/swap?inputCurrency=0xfa134985a4d9d10dbf2d7dcf811055aa25d0807c");
    }
    // const getWeeklyTotalDividendsDistributed= async ()=>{
    //     var cmccContract= getContractInstance(CMCCABI, addressSet['CMCC']);
    //     var result= await cmccContract.methods.getWeeklyTotalDividendsDistributed().call()
    //     console.log('total', result)
    // }
    // const getMonthlyTotalDividendsDistributed= async ()=>{
    //     var cmccContract= getContractInstance(CMCCABI, addressSet['CMCC']);
    //     var result= await cmccContract.methods.getMonthlyTotalDividendsDistributed().call()
    //     console.log('total month', result)
    // }
    //busd rewared.
    // var reward= parseInt(data.totalRealised)/10**18;
    // setRewarded(reward.toFixed(6));
    const init= async()=>{
        await setCMCCBalance();
        // await setRewardAndPercent();
        await getWeeklyAccountDividendsInfo();
        await getMonthlyAccountDividendsInfo();
    }

    React.useEffect(async () => {
        await init();
    },[walletAddress]);

    return (
        <>
            <div className="swap-container">
                <div className="rewards-header">
                    <div>REWARDS TRACKER</div>
                    <div className="rewards-search">
                        <input
                            // type= "text"
                            className="address-value-input"
                            placeholder="Paste your BSC wallet address"
                            value={inputAddress}
                            onChange={(e) => setInputAddress(e.target.value)}
                        />&nbsp;&nbsp;
                        {
                            !web3Instance&&<button className="addr-sch-btn" onClick= {handleSearch} >
                                GO
                            </button>
                        }
                        {
                            web3Instance&&<button className="addr-sch-btn" disabled style= {{backgroundColor: "#808080"}} onClick= {handleSearch} >
                                Connected
                            </button>
                        }
                    </div>
                    <div className="social-links">
                        <a href="https://www.facebook.com/BuyCMCcoin/" target="_blank"><img width="50px" src={facebook}/></a>
                        <a href="https://twitter.com/CMCCOIN2000" target="_blank"><img width="50px" src={twitter}/></a>
                        <a href="https://t.me/CMC_COIN_1" target="_blank"><img width="50px" src={telegram}/></a>
                        <a href="https://cmccoin.io/" target="_blank"><img width="50px" src={website}/></a>
                    </div>
                </div>
                <div className="wallet-body">
                    <div className="row rewards-body-container">
                        {/* <button className="swap-tokenList-btn" onClick={() => handleClaim()} >
                                Claim Manually
                            </button> */}
                        <div className="col-sm-12 col-md-12 rewards-content">
                            <div className= "token-field">
                                <span><img width= "30px" src={requireTokenImg(addressSet['CMCC'])}/>CMCC BALANCE</span>
                            </div>
                            <div className= "value-field">
                                <span>{holding}</span>
                            </div>
                        </div>

                        <div className="col-sm-6 col-md-6 rewards-content">
                            <div className= "token-field">
                                <span><img width= "30px" src={requireTokenImg(addressSet['USDT'])}/> WEEKLY USDT CLAIMED</span>
                            </div>
                            <div className= "value-field">
                                <span>{(parseInt(weeklyRewardInfo['4'])/Math.pow(10, 18)).toFixed(6)}</span>
                            </div>
                            {/* <div className= "token-field">
                                <span><img width= "30px" src={requireTokenImg(addressSet['USDT'])}/> ACCUMULATED REWARD <span style= {{color: 'yellow'}}>&nbsp;&nbsp;{notClaimed}</span></span>
                                <div className= "claim-field">
                                    {web3Instance&&notClaimed!=0&&(<button className="claim" onClick={() => handleClaim()} >
                                        Claim Manually
                                    </button>)}
                                    {web3Instance&&notClaimed==0&&(<button disabled className="claim" onClick={() => handleClaim()} >
                                        No Money to Claim
                                    </button>)}
                                    {!web3Instance&&(<button disabled className="claim" onClick={() => handleClaim()} >
                                        CLAIM
                                    </button>)}
                                </div>
                            </div> */}
                        </div>
                        <div className="col-sm-6 col-md-6 rewards-content">
                            <div className= "token-field">
                                <span><img width= "30px" src={requireTokenImg(addressSet['USDT'])}/> WEEKLY USDT UNCLAIMED</span>
                            </div>
                            <div className= "value-field">
                                <span>{(parseInt(weeklyRewardInfo['3'])/Math.pow(10, 18)).toFixed(6)}</span>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 rewards-content">
                            <div className= "token-field">
                                <span><img width= "30px" src={requireTokenImg(addressSet['USDT'])}/> MONTHLY USDT CLAIMED</span>
                            </div>
                            <div className= "value-field">
                                <span>{(parseInt(monthlyRewardInfo['4'])/Math.pow(10, 18)).toFixed(6)}</span>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 rewards-content">
                            <div className= "token-field">
                                <span><img width= "30px" src={requireTokenImg(addressSet['USDT'])}/> MONTHLY USDT UNCLAIMED</span>
                            </div>
                            <div className= "value-field">
                                <span>{(parseInt(monthlyRewardInfo['3'])/Math.pow(10, 18)).toFixed(6)}</span>
                            </div>
                        </div>

                        <div className= "col-sm-4 col-md-4 rewards-content">
                        
                        </div>
                        <div className= "col-sm-4 col-md-4 rewards-content" style= {{marginTop: '40px'}}>
                            <button onClick={handleBuy} className="addr-sch-btn" style= {{margin: 'auto'}} >
                                BUY CMCC
                            </button>
                        </div>
                        <div className= "col-sm-4 col-md-4 rewards-content">
                        
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
        
    );
}

export default RewardComponent;