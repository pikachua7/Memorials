import React, { Component } from "react";
import Web3 from "web3";
import TroveIt from "../../abis/NFT.json";
import { FingerprintSpinner } from "react-epic-spinners";
import Favorite from "@material-ui/icons/Favorite";

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

class Profile extends Component {
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

    position = () => {
        navigator.geolocation.getCurrentPosition(
          position => this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }),
          err => console.log(err)
        );
      }

    async loadBlockchainData() {

        const web3 = window.web3;

        // Initialize your dapp here like getting user accounts etc
        // Load account
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        // Network ID
        const networkId = await web3.eth.net.getId();
        const networkData = TroveIt.networks[networkId];

        if (networkData) {
            const troveit = new web3.eth.Contract(TroveIt.abi, networkData.address);
            this.setState({ troveit });

            const PostCount = await troveit.methods.balanceOf(accounts[0]).call();
            console.log(PostCount)
            this.setState({ PostCount: PostCount })
            for (var i = 0; i < this.state.PostCount; i++) {
                const tokenId = await troveit.methods.tokenOfOwnerByIndex(accounts[0],i).call()
                console.log(tokenId)
                const feedPost = await troveit.methods.tokenURI(tokenId).call()
                console.log(feedPost)
                const slicedUrl = `https://ipfs.io/ipfs/${feedPost.slice(7,feedPost.length)}`
                const response = await fetch(slicedUrl);
                // console.log(response)
                const json = await response.json();
                const latitude= json.properties.latitude
                const longitude=json.properties.longitude
                const imageUrl=json.image.slice(7,json.image.length-10)
                // console.log(imageUrl)
                const finalUrl = `https://${imageUrl}.ipfs.dweb.link/trial.jpg`
                // console.log(finalUrl)

                const Post=[i,json.name,json.description,finalUrl,latitude,longitude]
                // console.log(Post,this.state.feedPosts)
                
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
            troveIt: null,
            PostCount: 0,
            feedPosts: [],
            loading: true,

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
                                <br></br>
                                <div
                                    class="col-lg-12 ml-auto mr-auto"
                                    style={{ maxWidth: "780px" }}
                                >
                                    {this.state.feedPosts.map((feedPost) => {
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
                                                            {feedPost[0][4]},{feedPost[0][5]}
                                                        </p>
                                                        <p style={{ color: "black" }}>{feedPost[0][2]}</p>
                                                    </li>

                                                </ul>
                                            </div>
                                        );
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

export default Profile;