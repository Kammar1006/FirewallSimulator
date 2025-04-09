/* Created by Kammar1006 */

const { Firewall } = require("./firewall");
// const { isSameSubnet } = require("./compare");

function Interface(inet){
    this.input_rules = new Firewall();
    this.output_rules = new Firewall();
    this.inet = inet || "127.0.0.1";
}

function Device(name, inets){
    this.name = name;
    this.interfaces = [];
    inets.forEach(element => {
        this.interfaces.push(new Interface(element))
    });

    this.packet_in = (packet, inet) => {
        result = this.interfaces[inet].input_rules.simulate(packet);
        return result
    }

    this.packet_out = (packet, inet) => {
        result = this.interfaces[inet].output_rules.simulate(packet);
        return result
    }

    this.configure = (inet, type, action, id, data) => {
        if(type == "input" && 0 <= inet && inet < this.interfaces.length){
            return this.interfaces[inet].input_rules.configure(action, id, data);
        }
        else if(type == "output" && 0 <= inet && inet < this.interfaces.length){
            return this.interfaces[inet].output_rules.configure(action, id, data);
        }
        return false;
    }

    this.ping = (targetIp) => {
        return `Reply from ${targetIp}: bytes=32 time<1ms TTL=64`;
    };
}

module.exports = {Device}