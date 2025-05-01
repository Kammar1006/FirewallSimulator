/* Created by Kammar1006 */

const { Device } = require("./device");
const { Network } = require("./network");
const { Interface } = require("./interface");

function Task() {
    this.network = new Network();

    this.clearRules = () => {
        // Clear all firewall rules for all devices
        for (let device of this.network.devices) {
            if (device.firewall) {
                device.firewall.list = [];
            }
        }
    };

    this.set = (nr) => {
        // Clear existing rules before setting new task
        this.clearRules();
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
                    "Block all other traffic.",
                ];
                this.tests = [
                    {
                        name: "Test 1: TCP/80 from PC_1 to PC_3",
                        endpoints: [0, 4],
                        packet: { src: "192.168.1.2", des: "192.168.3.2", protocol: "tcp:80" },
                        expected: true,
                        description: "Should allow TCP traffic on port 80"
                    },
                    {
                        name: "Test 2: TCP/443 from PC_1 to PC_3",
                        endpoints: [0, 4],
                        packet: { src: "192.168.1.2", des: "192.168.3.2", protocol: "tcp:443" },
                        expected: false,
                        description: "Should block TCP traffic on port 443"
                    },
                    {
                        name: "Test 3: UDP/80 from PC_1 to PC_3",
                        endpoints: [0, 4],
                        packet: { src: "192.168.1.2", des: "192.168.3.2", protocol: "udp:80" },
                        expected: false,
                        description: "Should block UDP traffic"
                    }
                ];
                this.difficulty = "Easy";
                this.subtasks = [
                    { id: 1, title: "Allow TCP/80", description: "Configure firewall to allow TCP traffic on port 80 from PC_1 to PC_3" },
                    { id: 2, title: "Block other traffic", description: "Ensure all other traffic is blocked" }
                ];
            } break;

            case 2: {
                const devices = [
                    new Device("PC_A", ["10.0.0.2"]),
                    new Device("R_A", ["10.0.0.1", "172.16.0.1"]),
                    new Device("R_B", ["172.16.0.2", "192.168.1.1"]),
                    new Device("PC_B", ["192.168.1.2"]),
                    new Device("PC_C", ["192.168.1.3"]),
                    new Device("S_1", ["", ""], 0, 0),
                ];
                const connections = [
                    [1],       // PC_A -> R_A
                    [0, 2, 5], // R_A -> PC_A, R_B, S_1
                    [1, 3, 4], // R_B -> R_A, PC_B, PC_C
                    [2],       // PC_B -> R_B
                    [2],       // PC_C -> R_B
                    [1],       // S_1 -> R_A
                ];

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
                    "Configure the firewall to allow traffic from PC_A to PC_B.",
                    "Ensure traffic from PC_A to PC_C is blocked.",
                    "Allow traffic between PC_B and PC_C."
                ];
                this.tests = [
                    {
                        name: "Test 1: Allow traffic from PC_A to PC_B",
                        endpoints: [0, 3],
                        packet: { src: "10.0.0.2", des: "192.168.1.2", protocol: "tcp:80" },
                        expected: true,
                        description: "Should allow traffic from PC_A to PC_B on port 80"
                    },
                    {
                        name: "Test 2: Block traffic from PC_A to PC_C",
                        endpoints: [0, 4],
                        packet: { src: "10.0.0.2", des: "192.168.1.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block traffic from PC_A to PC_C"
                    },
                    {
                        name: "Test 3: Allow traffic between PC_B and PC_C",
                        endpoints: [3, 4],
                        packet: { src: "192.168.1.2", des: "192.168.1.3", protocol: "udp:53" },
                        expected: true,
                        description: "Should allow traffic between PC_B and PC_C"
                    }
                ];
                this.difficulty = "Medium";
                this.subtasks = [
                    { id: 1, title: "Allow traffic from PC_A to PC_B", description: "Ensure traffic from PC_A to PC_B is allowed." },
                    { id: 2, title: "Block traffic from PC_A to PC_C", description: "Ensure traffic from PC_A to PC_C is blocked." },
                    { id: 3, title: "Allow traffic between PC_B and PC_C", description: "Ensure traffic between PC_B and PC_C is allowed." },
                ];
            } break;

            case 3: {
                const devices = [
                    new Device("PC_X", ["192.168.100.2"]),
                    new Device("R_X", ["192.168.100.1", "10.10.10.1"]),
                    new Device("R_Y", ["10.10.10.2", "172.16.10.1"]),
                    new Device("PC_Y", ["172.16.10.2"]),
                    new Device("S_2", ["", ""], 0, 0), // Switch
                    new Device("PC_Z", ["172.16.10.3"]),
                    new Device("R_Z", ["172.16.10.4", "192.168.200.1"]),
                    new Device("PC_W", ["192.168.200.2"]),
                ];
                const connections = [
                    [1],       // PC_X -> R_X
                    [0, 2, 4], // R_X -> PC_X, R_Y, S_2
                    [1, 3, 6], // R_Y -> R_X, PC_Y, R_Z
                    [2],       // PC_Y -> R_Y
                    [1],       // S_2 -> R_X
                    [2],       // PC_Z -> R_Y
                    [2, 7],    // R_Z -> R_Y, PC_W
                    [6],       // PC_W -> R_Z
                ];

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

                this.title = "Advanced Network Security";
                this.desc = [
                    "Configure the firewall to allow traffic from PC_X to PC_Y.",
                    "Block traffic from PC_X to PC_W.",
                    "Allow traffic between PC_Y and PC_Z."
                ];
                this.tests = [
                    {
                        name: "Test 1: Allow traffic from PC_X to PC_Y",
                        endpoints: [0, 3],
                        packet: { src: "192.168.100.2", des: "172.16.10.2", protocol: "tcp:22" },
                        expected: true,
                        description: "Should allow traffic from PC_X to PC_Y on port 22"
                    },
                    {
                        name: "Test 2: Block traffic from PC_X to PC_W",
                        endpoints: [0, 7],
                        packet: { src: "192.168.100.2", des: "192.168.200.2", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block traffic from PC_X to PC_W"
                    },
                    {
                        name: "Test 3: Allow traffic between PC_Y and PC_Z",
                        endpoints: [3, 5],
                        packet: { src: "172.16.10.2", des: "172.16.10.3", protocol: "udp:53" },
                        expected: true,
                        description: "Should allow traffic between PC_Y and PC_Z"
                    }
                ];
                this.difficulty = "Hard";
                this.subtasks = [
                    { id: 1, title: "Allow traffic from PC_X to PC_Y", description: "Ensure traffic from PC_X to PC_Y is allowed." },
                    { id: 2, title: "Block traffic from PC_X to PC_W", description: "Ensure traffic from PC_X to PC_W is blocked." },
                    { id: 3, title: "Allow traffic between PC_Y and PC_Z", description: "Ensure traffic between PC_Y and PC_Z is allowed." },
                ];
            } break;

            case 4: {
                const devices = [
                    new Device("PC_1", ["192.168.10.2"]),
                    new Device("R_1", ["192.168.10.1", "10.0.0.1"]),
                    new Device("R_2", ["10.0.0.2", "172.16.0.1"]),
                    new Device("PC_2", ["172.16.0.2"]),
                    new Device("PC_3", ["172.16.0.3"]),
                    new Device("S_1", ["", ""], 0, 0), // Switch
                ];
                const connections = [
                    [1],       // PC_1 -> R_1
                    [0, 2, 5], // R_1 -> PC_1, R_2, S_1
                    [1, 3, 4], // R_2 -> R_1, PC_2, PC_3
                    [2],       // PC_2 -> R_2
                    [2],       // PC_3 -> R_2
                    [1],       // S_1 -> R_1
                ];

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

                this.title = "Advanced Firewall Configuration";
                this.desc = [
                    "Allow traffic from PC_1 to PC_2 on port 22.",
                    "Block traffic from PC_1 to PC_3.",
                    "Allow traffic between PC_2 and PC_3."
                ];
                this.tests = [
                    {
                        name: "Test 1: Allow traffic from PC_1 to PC_2",
                        endpoints: [0, 3],
                        packet: { src: "192.168.10.2", des: "172.16.0.2", protocol: "tcp:22" },
                        expected: true,
                        description: "Should allow traffic from PC_1 to PC_2 on port 22"
                    },
                    {
                        name: "Test 2: Block traffic from PC_1 to PC_3",
                        endpoints: [0, 4],
                        packet: { src: "192.168.10.2", des: "172.16.0.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block traffic from PC_1 to PC_3"
                    },
                    {
                        name: "Test 3: Allow traffic between PC_2 and PC_3",
                        endpoints: [3, 4],
                        packet: { src: "172.16.0.2", des: "172.16.0.3", protocol: "udp:53" },
                        expected: true,
                        description: "Should allow traffic between PC_2 and PC_3"
                    }
                ];
                this.difficulty = "Medium";
                this.subtasks = [
                    { id: 1, title: "Allow traffic from PC_1 to PC_2", description: "Ensure traffic from PC_1 to PC_2 is allowed." },
                    { id: 2, title: "Block traffic from PC_1 to PC_3", description: "Ensure traffic from PC_1 to PC_3 is blocked." },
                    { id: 3, title: "Allow traffic between PC_2 and PC_3", description: "Ensure traffic between PC_2 and PC_3 is allowed." },
                ];
            } break;

            case 5: {
                const devices = [
                    new Device("PC_A", ["192.168.50.2"]),
                    new Device("R_A", ["192.168.50.1", "10.50.0.1"]),
                    new Device("R_B", ["10.50.0.2", "172.50.0.1"]),
                    new Device("PC_B", ["172.50.0.2"]),
                    new Device("PC_C", ["172.50.0.3"]),
                    new Device("S_2", ["", ""], 0, 0), // Switch
                    new Device("PC_D", ["172.50.0.4"]),
                ];
                const connections = [
                    [1],       // PC_A -> R_A
                    [0, 2, 5], // R_A -> PC_A, R_B, S_2
                    [1, 3, 4, 6], // R_B -> R_A, PC_B, PC_C, PC_D
                    [2],       // PC_B -> R_B
                    [2],       // PC_C -> R_B
                    [1],       // S_2 -> R_A
                    [2],       // PC_D -> R_B
                ];

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

                this.title = "Complex Firewall Rules";
                this.desc = [
                    "Allow traffic from PC_A to PC_B on port 443.",
                    "Block traffic from PC_A to PC_C.",
                    "Allow traffic between PC_B and PC_D."
                ];
                this.tests = [
                    {
                        name: "Test 1: Allow traffic from PC_A to PC_B",
                        endpoints: [0, 3],
                        packet: { src: "192.168.50.2", des: "172.50.0.2", protocol: "tcp:443" },
                        expected: true,
                        description: "Should allow traffic from PC_A to PC_B on port 443"
                    },
                    {
                        name: "Test 2: Block traffic from PC_A to PC_C",
                        endpoints: [0, 4],
                        packet: { src: "192.168.50.2", des: "172.50.0.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block traffic from PC_A to PC_C"
                    },
                    {
                        name: "Test 3: Allow traffic between PC_B and PC_D",
                        endpoints: [3, 6],
                        packet: { src: "172.50.0.2", des: "172.50.0.4", protocol: "udp:53" },
                        expected: true,
                        description: "Should allow traffic between PC_B and PC_D"
                    }
                ];
                this.difficulty = "Hard";
                this.subtasks = [
                    { id: 1, title: "Allow traffic from PC_A to PC_B", description: "Ensure traffic from PC_A to PC_B is allowed." },
                    { id: 2, title: "Block traffic from PC_A to PC_C", description: "Ensure traffic from PC_A to PC_C is blocked." },
                    { id: 3, title: "Allow traffic between PC_B and PC_D", description: "Ensure traffic between PC_B and PC_D is allowed." },
                ];
            } break;

            case 6: {
                const devices = [
                    new Device("PC_X", ["192.168.100.2"]),
                    new Device("R_X", ["192.168.100.1", "10.100.0.1"]),
                    new Device("R_Y", ["10.100.0.2", "172.100.0.1"]),
                    new Device("PC_Y", ["172.100.0.2"]),
                    new Device("PC_Z", ["172.100.0.3"]),
                    new Device("S_3", ["", ""], 0, 0), // Switch
                    new Device("PC_W", ["172.100.0.4"]),
                    new Device("PC_V", ["172.100.0.5"]),
                ];
                const connections = [
                    [1],       // PC_X -> R_X
                    [0, 2, 5], // R_X -> PC_X, R_Y, S_3
                    [1, 3, 4, 6, 7], // R_Y -> R_X, PC_Y, PC_Z, PC_W, PC_V
                    [2],       // PC_Y -> R_Y
                    [2],       // PC_Z -> R_Y
                    [1],       // S_3 -> R_X
                    [2],       // PC_W -> R_Y
                    [2],       // PC_V -> R_Y
                ];

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

                this.title = "Enterprise Firewall Rules";
                this.desc = [
                    "Allow traffic from PC_X to PC_Y on port 22.",
                    "Block traffic from PC_X to PC_Z.",
                    "Allow traffic between PC_W and PC_V."
                ];
                this.tests = [
                    {
                        name: "Test 1: Allow traffic from PC_X to PC_Y",
                        endpoints: [0, 3],
                        packet: { src: "192.168.100.2", des: "172.100.0.2", protocol: "tcp:22" },
                        expected: true,
                        description: "Should allow traffic from PC_X to PC_Y on port 22"
                    },
                    {
                        name: "Test 2: Block traffic from PC_X to PC_Z",
                        endpoints: [0, 4],
                        packet: { src: "192.168.100.2", des: "172.100.0.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block traffic from PC_X to PC_Z"
                    },
                    {
                        name: "Test 3: Allow traffic between PC_W and PC_V",
                        endpoints: [6, 7],
                        packet: { src: "172.100.0.4", des: "172.100.0.5", protocol: "udp:53" },
                        expected: true,
                        description: "Should allow traffic between PC_W and PC_V"
                    }
                ];
                this.difficulty = "Very Hard";
                this.subtasks = [
                    { id: 1, title: "Allow traffic from PC_X to PC_Y", description: "Ensure traffic from PC_X to PC_Y is allowed." },
                    { id: 2, title: "Block traffic from PC_X to PC_Z", description: "Ensure traffic from PC_X to PC_Z is blocked." },
                    { id: 3, title: "Allow traffic between PC_W and PC_V", description: "Ensure traffic between PC_W and PC_V is allowed." },
                ];
            } break;

            // for next
        }
    };

    this.check = () => {
        console.log("\nRunning tests for Task", this.id);
        let allTestsPassed = true;
        let testResults = [];

        for (const test of this.tests) {
            console.log(`\nExecuting: ${test.name}`);
            console.log(`Description: ${test.description}`);
            
            const result = this.network.simulate(
                test.endpoints[0],
                test.endpoints[1],
                test.packet
            );

            if (!result) {
                console.log("❌ Test failed: No valid path found");
                allTestsPassed = false;
                testResults.push({
                    name: test.name,
                    passed: false,
                    error: "No valid path found"
                });
                continue;
            }

            // Check if the packet was handled as expected
            const packetPermitted = result.result[0].every(r => r[0] === true);
            const testPassed = packetPermitted === test.expected;

            if (testPassed) {
                console.log(`✅ Test passed: ${test.description}`);
            } else {
                console.log(`❌ Test failed: Packet was ${packetPermitted ? 'permitted' : 'blocked'}, expected ${test.expected ? 'permit' : 'block'}`);
                allTestsPassed = false;
            }

            testResults.push({
                name: test.name,
                passed: testPassed,
                expected: test.expected,
                actual: packetPermitted
            });
        }

        console.log("\nTest Summary:");
        testResults.forEach(result => {
            console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
            if (!result.passed) {
                console.log(`   Expected: ${result.expected ? 'permit' : 'block'}`);
                console.log(`   Actual: ${result.actual ? 'permit' : 'block'}`);
            }
        });

        console.log(`\nOverall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
        return allTestsPassed;
    };
}

module.exports = { Task };