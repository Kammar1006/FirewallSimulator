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
                    new Device("S_1", ["", ""], 0, 0),
                    new Device("R_1", ["192.168.1.1", "192.168.2.1", "192.168.3.1"]),
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
                        result: [[true, 6], [true, 6]],
                    },
                    {
                        endpoints: [0, 4],
                        packet: { src: "192.168.1.2", des: "192.168.3.2", protocol: "tcp:443" },
                        result: [[false, 2], [false, 0]],
                    },
                ];
                this.difficulty = "Hard";
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
                this.desc = [
                    "Configure the firewall to allow traffic from PC_A to PC_B on port 22.",
                    "Block all other traffic.",
                ];
                this.tests = [
                    {
                        endpoints: [0, 3],
                        packet: { src: "10.0.0.2", des: "192.168.1.2", protocol: "tcp:22" },
                        result: [[true, 6], [true, 6]],
                    },
                    {
                        endpoints: [0, 3],
                        packet: { src: "10.0.0.2", des: "192.168.1.2", protocol: "udp:53" },
                        result: [[false, 2], [false, 0]],
                    },
                ];
                this.difficulty = "Medium";
                this.subtasks = [
                    { id: 1, title: "Allow traffic on port 22", description: "Ensure traffic from PC_A to PC_B on port 22 is allowed." },
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

            case 4: {
                const devices = [
                    new Device("PC_4", ["192.168.4.2"]),
                    new Device("R_4", ["192.168.4.1", "10.0.0.1"]),
                    new Device("PC_5", ["10.0.0.2"]),
                ];
                const connections = [[1], [0, 2], [1]];

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

                this.title = "Basic Routing Configuration";
                this.desc = ["Task 4: Configure routing to allow traffic from PC_4 to PC_5."];
                this.tests = [];
                this.difficulty = "Easy";
                this.subtasks = [
                    { id: 1, title: "Enable routing", description: "Ensure traffic from PC_4 to PC_5 is routed correctly." },
                ];
            } break;

            case 5: {
                const devices = [
                    new Device("PC_6", ["192.168.6.2"]),
                    new Device("R_6", ["192.168.6.1", "172.16.0.1"]),
                    new Device("PC_7", ["172.16.0.2"]),
                ];
                const connections = [[1], [0, 2], [1]];

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

                this.title = "Intermediate Routing Configuration";
                this.desc = ["Task 5: Configure routing to allow traffic from PC_6 to PC_7."];
                this.tests = [];
                this.difficulty = "Medium";
                this.subtasks = [
                    { id: 1, title: "Enable routing", description: "Ensure traffic from PC_6 to PC_7 is routed correctly." },
                ];
            } break;

            case 6: {
                const devices = [
                    new Device("PC_8", ["192.168.8.2"]),
                    new Device("R_8", ["192.168.8.1", "10.10.10.1"]),
                    new Device("PC_9", ["10.10.10.2"]),
                ];
                const connections = [[1], [0, 2], [1]];

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

                this.title = "Advanced Routing Configuration";
                this.desc = ["Task 6: Configure routing to allow traffic from PC_8 to PC_9."];
                this.tests = [];
                this.difficulty = "Hard";
                this.subtasks = [
                    { id: 1, title: "Enable routing", description: "Ensure traffic from PC_8 to PC_9 is routed correctly." },
                ];
            } break;

            // for next
        }
    };

    this.check = () => {
        let flag = true;

        for (const test of this.tests) {
            // Symulacja pakietu w sieci
            let result = this.network.simulate(
                test.endpoints[0], // Identyfikator urządzenia źródłowego
                test.endpoints[1], // Identyfikator urządzenia docelowego
                test.packet        // Szczegóły pakietu
            );

            // Walidacja kierunku żądania
            if (test.result[0][0] === true || test.result[0][0] === "permit") {
                if (result.result[0].filter((e) => e[0] === true || e[0] === "permit").length !== test.result[0][1]) {
                    flag = false;
                }
            } else {
                if (result.result[0].filter((e, i) => (e[0] === true || e[0] === "permit") && i < test.result[0][1]).length !== test.result[0][1] - 1) {
                    flag = false;
                }
            }

            // Walidacja kierunku odpowiedzi
            if (test.result[0][0] === true && flag) {
                if (test.result[1][0] === true || test.result[1][0] === "permit") {
                    if (result.result[1].filter((e) => e[0] === true || e[0] === "permit").length !== test.result[1][1]) {
                        flag = false;
                    }
                } else {
                    if (result.result[1].filter((e, i) => (e[0] === true || e[0] === "permit") && i < test.result[1][1]).length !== test.result[1][1] - 1) {
                        flag = false;
                    }
                }
            }
        }
        return flag; // Zwraca true, jeśli wszystkie testy przejdą, w przeciwnym razie false
    };

}

module.exports = { Task };