import React, { Component } from "react";
import Web3 from "web3";
import TroveIt from "../../abis/NFT.json";
import MarketPlace from "../../abis/Marketplace.json";

import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';


import { NFTStorage, File, Blob } from 'nft.storage';
import Portis from '@portis/web3';
import { Style } from "@material-ui/icons";

const style = {
  content: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "white",
    padding: 7,
    borderRadius: 20,
  },
  imageList: {
    width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
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

    // const portis = new Portis('c0f465f7-8289-42c1-98a6-cec427ceecc6', 'maticMumbai');
    // const web3 = new Web3(portis.provider);

    const web3 = window.web3;

    // Initialize your dapp here like getting user accounts etc
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    // Network ID
    const networkId = await web3.eth.net.getId();
    const networkData = TroveIt.networks[networkId];
    const networkDataM = MarketPlace.networks[networkId];

    navigator.geolocation.getCurrentPosition(
      position => this.setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }),
      err => console.log(err)
    );

    if (networkData && networkDataM) {
      const troveit = new web3.eth.Contract(TroveIt.abi, networkData.address);
      const marketplace = new web3.eth.Contract(MarketPlace.abi, networkDataM.address);
      this.setState({ troveit });
      this.setState({ marketplace });

      this.setState({ contractAddress: networkData.address });
      console.log(this.state.contractAddress)

      let PostCount = await marketplace.methods.nftCounter().call();
      console.log(PostCount)
      this.setState({ PostCount: PostCount })
      for (var i = 1; i <= PostCount; i++) {
        console.log(i)
        //feedPost : assetID
        const assetID = await marketplace.methods.premiumNFT(i).call()
        console.log(assetID)
        const feedPost = await troveit.methods.tokenURI(assetID).call()
        console.log(feedPost)
        const slicedUrl = `https://ipfs.io/ipfs/${feedPost.slice(7, feedPost.length)}`
        console.log(slicedUrl)
        const response = await fetch(slicedUrl);
        console.log(response)
        const json = await response.json();
        const latitude = json.properties.latitude
        const longitude = json.properties.longitude
        if (latitude === this.state.latitude && longitude === this.state.longitude) {
          this.setState({ premiumAssetID: assetID })
          this.setState({ premiumLocation: true })
        }
      }
      console.log(this.state.premiumLocation)

      PostCount = await troveit.methods.balanceOf(accounts[0]).call();
      console.log(PostCount)
      this.setState({ PostCount: PostCount })
      for (var i = 0; i < this.state.PostCount; i++) {
        const tokenId = await troveit.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        console.log(tokenId)
        const feedPost = await troveit.methods.tokenURI(tokenId).call()
        console.log(feedPost)
        const slicedUrl = `https://ipfs.io/ipfs/${feedPost.slice(7, feedPost.length)}`
        const response = await fetch(slicedUrl);
        // console.log(response)
        const json = await response.json();
        const latitude = json.properties.latitude
        const longitude = json.properties.longitude
        const imageUrl = json.image.slice(7, json.image.length - 10)
        // console.log(imageUrl)
        const finalUrl = `https://${imageUrl}.ipfs.dweb.link/trial.jpg`
        // console.log(finalUrl)

        const Post = [i, json.name, json.description, finalUrl, latitude, longitude]
        // console.log(Post,this.state.feedPosts)

        this.setState({
          feedPosts: [...this.state.feedPosts, [Post]],
        });
        console.log(Post, this.state.feedPosts)
      }

      this.setState({ loading: false });


    } else {
      window.alert("TroveIt contract not deployed to detected network.");
    }

  }

  makePremium = (assetID, prize) => {
    this.setState({ loading: true })
    console.log(assetID, prize)
    let tipAmount = window.web3.utils.toWei('1', 'Ether')
    this.state.marketplace.methods
      .convertToPremium(this.state.contractAddress, assetID, tipAmount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        console.log(hash)
        this.setState({ loading: false });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      troveIt: null,
      marketplace: null,
      PostCount: 0,
      feedPosts: [],
      contractAddress: null,
      loading: true,
      latitude: '',
      longitude: '',
      premiumLocation: false,
      premiumAssetID: null
    };
    this.makePremium = this.makePremium.bind(this);
  }

  render() {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundRepeat: "inherit",
        }}
      >
        {this.state.loading ? (
          <div className="center mt-19" style={{display:'flex',justifyContent:'center'}}>
          {/* loader */}
          <img src='https://media.giphy.com/media/XeA5bZwGCQCxgKqKtL/giphy.gif' ></img>
          <br></br>
      </div>
        ) : (
          <div>
            <div className="about">
              <div class="container">
                <ImageList rowHeight={180} className={style.imageList}>
                  <ImageListItem key="Subheader" cols={2} style={{ height: 'auto' }}>
                  </ImageListItem>
                  {this.state.feedPosts.map((feedPost) => (
                    <ImageListItem key={feedPost[0][2]}>
                      <img src={feedPost[0][3]} />
                      <ImageListItemBar
                        title={feedPost[0][1]}
                        subtitle={<span>{feedPost[0][2]}</span>}
                        actionIcon={
                          this.state.premiumLocation ? (<div></div>) :
                            <IconButton aria-label={`info about ${feedPost[0][4]}`} className={style.icon}
                              onClick={(event) => {
                                this.makePremium(feedPost[0][0], 1000);
                              }}
                            >
                              <MonetizationOnIcon style={{ color: "white" }} />
                            </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Profile;