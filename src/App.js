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

  checkVisibility = line => {
    Log.debug(`Checking visibility of line ${line}`)
    if (this.state.selectedLine === line) {
      return "visible"
    } else {
      return "hidden"
    }
  }

  visibility = {}

  render() {
    const isVisible = {
      1: this.checkVisibility(1),
      2: this.checkVisibility(2),
      3: this.checkVisibility(3),
      4: this.checkVisibility(4),
    }
    Log.debug("rendering")
    return (
      <div className="App">

        {[4,3,2,1].map(num => {
          return (
            <Line 
              key={num}
              number={num} 
              display={isVisible[num]}
              weight={this.state[num].weight}
              trolley={this.state[num].trolley}
              front={this.state[num].frontSlider}
              middle={this.state[num].middleSlider}
              rear={this.state[num].rearSlider}
              added={this.state[num].addedWeight}
              confirmed={this.state[num].confirmed}
              changeWeight={this.changeWeight}
              changeTrolley={this.changeTrolley}
              send={this.handleSend}
              confirm={this.handleConfirmButton}
            />
          )
        })}
        
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
