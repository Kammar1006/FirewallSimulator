/* Created by Kammar1006 */

const { Firewall } = require("./firewall");

function Interface(inet){
    this.input_rules = Firewall();
    this.output_rules = Firewall();
    this.inet = inet || "127.0.0.1";
}

function Device(type, inets){
    this.type = type;
    if(type == "router"){
        this.interfaces = [Interface(inets[0]), Interface(inets[1])];
    }
    else if(type == "pc"){
        this.interfaces = [Interface(inets[0])];
    }

    this.packet_in = (packet, inet) => {
        result = this.interfaces[inet].input_rules.simulate(packet);
        status = result[0];
        logs = result[1];
    }

    this.packet_out = (packet, inet) => {
        result = this.interfaces[inet].output_rules.simulate(packet);
    }

    this.configure = (inet, type, action, id, data) => {
        if(type == "input" && 0 <= inet && inet < this.interfaces.length){
            this.interfaces[inet].input_rules.configure(action, id, data);
        }
        else(type == "output" && 0 <= inet && inet < this.interfaces.length)
            this.interfaces[inet].output_rules.configure(action, id, data);
    }
}

module.exports = {Device}