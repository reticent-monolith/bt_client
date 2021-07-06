import mqtt from "async-mqtt"
import Log from "../utilities/Log";

export default class MqttService {
    constructor(websocketUrl, messageHandler) {
        Log.debug(`MQTT Client connecting to ${websocketUrl}`)
        try {     
            this.client = mqtt.connect(websocketUrl)
        } catch (err) {
            Log.error(err.stack)
            process.exit()
        }

        this.client.on("connect", () => {
            Log.debug("MQTT Client connected successfully!")
            try {
                this.client.subscribe([
                    "+/frontSlider", 
                    "+/middleSlider",
                    "+/rearSlider",
                    "+/addedWeight",
                    "+/ping",
                    "+/weightagain",
                    "+/trolleyagain",
                    "+/frontSlideragain",
                    "+/middleSlideragain",
                    "+/rearSlideragain",
                    "+/addedWeightagain",
                    "all/clear"
                ])
            } catch (err) {
                Log.error(err.stack)
                process.exit()
            }
        })

        this.client.on("message", function(topic, message) {
            messageHandler(topic, message)
        })
    }

    async send(line, purpose, message) {
        this.client.publish(`${line}/${purpose}`, message)
    }

    end() {
        this.client.end()
    }
}
