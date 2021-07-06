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
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleButton from "react-bootstrap/ToggleButton"
import SetupDisplay from "./components/SetupDisplay"

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
    const [line, topic] = topicString.split("/")
    message = message.toString()

    Log.debug(topic)

    switch(topic) {
      case "addedWeight": {
        this.setState({
          ...this.state,
          frontSlider: "",
          middleSlider: "",
          rearSlider: "",
          addedWeight: parseInt(message)
        });break
      }
      case "frontSlider": {
        this.setState({
          ...this.state,
          frontSlider: message,
          addedWeight: 0
        });break
      }
      case "middleSlider": {
        this.setState({
          ...this.state,
          middleSlider: message,
          addedWeight: 0
        });break
      }
      case "rearSlider": {
        this.setState({
          ...this.state,
          rearSlider: message,
          addedWeight: 0
        });break
      }
      case "clear": this.clearScreen();break;
      default: Log.error(`MqttService doesn't understand "${topic}"`)
    }


    console.log(this.state)
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

        <SetupDisplay 
          front={this.state.frontSlider}
          middle={this.state.middleSlider}
          rear={this.state.rearSlider}
          added={this.state.addedWeight}
        />

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
