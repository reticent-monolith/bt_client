import './App.css';
import React from "react"
import MqttService from "./mqtt/MqttService"
import Log from "./utilities/Log"
import 'bootstrap/dist/css/bootstrap.min.css';
import Line from "./components/Line"

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
        confirmed: false,
        visible: "block"
      },
      3: {
        frontSlider: "",
        middleSlider: "",
        rearSlider: "",
        weight: 0, 
        trolley: 0, 
        addedWeight: 0,
        confirmed: false,
        visible: "none"
      },
      2: {
        frontSlider: "",
        middleSlider: "",
        rearSlider: "",
        weight: 0, 
        trolley: 0, 
        addedWeight: 0,
        confirmed: false,
        visible: "none"
      },
      1: {
        frontSlider: "",
        middleSlider: "",
        rearSlider: "",
        weight: 0, 
        trolley: 0, 
        addedWeight: 0,
        confirmed: false,
        visible: "none"
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
            ...this.state[line],
            frontSlider: message,
            addedWeight: 0
          }
        });break
      }
      case "middleSlider": {
        this.setState({
          ...this.state,
          [line]: {
            ...this.state[line],
            middleSlider: message,
            addedWeight: 0
          }
        });break
      }
      case "rearSlider": {
        this.setState({
          ...this.state,
          [line]: {
            ...this.state[line],
            rearSlider: message,
            addedWeight: 0
          }
        });break
      }
      case "clear": this.clearScreen();break;
      default: Log.error(`Big Top doesn't understand "${topic}"`)
    }
  }

  changeWeight = (weight, line) => {
    this.setState({
      ...this.state,
      [line]: {
        ...this.state[line],
        weight: weight
      }
    })
  }

  changeTrolley = (trolley, line) => {
    this.setState({
      ...this.state,
      [line]: {
        ...this.state[line],
        trolley: trolley
      }
    })
  }

  handleSend = () => {
    this.client.send(this.state.selectedLine, "weight", this.state[this.state.selectedLine].weight)
    this.client.send(this.state.selectedLine, "trolley", this.state[this.state.selectedLine].trolley)
  }

  handleConfirmButton = (status, line) => {
      this.setState({
        ...this.state,
        [line]: {
          ...this.state[line],
          confirmed: status
        }
      })
      this.client.send(line, "confirmation", `${status}`)
  }

  clearScreen = () => {
    const line = this.state.selectedLine
      this.setState({
          selectedLine: line,
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
          }
      })
  }

  visibility = {}

  render() {
    return (
      <div className="App">

        <Line 
          number={parseInt(this.state.selectedLine)} 
          weight={this.state[this.state.selectedLine].weight}
          trolley={this.state[this.state.selectedLine].trolley}
          front={this.state[this.state.selectedLine].frontSlider}
          middle={this.state[this.state.selectedLine].middleSlider}
          rear={this.state[this.state.selectedLine].rearSlider}
          added={this.state[this.state.selectedLine].addedWeight}
          confirmed={this.state[this.state.selectedLine].confirmed}
          changeWeight={this.changeWeight}
          changeTrolley={this.changeTrolley}
          send={this.handleSend}
          confirm={this.handleConfirmButton}
        />
        
        <select 
          value={this.state.selectedLine}
          onChange={e => {
            this.setState({
              ...this.state,
              selectedLine: e.target.value
            })
            this.forceUpdate()
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
