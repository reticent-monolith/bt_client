import './App.css';
import React from "react"
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
      selectedLine: 4,
      4: {
        frontSlider: "",
        middleSlider: "",
        rearSlider: "",
        weight: 0, 
        trolley: 0, 
        addedWeight: 0,
        confirmed: false
      },
      3: {
        frontSlider: "",
        middleSlider: "",
        rearSlider: "",
        weight: 0, 
        trolley: 0, 
        addedWeight: 0,
        confirmed: false
      },
      2: {
        frontSlider: "",
        middleSlider: "",
        rearSlider: "",
        weight: 0, 
        trolley: 0, 
        addedWeight: 0,
        confirmed: false
      },
      1: {
        frontSlider: "",
        middleSlider: "",
        rearSlider: "",
        weight: 0, 
        trolley: 0, 
        addedWeight: 0,
        confirmed: false
      },
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
          [line]: {
            frontSlider: "",
            middleSlider: "",
            rearSlider: "",
            addedWeight: parseInt(message)
          }
        });break
      }
      case "frontSlider": {
        this.setState({
          ...this.state,
          [line]: {
            frontSlider: message,
            addedWeight: 0
          }
        });break
      }
      case "middleSlider": {
        this.setState({
          ...this.state,
          [line]: {
            middleSlider: message,
            addedWeight: 0
          }
        });break
      }
      case "rearSlider": {
        this.setState({
          ...this.state,
          [line]: {
            rearSlider: message,
            addedWeight: 0
          }
        });break
      }
      case "clear": this.clearScreen();break;
      default: Log.error(`Big Top doesn't understand "${topic}"`)
    }
  }

  handleSend = () => {
    this.client.send(this.state.selectedLine, "weight", this.state[this.state.selectedLine].weight)
    this.client.send(this.state.selectedLine, "trolley", this.state[this.state.selectedLine].trolley)
  }

  handleConfirmButton = (status) => {
      this.setState({confirmed: status})
      this.client.send(this.state.line, "confirmation", `${status}`)
  }

  clearScreen = () => {
    const line = this.state.line
      this.setState({
          line: line,
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
          value={this.state[this.state.selectedLine].weight !== 0 ? this.state[this.state.selectedLine].weight : ""}
          className="input"
          onChange={e => {
            this.setState({
              ...this.state,
              [this.state.selectedLine]: {
                ...this.state[this.state.selectedLine],
                weight: e.target.value
              }
            })
          }}
        ></input>
        <input
          value={this.state[this.state.selectedLine].trolley !== 0 ? this.state[this.state.selectedLine].trolley : ""}
          className="input"
          onChange={e => {
            this.setState({
              ...this.state,
              [this.state.selectedLine]: {
                ...this.state[this.state.selectedLine],
                trolley: e.target.value
              }
            })
          }}
        ></input>
        <Button
          variant="primary"
          className="button"
          onClick={this.handleSend}
        >Send</Button>

        <SetupDisplay 
          front={this.state[this.state.selectedLine].frontSlider}
          middle={this.state[this.state.selectedLine].middleSlider}
          rear={this.state[this.state.selectedLine].rearSlider}
          added={this.state[this.state.selectedLine].addedWeight}
        />

        <ToggleButton
          className="button"
          variant={this.state[this.state.selectedLine].confirmed ? "success" : "danger"}
          checked={this.state[this.state.selectedLine].confirmed}
          type="checkbox"
          onChange={(e) => {
            this.handleConfirmButton(e.currentTarget.checked)
          }}
        >{this.state[this.state.selectedLine].confirmed ? "Confirmed!" : "Tap to Confirm" }</ToggleButton>

        <select 
          value={this.state.selectedLine}
          onChange={e => {
            this.setState({
              ...this.state,
              selectedLine: e.target.value
            })
          }}
        >
          <option value={1}>Line 1</option>
          <option value={2}>Line 2</option>
          <option value={3}>Line 3</option>
          <option value={4}>Line 4</option>
        </select>
      </div>
    );
  }
}

export default App;
