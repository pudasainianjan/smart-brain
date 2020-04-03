import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
import 'tachyons';

const app = new Clarifai.App({
  apiKey: '55b8ff598129466ab0672f72321cc47d'
 });

const particlesOptions = {
  
  polygon: {
    number:{
      value: 300,
      density:{
        enable:true,
        value_area:800,
      }
    }
    
}

}


class App extends Component {

  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box:{},
      route: 'signin',    //tells where we are in the page
      isSignedIn: false
    }
  }

  //just for checking response
  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //   .then(response => response.json())
  //   .then(console.log);  //returns data
  // }

  calculatefaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image= document.getElementById('inputimage');
   const width = Number(image.width);
   const height = Number(image.height);
   //console.log(width, height);
   return{
     leftCol: clarifaiFace.left_col * width,
     topRow: clarifaiFace.top_row * height,
     rightCol: width - (clarifaiFace.right_col * width),
     bottomRow: height - (clarifaiFace.bottom_row * height),
   }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input : event.target.value});
  } 

  onButtonSubmit = () => {
    //console.log('click');
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
      .then(response => this.displayFaceBox(this.calculatefaceLocation(response)))
      .catch(err => console.log(err));

      //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      // do something with response
  }

  onRouteChange = (route) => {
    if (route ==='signout'){
      this.setState({isSignedIn: false})
    }
    else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route:route});

  }

  render(){

   const  { isSignedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
      <Particles className='particles'
                params={particlesOptions} 
                />
     
    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
    { route === 'home' ?  //if

          <div>
          <Logo />     
          <Rank />

          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
    :(
      route  === 'signin' ?
      <Signin onRouteChange={this.onRouteChange}/>   /*otherwise signin component*/
      :<Register onRouteChange={this.onRouteChange} />
    )
    

     
    }

    </div>
  );
}
}

export default App;
