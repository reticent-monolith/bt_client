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

  handleMessage = (topic, payload) => {
    payload = JSON.parse(payload)
    if (topic === "setups") {
        this.setState({
            ...this.state,
            4: {
                ...this.state[4],
                ...payload[4]
            },
            3: {
                ...this.state[3],
                ...payload[3]
            },
            2: {
                ...this.state[2],
                ...payload[2]
            },
            1: {
                ...this.state[1],
                ...payload[1]
            }
        })
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
    const payload = {
        weight: this.state[this.state.selectedLine].weight,
        trolley: this.state[this.state.selectedLine].trolley
    }
    this.client.send(this.state.selectedLine, "newRider", JSON.stringify(payload))
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
