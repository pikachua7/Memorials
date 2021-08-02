import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
// import Web3 from "web3";
import TroveIt from "../../abis/NFT.json";
import MarketPlace from "../../abis/Marketplace.json";
import { FingerprintSpinner } from "react-epic-spinners";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import IconButton from "@material-ui/core/IconButton";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { NFTStorage, File } from 'nft.storage';
import { TextField, Paper, Typography } from "@material-ui/core";
import bg from './trial.jpg';


import Portis from '@portis/web3';
import Web3 from 'web3';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDU2NGI0NjlFYTVlZTIxODNiNDQxNTUwMWRCQWYxNzBiQjdDYTkxOGMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyNjg1Njg2OTkzMiwibmFtZSI6IkZvb3RwcmludCJ9.QMxvqcHpZJghwlDwMtM4Sfi4_rrAEhljRNrkTDuo1kg'
const client = new NFTStorage({ token: apiKey })


const useStyles = (theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
  paper: {
    margin: '50px 100px 100px 100px ',
    width: '30%',
    height: '110%',
    padding: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
  },
  buttonSubmit: {
    marginBottom: 10,
  },
});

//Declare IPFS
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
}); // leaving out the arguments will default to these values



class Upload extends Component {
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

      this.setState({contractAddress:networkData.address});
      console.log(this.state.contractAddress)

      const PostCount = await marketplace.methods.nftCounter().call();
      console.log(PostCount)
      this.setState({ PostCount: PostCount })
      for (var i = 1; i <= PostCount; i++) {
          console.log(i)
          //feedPost : assetID
          const assetID = await marketplace.methods.premiumNFT(i).call()
          console.log(assetID)
          const feedPost = await troveit.methods.tokenURI(assetID).call()
          console.log(feedPost)
          const slicedUrl = `https://ipfs.io/ipfs/${feedPost.slice(7,feedPost.length)}`
          console.log(slicedUrl)
          const response = await fetch(slicedUrl);
          console.log(response)
          const json = await response.json();
          const latitude= json.properties.latitude
          const longitude=json.properties.longitude
          if (latitude===this.state.latitude && longitude===this.state.longitude){
              this.setState({premiumAssetID:assetID})
              this.setState({premiumLocation:true})
          }
           
      }
      console.log(this.state.premiumLocation,this.state.premiumAssetID)

      this.setState({ loading: false });

    } else {
      window.alert("TroveIt contract not deployed to detected network.");
    }
  }

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer", this.state.buffer);
    };

  };

  // position = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     position => this.setState({
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude
  //     }),
  //     err => console.log(err)
  //   );
  // }

  uploadPost = (name, description) => {
    this.setState({ loading: true })

    

    const data = this.state.buffer;
    let latitude = this.state.latitude;
    let longitude = this.state.longitude;
    let url;
    async function getMetadata() {
      console.log('metadata')
      const metadata = await client.store({
        name: name,
        description: description,
        image: new File([data], 'trial.jpg', { type: 'image/jpg' }),
        properties: {
          latitude: latitude,
          longitude: longitude

        },
      });
      console.log('metadata', metadata)
      return metadata.url

    }
    const metadata = getMetadata();
    console.log(metadata)
    metadata.then((value) => {
      //add condition here
      this.setState({ flag: false });
      console.log(value);
      console.log(this.state.premiumLocation)
      if (this.state.premiumLocation){
        console.log("I am here")
        this.state.marketplace.methods
          .addPremiumNFT(this.state.contractAddress,this.state.premiumAssetID,value)
          .send({ from: this.state.account, value:1000000000000000000 })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
  
          });
      }
      else{

        this.state.troveit.methods
          .registerNFT(value,this.state.account)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });

          });
        console.log(value);
      }
      });
    
    this.setState({ loading: false })
  };

  setName = (event) => {
    this.setState({name: event.target.value});
  }

  setDescription = (event) => {
    this.setState({description: event.target.value});
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      troveit: null,
      marketplace:null,
      contractAddress:null,
      loading: true,
      buffer: '',
      name:'',
      description:'',
      latitude: '',
      longitude: '',
      premiumLocation:false,
      premiumAssetID:null
    };

    this.uploadPost = this.uploadPost.bind(this);
    this.captureFile = this.captureFile.bind(this);
    // this.position = this.position.bind(this);
    this.setName = this.setName.bind(this);
    this.setDescription=this.setDescription.bind(this);
  }

  render() {
    const { classes } = this.props;
    return (
      <div
        style={{width: "100%", height: "100%", display: 'flex', justifyContent: 'center'}}
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

          <Paper className={classes.paper} >
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} 
              onSubmit={(event) => {
                event.preventDefault();
                const name = this.state.name;
                const description = this.state.description;
                this.uploadPost(name, description);
              }}
            >
              <div></div>
              <input
                accept="image/*"
                className={classes.input}
                id="icon-button-file"
                type="file"
                onChange={this.captureFile}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <AddAPhotoIcon />
                </IconButton>
              </label>
              <br></br>
              <TextField
                name="name"
                variant="outlined"
                label="Name"
                fullWidth
                value={this.state.value} 
                onChange={this.setName}  
              />
              <TextField
                name="description"
                variant="outlined"
                label="Description"
                fullWidth
                value={this.state.value} 
                onChange={this.setDescription}   
              />
              <div className={classes.fileInput}>
                {/* <FileBase 
                        type="file"
                        multiple={false}
                        onDone={({base64})=> setPostData({...postData,selectedFile:base64})}
                      /> */}
              </div>
              <Button
                        type="submit"
                        color="secondary"
                        variant="contained"
                        size="large"
                        fullWidth
                        className={classes.buttonSubmit}
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload
                      </Button>
              </form>
          </Paper>

        )}
        </div>
    );
  }
}

export default withStyles(useStyles)(Upload);
