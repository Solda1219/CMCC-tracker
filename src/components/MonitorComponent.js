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
    pancakePairABI, tokenABI, powABI, distributorAddress, distributorABI, CMCCABI, DivPayTokenABI
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
// import { Slider, RangeSlider } from 'rsuite';
import {
    Slider,
    SliderInput,
    SliderTrack,
    SliderRange,
    SliderHandle,
    SliderMarker,
  } from "@reach/slider";
  import "@reach/slider/styles.css";

function MonitorComponent(props) {
    const { walletAddress, web3Instance, openTransak, setWalletAddress } = React.useContext(TradeContext);

    const [monitorPrice, setMonitorPrice] = React.useState(5000);
    const [cmccPrice, setCmccPrice]= React.useState(1);
    const [weeklyMonitor, setWeeklyMonitor]= React.useState(0);
    const [monthlyMonitor, setMonthlyMonitor]= React.useState(0);
    const requireTokenImg = (address) =>{
        try {
            return require("../images/tokens/"+address+".jpg").default;
        }
        catch (e) {
            return require("../images/tokens/default.jpg").default;
        }
    }
    const getCMCCPrice= async()=>{
        const contractInstance = getContractInstance(pancakeRouterABI, routerAddress);
        var amountOuts= await contractInstance.methods.getAmountsOut('1000000000000000000', [addressSet['CMCC'], addressSet['BNB'], addressSet['USDT']]).call();
        var ss= parseInt(amountOuts[2])/Math.pow(10, 18);
        setCmccPrice(ss.toFixed(6));
        return ss.toFixed(6);
    }
    const init= async()=>{
        var cmcPrice= await getCMCCPrice();
        var weeklymoni= cmcPrice*5000*4/100;
        var monthlymoni= cmcPrice*5000*3/100;
        setWeeklyMonitor(weeklymoni.toFixed(6));
        setMonthlyMonitor(monthlymoni.toFixed(6));
    }

    React.useEffect(async () => {
        await init();
    },[walletAddress]);
    const handleSlide= (e)=>{
        setMonitorPrice(e)
        var weeklymoni= cmccPrice*e*4/100;
        var monthlymoni= cmccPrice*e*3/100;
        setWeeklyMonitor(weeklymoni.toFixed(6));
        setMonthlyMonitor(monthlymoni.toFixed(6));
    }
    
    return (
        <>
        
            <div className="swap-container">
                <div className="rewards-header">
                    <div> TRACK MONITOR</div>
                    <div className="social-links" style= {{marginTop:'30px'}}>
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
                        <div className="col-sm-12 col-md-12 rewards-content" style= {{marginTop:'30px'}}>

                            <Slider style={{background: '#132d49'}} onChange= {handleSlide} min={5000} max={1000000} step={1000} />

                        </div>
                        <div className="col-sm-12 col-md-12 rewards-content">
                            <div className= "token-field">
                                <span><img width= "30px" src={requireTokenImg(addressSet['CMCC'])}/>CMCC BALANCE</span>
                            </div>
                            <div className= "value-field">
                                <span>{monitorPrice}</span>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 rewards-content">
                            <div className= "token-field">
                                <span><img width= "30px" src={requireTokenImg(addressSet['USDT'])}/> WEEKLY REWARD</span>
                            </div>
                            <div className= "value-field">
                                <span>{weeklyMonitor}</span>
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
                                <span><img width= "30px" src={requireTokenImg(addressSet['USDT'])}/> MONTHLY REWARD</span>
                            </div>
                            <div className= "value-field">
                                <span>{monthlyMonitor}</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
        
    );
}

export default MonitorComponent;