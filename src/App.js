import logo from './logo.svg';
import black from "./images/black.svg"
import oldRed from "./images/oldRed.svg"
import newRed from "./images/newRed.svg"
import yellow from "./images/yellow.svg"
import weightBag from "./images/weightBag.svg"
import './App.css';
import React, { useEffect } from "react"
import MqttService from "./mqtt/MqttService"
import Log from "./utilities/Log"
import Button from "react-bootstrap/Button"
import ToggleButton from "react-bootstrap/ToggleButton"
import 'bootstrap/dist/css/bootstrap.min.css';

const WS_URL = "ws://192.168.1.133:8883"
  
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      line: 4,
      frontSlider: "",
      middleSlider: "",
      rearSlider: "",
      weight: 0, 
      trolley: 0, 
      addedWeight: 0,
      confirmed: false
    }

    this.styles = {
      slider: {
        height: 160, 
        width: 120
      }
    }

    this.client = new MqttService(WS_URL, this.handleMessage)
  }

  handleMessage = (topicString, message) => {
    Log.debug(message.toString())
    const [line, topic] = topicString.split("/")
    message = message.toString()

    if (topic === "clear") this.clearScreen()

    if (topic !== "addedWeight") {
      this.setState({addedWeight: 0})
    } else {
      this.setState({
        frontSlider: "",
        middleSlider: "",
        rearSlider: ""
      })
    }
    this.setState({
      ...this.state,
      [topic]: message
    })
  }

  handleSend = () => {
    this.client.send(this.state.line, "weight", this.state.weight)
    this.client.send(this.state.line, "trolley", this.state.trolley)
  }

  handleConfirmButton = (status) => {
      this.setState({confirmed: status})
      this.client.send(this.state.line, "confirmation", `${status}`)
  }

  clearScreen = () => {
      this.setState({
          line: 4,
          frontSlider: "",
          middleSlider: "",
          rearSlider: "",
          weight: 0,
          trolley: 0,
          addedWeight: 0,
          confirmed: false
      })
  }

  checkFront() {
    let output = null
    switch(this.state.frontSlider) {
      case "BLACK": {
        output = <img src={black} style={this.styles.slider}/>
        break
      }
      case "OLD_RED": {
        output = <img src={oldRed} style={this.styles.slider}/>
        break
      }
      case "NEW_RED": {
        output = <img src={newRed} style={this.styles.slider}/>
        break
      }
      default: {
        break
      }
    }
    return output
  }

  checkMid() {
    let output = ""
    switch(this.state.middleSlider) {
      case "OLD_RED": {
        output = <img src={oldRed} style={this.styles.slider}/>
        break
      }
      case "NEW_RED": {
        output = <img src={newRed} style={this.styles.slider}/>
        break
      }
      default: {
        break
      }
    }
    return output
  }

  checkRear() {
    let output = ""
    switch(this.state.rearSlider) {
      case "YELLOW": {
        output = <img src={yellow} style={this.styles.slider}/>
        break
      }
      default: {
        break
      }
    }
    return output
  }

  checkAdded() {
    let output = []
    
    for (let i of [...Array(Math.floor(this.state.addedWeight/10)).keys()]) {
      output.push(<img src={weightBag} />)
    }

    return output
  }
  
  

  render() {
    return (
      <div className="App">
        <input
          value={this.state.weight !== 0 ? this.state.weight : ""}
          className="input"
          onChange={e => {
            this.setState({
              weight: e.target.value
            })
          }}
        ></input>
        <input
          value={this.state.trolley !== 0 ? this.state.trolley : ""}
          className="input"
          onChange={e => {
            this.setState({
              trolley: e.target.value
            })
          }}
        ></input>
        <Button
          variant="primary"
          className="button"
          onClick={this.handleSend}
        >Send</Button>

        <div className="setup-div">
          <div className="setup-part">{this.checkFront()}</div>
          <div className="setup-part">{this.state.addedWeight === 0 ? this.checkMid(): this.checkAdded()}</div>
          <div className="setup-part">{this.checkRear()}</div>
        </div>

        <ToggleButton
          className="button"
          variant={this.state.confirmed ? "success" : "danger"}
          checked={this.state.confirmed}
          type="checkbox"
          onChange={(e) => {
              console.log("checked=" + e.currentTarget.checked)
              console.log(e.currentTarget.value)
            this.handleConfirmButton(e.currentTarget.checked)
          }}
        >{this.state.confirmed ? "Confirmed!" : "Tap to Confirm" }</ToggleButton>

      </div>
    );
  }
}

export default App;
