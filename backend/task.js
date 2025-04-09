/* Created by Kammar1006 */

const { Device } = require("./device");
const { Network } = require("./network");

function Task() {
    this.network = new Network();

    this.set = (nr) => {
        this.id = nr;

        switch (nr) {
            case 1: {
                const devices = [
                    new Device("PC_1", ["192.168.1.2"]),
                    new Device("R_1", ["192.168.1.1", "10.1.1.1"]),
                    new Device("R_2", ["10.1.1.2", "192.168.2.1", "192.168.3.1"]),
                    new Device("PC_2", ["192.168.2.2"]),
                    new Device("PC_3", ["192.168.3.2"]),
                ];
                const connections = [[1], [0, 2], [1, 3, 4], [2], [2]];

                this.network.set(devices, connections);
                this.topology = {
                    devices: devices.map((device, index) => ({
                        id: index,
                        name: device.name,
                        interfaces: device.interfaces.map((iface) => iface.inet),
                    })),
                    connections: connections.flatMap((conn, index) =>
                        conn.map((target) => ({ source: index, target }))
                    ),
                };

                this.title = "Basic Firewall Configuration";
                this.desc = [
                    "Configure the firewall to allow traffic from PC_1 to PC_3 on port 80.",
                    // "Task 2: Block all other traffic.",
                ];
                this.tests = [
                    {
                        endpoints: [0, 4],
                        packet: { src: "192.168.1.2", des: "192.168.3.2", protocol: "udp:80" },
                        result: [true, 6],
                    },
                    {
                        endpoints: [0, 4],
                        packet: { src: "192.168.1.2", des: "192.168.3.2", protocol: "tcp:443" },
                        result: [false, 2],
                    },
                ];
                this.difficulty = "Easy";
                this.subtasks = [
                    { id: 1, title: "Allow traffic on port 80", description: "Ensure traffic from PC_1 to PC_3 on port 80 is allowed." },
                    { id: 2, title: "Block all other traffic", description: "Block all other traffic not explicitly allowed." },
                ];
            } break;

            case 2: {
                const devices = [
                    new Device("PC_A", ["10.0.0.2"]),
                    new Device("R_A", ["10.0.0.1", "172.16.0.1"]),
                    new Device("R_B", ["172.16.0.2", "192.168.1.1"]),
                    new Device("PC_B", ["192.168.1.2"]),
                ];
                const connections = [[1], [0, 2], [1, 3], [2]];

                this.network.set(devices, connections);
                this.topology = {
                    devices: devices.map((device, index) => ({
                        id: index,
                        name: device.name,
                        interfaces: device.interfaces.map((iface) => iface.inet),
                    })),
                    connections: connections.flatMap((conn, index) =>
                        conn.map((target) => ({ source: index, target }))
                    ),
                };

                this.title = "Intermediate Firewall Rules";
                this.desc = ["Task 2: Configure the firewall to allow traffic from PC_A to PC_B."];
                this.tests = [];
                this.difficulty = "Medium";
                this.subtasks = [
                    { id: 1, title: "Allow traffic from PC_A to PC_B", description: "Ensure traffic from PC_A to PC_B is allowed." },
                    { id: 2, title: "Block all other traffic", description: "Block all other traffic not explicitly allowed." },
                ];
            } break;

            case 3: {
                const devices = [
                    new Device("PC_X", ["192.168.100.2"]),
                    new Device("R_X", ["192.168.100.1", "10.10.10.1"]),
                    new Device("R_Y", ["10.10.10.2", "172.16.10.1"]),
                    new Device("PC_Y", ["172.16.10.2"]),
                ];
                const connections = [[1], [0, 2], [1, 3], [2]];

                this.network.set(devices, connections);
                this.topology = {
                    devices: devices.map((device, index) => ({
                        id: index,
                        name: device.name,
                        interfaces: device.interfaces.map((iface) => iface.inet),
                    })),
                    connections: connections.map((conn, index) =>
                        conn.map((target) => ({ source: index, target }))
                    ),
                };

                this.title = "Advanced Network Security";
                this.desc = ["Task 3: Configure the firewall to allow traffic from PC_X to PC_Y."];
                this.tests = [];
                this.difficulty = "Hard";
                this.subtasks = [
                    { id: 1, title: "Allow traffic from PC_X to PC_Y", description: "Ensure traffic from PC_X to PC_Y is allowed." },
                    { id: 2, title: "Block all other traffic", description: "Block all other traffic not explicitly allowed." },
                ];
            } break;

            // Add more cases for tasks 4, 5, and 6 with unique topologies...
        }
    };

    this.check = () => {
        let flag = true;

        for (const test of this.tests) {
            let result = this.network.simulate(
                test.endpoints[0],
                test.endpoints[1],
                test.packet
            );

            if (test.result[0] === true || test.result[0] === "permit") {
                if (result.result.filter((e) => e[0] === true || e[0] === "permit").length !== test.result[1]) {
                    flag = false;
                }
            } else {
                if (result.result.filter((e, i) => (e[0] === true || e[0] === "permit") && i < test.result[1]).length !== test.result[1] - 1) {
                    flag = false;
                }
            }
        }
        return flag;
    };

    this.runTests = () => {
        return this.tests.map((test) => {
            const result = this.network.simulate(
                test.endpoints[0],
                test.endpoints[1],
                test.packet
            );
            const passed = result.result.some(
                (e) => e[0] === test.result[0]
            );
            return {
                test,
                passed,
                actual: result.result,
            };
        });
    };
}

module.exports = { Task };