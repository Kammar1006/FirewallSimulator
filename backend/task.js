/* Created by Kammar1006 */

const { Device } = require("./device");
const { Network } = require("./network");

function Task(){
    this.network = new Network();
    this.network.set(
        [
            new Device("PC_1", ["192.168.1.2"]),
            new Device("R_1", ["192.168.1.1", "10.1.1.1"]),
            new Device("R_2", ["10.1.1.2", "192.168.2.1", "192.168.3.1"]),
            new Device("PC_2", ["192.168.2.2"]),
            new Device("PC_3", ["192.168.3.2"])
        ], 
        [[1], [0, 2], [1, 3, 4], [2], [2]]
    )

    this.id = 1;
    this.desc = "";
    this.test = [
        {
            packet: { src: "192.168.1.1", des: "10.0.0.5", protocol: "tcp:80" },
            result: [true, 6]
        },
        {
            packet: { src: "192.168.1.1", des: "192.168.2.2", protocol: "tcp:80" },
            result: [false, 3]
        }
    ]

    this.check = () => {}
}

module.exports = {Task}