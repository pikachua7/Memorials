import React, { Component } from "react";
import Web3 from "web3";
import TroveI from "../../abis/NFT.json"; 
import TroveIt from "../../abis/Marketplace.json";
import { FingerprintSpinner } from "react-epic-spinners";
import Favorite from "@material-ui/icons/Favorite";
import Portis from '@portis/web3';
import { NFTStorage, File, Blob } from 'nft.storage';


const style = {
    content: {
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        color: "white",
        padding: 7,
        borderRadius: 20,
    },
};

class Feed extends Component {
    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    }


    async loadBlockchainData() {

        const web3 = window.web3;
        // const portis = new Portis('c0f465f7-8289-42c1-98a6-cec427ceecc6', 'maticMumbai');
        // const web3 = new Web3(portis.provider);

        // Initialize your dapp here like getting user accounts etc
        // Load account
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        navigator.geolocation.getCurrentPosition(
            position => this.setState({
              cr_latitude: position.coords.latitude,
              cr_longitude: position.coords.longitude
            }),
            err => console.log(err)
          );
        // Network ID
        const networkId = await web3.eth.net.getId();
        const networkData = TroveIt.networks[networkId];
        const net = TroveI.networks[networkId];

        if (networkData && net) {
            const troveit = new web3.eth.Contract(TroveIt.abi, networkData.address);
            this.setState({ troveit });
            const trovei = new web3.eth.Contract(TroveI.abi, networkData.address);
            this.setState({ trovei });
            const PostCount = await troveit.methods.nftCounter().call();
            console.log(PostCount)
            this.setState({ PostCount: PostCount })
            for (var i = 5; i <= 5; i++) {
                //feedPost : assetID
                const assetID = await troveit.methods.premiumNFT(i).call()
                console.log(assetID)
                const feedPost = await trovei.methods.tokenURI(assetID).call()
                console.log(feedPost)
                const slicedUrl = `https://ipfs.io/ipfs/${feedPost.slice(7,feedPost.length)}`
                console.log(slicedUrl)
                const response = await fetch(slicedUrl);
                console.log(response)
                const json = await response.json();
                const latitude= json.properties.latitude
                const longitude=json.properties.longitude

                const imageUrl=json.image.slice(7,json.image.length-10)
                console.log(imageUrl)
                const finalUrl = `https://${imageUrl}.ipfs.dweb.link/trial.jpg`
                console.log(finalUrl)

                const Post=[i,json.name,json.description,finalUrl,latitude,longitude]
                console.log(Post,this.state.feedPosts)
                
                this.setState({
                    feedPosts: [...this.state.feedPosts, [Post]],
                });
                console.log(Post,this.state.feedPosts)
            }

            this.setState({ loading: false });


        } else {
            window.alert("TroveIt contract not deployed to detected network.");
        }

    }

    constructor(props) {
        super(props);
        this.state = {
            account: "",
            troveit: null,
            trovei: null,
            PostCount: 0,
            feedPosts: [],
            loading: true,
            cr_latitude:'',
            cr_longitude:''
        };

    }

    render() {
        return (
            <div
                style={{ width: "100%", height: "100%", backgroundRepeat: "inherit" }}
            >
                {this.state.loading ? (
                    <div className="center mt-19">
                        {/* loader */}
                        <br></br>
                        {/* <FingerprintSpinner
                            style={{ width: "100%" }}
                            color="grey"
                            size="100"
                        /> */}
                        <img src='https://media.giphy.com/media/XeA5bZwGCQCxgKqKtL/giphy.gif' ></img>
                    </div>
                ) : (
                    <div>
                        <div className="about">
                            <div class="container">
                                {/* <h1>{this.state.cr_latitude}</h1> */}
                                <br></br>
                                <div
                                    class="col-lg-12 ml-auto mr-auto"
                                    style={{ maxWidth: "780px" }}
                                >
                                    {console.log(this.state.cr_latitude,this.state.cr_longitude)}
                                    {this.state.feedPosts.map((feedPost) => {
                                        if (this.state.cr_latitude===feedPost[0][4] && this.state.cr_longitude===feedPost[0][5]) {
                                            
                                        return (
                                            <div className="card mb-4">
                                                
                                                <div className="card-header">
                                                    <small className="text-muted">{feedPost[0][1]}</small>
                                                </div>
                                                <ul
                                                    id="imageList"
                                                    className="list-group list-group-flush"
                                                >
                                                    <li className="list-group-item">
                                                        <p class="text-center">
                                                            {this.state.cr_latitude - feedPost[0][4]},{this.state.cr_longitude}
                                                            {feedPost[0][4]},{feedPost[0][5]}
                                                            {console.log(this.state.cr_latitude,this.state.cr_longitude)}

                                                            <img
                                src={feedPost[0][3]}
                                style={{ maxWidth: "420px" }}
                              />
                                                        </p>
                                                        <p style={{ color: "black" }}>{feedPost[0][2]}</p>
                                                    </li>

                                                </ul>
                                            </div>
                                        );
                                        }
                                    })}
                                </div>

                            </div>
                        </div>
                    </div>
                )}
                <br></br>
            </div>
        );
    }
}

export default Feed;