/* Created by Kammar1006 */

const { Device } = require("./device");
const { Network } = require("./network");
const { Interface } = require("./interface");

function Task() {
    this.network = new Network();
    this.id = 1;
    this.title = "";
    this.desc = [];
    this.difficulty = "";
    this.subtasks = [];
    this.topology = { devices: [], connections: [] };
    this.hints = [];

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
                        interfaces: device.interfaces.map((iface) => iface.inet || ""),
                    })),
                    connections: connections.flatMap((conn, index) =>
                        conn.map((target) => ({ source: index, target }))
                    ),
                };

                this.title = "Podstawowa konfiguracja zapory sieciowej";
                this.desc = [
                    "Skonfiguruj zaporę, aby umożliwić ruch z PC_1 do PC_3 na porcie 80.",
                    "Zablokuj cały inny ruch.",
                ];
                this.tests = [
                    {
                        name: "Test 1: TCP/80 z PC_1 do PC_3",
                        endpoints: [0, 4],
                        packet: { src: "192.168.1.2", des: "192.168.3.2", protocol: "tcp:80" },
                        expected: true,
                        description: "Powinien zezwolić na ruch TCP na porcie 80",
                    },
                    {
                        name: "Test 2: TCP/443 z PC_1 do PC_3",
                        endpoints: [0, 4],
                        packet: { src: "192.168.1.2", des: "192.168.3.2", protocol: "tcp:443" },
                        expected: false,
                        description: "Powinien zablokować ruch TCP na porcie 443",
                    },
                    {
                        name: "Test 3: UDP/80 z PC_1 do PC_3",
                        endpoints: [0, 4],
                        packet: { src: "192.168.1.2", des: "192.168.3.2", protocol: "udp:80" },
                        expected: false,
                        description: "Powinien zablokować ruch UDP",
                    },
                ];
                this.difficulty = "Easy";
                this.subtasks = [
                    { id: 1, title: "Zezwól na TCP/80", description: "Skonfiguruj zaporę, aby zezwolić na ruch TCP na porcie 80 z PC_1 do PC_3" },
                    { id: 2, title: "Zablokuj inny ruch", description: "Upewnij się, że cały inny ruch jest zablokowany" },
                ];
                this.hints = [
                    "Sprawdź adresy IP źródłowe i docelowe dla każdej reguły",
                    "Upewnij się, że zezwalasz na ruch z PC_1 do PC_3 na porcie 80",
                    "Pamiętaj, aby zablokować ruch z PC_1 do PC_2",
                    "Sprawdź, czy Twoje reguły są w odpowiedniej kolejności - bardziej szczegółowe reguły powinny być pierwsze"
                ];
            } break;

            case 2: {
                const devices = [
                    new Device("PC_A", ["10.0.0.2"]),
                    new Device("S_1", ["", ""], 0, 0), // Switch between PC_A and R_A
                    new Device("R_A", ["10.0.0.1", "172.16.0.1", "192.168.2.1"]), // R_A with 3 interfaces
                    new Device("R_B", ["192.168.2.2", "192.168.1.1"]), // Adjusted R_B to connect to R_A's third interface
                    new Device("PC_B", ["192.168.1.2"]),
                    new Device("PC_C", ["192.168.1.3"]),
                ];
                const connections = [
                    [1],       // PC_A -> S_1
                    [0, 2],    // S_1 -> PC_A, R_A
                    [1, 3, 4], // R_A -> S_1, R_B, PC_B
                    [2, 5],    // R_B -> R_A, PC_C
                    [2],       // PC_B -> R_A
                    [3],       // PC_C -> R_B
                ];

                this.network.set(devices, connections);
                this.topology = {
                    devices: devices.map((device, index) => ({
                        id: index,
                        name: device.name,
                        interfaces: device.interfaces.map((iface) => iface.inet || ""), // Ensure empty strings for missing IPs
                    })),
                    connections: connections.flatMap((conn, index) =>
                        conn.map((target) => ({ source: index, target }))
                    ),
                };

                this.title = "Średniozaawansowane reguły zapory sieciowej";
                this.desc = [
                    "Skonfiguruj zaporę, aby umożliwić ruch z PC_A do PC_B.",
                    "Upewnij się, że ruch z PC_A do PC_C jest zablokowany.",
                    "Zezwól na ruch między PC_B a PC_C.",
                ];
                this.tests = [
                    {
                        name: "Test 1: Zezwól na ruch z PC_A do PC_B",
                        endpoints: [0, 4],
                        packet: { src: "10.0.0.2", des: "192.168.1.2", protocol: "tcp:80" },
                        expected: true,
                        description: "Powinien zezwolić na ruch z PC_A do PC_B na porcie 80. Wymaga reguł na R_A i R_B.",
                    },
                    {
                        name: "Test 2: Zablokuj ruch z PC_A do PC_C",
                        endpoints: [0, 5],
                        packet: { src: "10.0.0.2", des: "192.168.1.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Powinien zablokować ruch z PC_A do PC_C. Wymaga reguł na R_A i R_B.",
                    },
                    {
                        name: "Test 3: Zezwól na ruch między PC_B a PC_C",
                        endpoints: [4, 5],
                        packet: { src: "192.168.1.2", des: "192.168.1.3", protocol: "udp:53" },
                        expected: true,
                        description: "Powinien zezwolić na ruch między PC_B a PC_C. Wymaga reguł na R_B.",
                    },
                    {
                        name: "Test 4: Weryfikacja reguł na R_A",
                        endpoints: [0, 2],
                        packet: { src: "10.0.0.2", des: "192.168.1.2", protocol: "tcp:80" },
                        expected: true,
                        description: "Powinien zezwolić na ruch z PC_A przez R_A. Wymaga reguł na R_A.",
                    },
                    {
                        name: "Test 5: Weryfikacja reguł na R_B",
                        endpoints: [2, 5],
                        packet: { src: "10.0.0.2", des: "192.168.1.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Powinien zablokować ruch z PC_A do PC_C na R_B. Wymaga reguł na R_B.",
                    }
                ];
                this.difficulty = "Medium";
                this.subtasks = [
                    { id: 1, title: "Zezwól na ruch z PC_A do PC_B", description: "Upewnij się, że ruch z PC_A do PC_B jest dozwolony." },
                    { id: 2, title: "Zablokuj ruch z PC_A do PC_C", description: "Upewnij się, że ruch z PC_A do PC_C jest zablokowany." },
                    { id: 3, title: "Zezwól na ruch między PC_B a PC_C", description: "Upewnij się, że ruch między PC_B a PC_C jest dozwolony." },
                ];
                this.hints = [
                    "Start by allowing traffic from PC_A to PC_B on R_A and R_B.",
                    "Remember to block traffic from PC_A to PC_C on both R_A and R_B.",
                    "Don't forget to configure the necessary rules on R_B for traffic between PC_B and PC_C.",
                    "Test your configuration with the send_packet command to ensure correctness.",
                ];
            } break;

            case 3: {
                const devices = [
                    new Device("PC_X", ["192.168.100.2"]),
                    new Device("R_X", ["192.168.100.1", "10.10.10.1"]),
                    new Device("R_Y", ["10.10.10.2", "172.16.10.1", "172.16.10.5"]),
                    new Device("S_2", ["", ""], 0, 0), // Switch
                    new Device("PC_Y", ["172.16.10.2"]),
                    new Device("PC_Z", ["172.16.10.3"]),
                    new Device("R_Z", ["172.16.10.4", "192.168.200.1"]),
                    new Device("PC_W", ["192.168.200.2"]),
                ];
                const connections = [
                    [1],       // PC_X -> R_X
                    [0, 2, 3], // R_X -> PC_X, R_Y, S_2
                    [1, 4, 5, 6], // R_Y -> R_X, PC_Y, PC_Z, R_Z
                    [1],       // S_2 -> R_X
                    [2],       // PC_Y -> R_Y
                    [2],       // PC_Z -> R_Y
                    [2, 7],    // R_Z -> R_Y, PC_W
                    [6],       // PC_W -> R_Z
                ];

                this.network.set(devices, connections);
                this.topology = {
                    devices: devices.map((device, index) => ({
                        id: index,
                        name: device.name,
                        interfaces: device.interfaces.map((iface) => iface.inet || ""), // Ensure empty strings for missing IPs
                    })),
                    connections: connections.flatMap((conn, index) =>
                        conn.map((target) => ({ source: index, target }))
                    ),
                };

                this.title = "Zaawansowane zabezpieczenia sieci";
                this.desc = [
                    "Skonfiguruj zaporę, aby umożliwić ruch z PC_X do PC_Y.",
                    "Zablokuj ruch z PC_X do PC_W.",
                    "Zezwól na ruch między PC_Y a PC_Z.",
                ];
                this.tests = [
                    {
                        name: "Test 1: Zezwól na ruch z PC_X do PC_Y",
                        endpoints: [0, 4],
                        packet: { src: "192.168.100.2", des: "172.16.10.2", protocol: "tcp:22" },
                        expected: true,
                        description: "Powinien zezwolić na ruch z PC_X do PC_Y na porcie 22. Wymaga reguł na R_X i R_Y.",
                    },
                    {
                        name: "Test 2: Zablokuj ruch z PC_X do PC_W",
                        endpoints: [0, 7],
                        packet: { src: "192.168.100.2", des: "192.168.200.2", protocol: "tcp:80" },
                        expected: false,
                        description: "Powinien zablokować ruch z PC_X do PC_W. Wymaga reguł na R_X i R_Z.",
                    },
                    {
                        name: "Test 3: Zezwól na ruch między PC_Y a PC_Z",
                        endpoints: [4, 5],
                        packet: { src: "172.16.10.2", des: "172.16.10.3", protocol: "udp:53" },
                        expected: true,
                        description: "Powinien zezwolić na ruch między PC_Y a PC_Z. Wymaga reguł na R_Y.",
                    },
                    {
                        name: "Test 4: Zablokuj ruch z PC_X do PC_Z",
                        endpoints: [0, 5],
                        packet: { src: "192.168.100.2", des: "172.16.10.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Powinien zablokować ruch z PC_X do PC_Z. Wymaga reguł na R_X i R_Y.",
                    },
                    {
                        name: "Test 5: Zezwól na ruch z PC_Y do PC_W",
                        endpoints: [4, 7],
                        packet: { src: "172.16.10.2", des: "192.168.200.2", protocol: "tcp:443" },
                        expected: true,
                        description: "Powinien zezwolić na ruch z PC_Y do PC_W. Wymaga reguł na R_Y i R_Z.",
                    },
                    {
                        name: "Test 6: Zablokuj ruch z PC_Z do PC_W",
                        endpoints: [5, 7],
                        packet: { src: "172.16.10.3", des: "192.168.200.2", protocol: "tcp:80" },
                        expected: false,
                        description: "Powinien zablokować ruch z PC_Z do PC_W. Wymaga reguł na R_Z.",
                    },
                    {
                        name: "Test 7: Zezwól na ruch z PC_X do R_Y",
                        endpoints: [0, 2],
                        packet: { src: "192.168.100.2", des: "10.10.10.2", protocol: "tcp:22" },
                        expected: true,
                        description: "Powinien zezwolić na ruch z PC_X do R_Y. Wymaga reguł na R_X.",
                    },
                    {
                        name: "Test 8: Zablokuj ruch z PC_X do R_Z",
                        endpoints: [0, 6],
                        packet: { src: "192.168.100.2", des: "172.16.10.4", protocol: "tcp:80" },
                        expected: false,
                        description: "Powinien zablokować ruch z PC_X do R_Z. Wymaga reguł na R_X i R_Z.",
                    },
                ];
                this.difficulty = "Hard";
                this.subtasks = [
                    { id: 1, title: "Zezwól na ruch z PC_X do PC_Y", description: "Upewnij się, że ruch z PC_X do PC_Y jest dozwolony." },
                    { id: 2, title: "Zablokuj ruch z PC_X do PC_W", description: "Upewnij się, że ruch z PC_X do PC_W jest zablokowany." },
                    { id: 3, title: "Zezwól na ruch między PC_Y a PC_Z", description: "Upewnij się, że ruch między PC_Y a PC_Z jest dozwolony." },
                    { id: 4, title: "Zablokuj ruch z PC_X do PC_Z", description: "Upewnij się, że ruch z PC_X do PC_Z jest zablokowany." },
                    { id: 5, title: "Zezwól na ruch z PC_Y do PC_W", description: "Upewnij się, że ruch z PC_Y do PC_W jest dozwolony." },
                ];
                this.hints = [
                    "Skonfiguruj reguły na R_X, aby zezwolić na ruch z PC_X do PC_Y.",
                    "Zablokuj ruch z PC_X do PC_W na R_X i R_Z.",
                    "Zezwól na ruch między PC_Y a PC_Z na R_Y.",
                    "Zablokuj ruch z PC_X do PC_Z na R_X i R_Y.",
                    "Zezwól na ruch z PC_Y do PC_W na R_Y i R_Z.",
                ];
            } break;

            case 4: {
                // Small office: PC_1, PC_2, PC_3 -> S_1 -> R_1 -> PC_4 (Internet)
                const devices = [
                    new Device("PC_1", ["10.10.1.2"]),
                    new Device("PC_2", ["10.10.1.3"]),
                    new Device("PC_3", ["10.10.1.4"]),
                    new Device("S_1", ["", "", "", ""], 0, 0),
                    new Device("R_1", ["10.10.1.1", "192.0.2.1"]),
                    new Device("PC_4", ["192.0.2.2"]), // Internet server
                ];
                const connections = [
                    [3],        // PC_1 -> S_1
                    [3],        // PC_2 -> S_1
                    [3],        // PC_3 -> S_1
                    [0, 1, 2, 4], // S_1 -> PC_1, PC_2, PC_3, R_1
                    [3, 5],     // R_1 -> S_1, PC_4
                    [4],        // PC_4 -> R_1
                ];
                this.network.set(devices, connections);
                this.topology = {
                    devices: devices.map((device, index) => ({
                        id: index,
                        name: device.name,
                        interfaces: device.interfaces.map((iface) => iface.inet || "")
                    })),
                    connections: connections.flatMap((conn, index) =>
                        conn.map((target) => ({ source: index, target }))
                    )
                };
                this.title = "Small Office Firewall";
                this.desc = [
                    "Allow HTTP (tcp:80) from any PC to PC_4 (Internet server)",
                    "Block all other outgoing traffic from PCs to PC_4",
                    "Allow DNS (udp:53) from any PC to PC_4"
                ];
                this.tests = [
                    {
                        name: "Test 1: Allow HTTP from PC_1 to PC_4",
                        endpoints: [0, 5],
                        packet: { src: "10.10.1.2", des: "192.0.2.2", protocol: "tcp:80" },
                        expected: true,
                        description: "Should allow HTTP from PC_1 to Internet server"
                    },
                    {
                        name: "Test 2: Block SSH from PC_2 to PC_4",
                        endpoints: [1, 5],
                        packet: { src: "10.10.1.3", des: "192.0.2.2", protocol: "tcp:22" },
                        expected: false,
                        description: "Should block SSH from PC_2 to Internet server"
                    },
                    {
                        name: "Test 3: Allow DNS from PC_3 to PC_4",
                        endpoints: [2, 5],
                        packet: { src: "10.10.1.4", des: "192.0.2.2", protocol: "udp:53" },
                        expected: true,
                        description: "Should allow DNS from PC_3 to Internet server"
                    },
                    // --- Additional tests ---
                    {
                        name: "Test 4: Allow HTTP from PC_2 to PC_4",
                        endpoints: [1, 5],
                        packet: { src: "10.10.1.3", des: "192.0.2.2", protocol: "tcp:80" },
                        expected: true,
                        description: "Should allow HTTP from PC_2 to Internet server"
                    },
                    {
                        name: "Test 5: Allow DNS from PC_1 to PC_4",
                        endpoints: [0, 5],
                        packet: { src: "10.10.1.2", des: "192.0.2.2", protocol: "udp:53" },
                        expected: true,
                        description: "Should allow DNS from PC_1 to Internet server"
                    },
                    {
                        name: "Test 6: Block ICMP from PC_1 to PC_4",
                        endpoints: [0, 5],
                        packet: { src: "10.10.1.2", des: "192.0.2.2", protocol: "icmp:any" },
                        expected: false,
                        description: "Should block ICMP (ping) from PC_1 to Internet server"
                    },
                    {
                        name: "Test 7: Block UDP/9999 from PC_3 to PC_4",
                        endpoints: [2, 5],
                        packet: { src: "10.10.1.4", des: "192.0.2.2", protocol: "udp:9999" },
                        expected: false,
                        description: "Should block UDP/9999 from PC_3 to Internet server"
                    },
                    {
                        name: "Test 8: Block TCP/443 from PC_1 to PC_4",
                        endpoints: [0, 5],
                        packet: { src: "10.10.1.2", des: "192.0.2.2", protocol: "tcp:443" },
                        expected: false,
                        description: "Should block HTTPS from PC_1 to Internet server"
                    },
                    // {
                    //     name: "Test 9: Block HTTP from PC_1 to PC_3",
                    //     endpoints: [0, 2],
                    //     packet: { src: "10.10.1.2", des: "10.10.1.4", protocol: "tcp:80" },
                    //     expected: false,
                    //     description: "Should block HTTP from PC_1 to PC_3 (no rule for this)"
                    // }
                ];
                this.difficulty = "Medium";
                this.subtasks = [
                    { id: 1, title: "Allow HTTP", description: "Allow HTTP from all PCs to Internet server" },
                    { id: 2, title: "Block other outgoing", description: "Block all other outgoing traffic from PCs to Internet server" },
                    { id: 3, title: "Allow DNS", description: "Allow DNS from all PCs to Internet server" }
                ];
                this.hints = [
                    "HTTP uses tcp:80, DNS uses udp:53",
                    "Block all except allowed protocols",
                    "Rules should be on R_1 input/output"
                ];
            } break;

            case 5: {
                // Medium: PC_A, PC_B -> S_A -> R_A -> S_B -> PC_C, PC_D
                const devices = [
                    new Device("PC_A", ["172.16.1.2"]),
                    new Device("PC_B", ["172.16.1.3"]),
                    new Device("S_A", ["", "", ""], 0, 0),
                    new Device("R_A", ["172.16.1.1", "10.20.1.1"]),
                    new Device("S_B", ["", "", ""], 0, 0),
                    new Device("PC_C", ["10.20.1.2"]),
                    new Device("PC_D", ["10.20.1.3"]),
                ];
                const connections = [
                    [2],        // PC_A -> S_A
                    [2],        // PC_B -> S_A
                    [0, 1, 3],  // S_A -> PC_A, PC_B, R_A
                    [2, 4],     // R_A -> S_A, S_B
                    [3, 5, 6],  // S_B -> R_A, PC_C, PC_D
                    [4],        // PC_C -> S_B
                    [4],        // PC_D -> S_B
                ];
                this.network.set(devices, connections);
                this.topology = {
                    devices: devices.map((device, index) => ({
                        id: index,
                        name: device.name,
                        interfaces: device.interfaces.map((iface) => iface.inet || "")
                    })),
                    connections: connections.flatMap((conn, index) =>
                        conn.map((target) => ({ source: index, target }))
                    )
                };
                this.title = "Two-Switch Segmented Network";
                this.desc = [
                    "Allow SSH (tcp:22) from PC_A to PC_C",
                    "Block all traffic from PC_B to PC_D",
                    "Allow HTTP (tcp:80) from PC_A to PC_D"
                ];
                this.tests = [
                    {
                        name: "Test 1: Allow SSH from PC_A to PC_C",
                        endpoints: [0, 5],
                        packet: { src: "172.16.1.2", des: "10.20.1.2", protocol: "tcp:22" },
                        expected: true,
                        description: "Should allow SSH from PC_A to PC_C"
                    },
                    {
                        name: "Test 2: Block all from PC_B to PC_D",
                        endpoints: [1, 6],
                        packet: { src: "172.16.1.3", des: "10.20.1.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block all from PC_B to PC_D"
                    },
                    {
                        name: "Test 3: Allow HTTP from PC_A to PC_D",
                        endpoints: [0, 6],
                        packet: { src: "172.16.1.2", des: "10.20.1.3", protocol: "tcp:80" },
                        expected: true,
                        description: "Should allow HTTP from PC_A to PC_D"
                    },
                    // --- Additional tests ---
                    {
                        name: "Test 4: Block SSH from PC_B to PC_C",
                        endpoints: [1, 5],
                        packet: { src: "172.16.1.3", des: "10.20.1.2", protocol: "tcp:22" },
                        expected: false,
                        description: "Should block SSH from PC_B to PC_C"
                    },
                    {
                        name: "Test 5: Block HTTP from PC_B to PC_C",
                        endpoints: [1, 5],
                        packet: { src: "172.16.1.3", des: "10.20.1.2", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block HTTP from PC_B to PC_C"
                    },
                    {
                        name: "Test 6: Block HTTP from PC_A to PC_C",
                        endpoints: [0, 5],
                        packet: { src: "172.16.1.2", des: "10.20.1.2", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block HTTP from PC_A to PC_C (only SSH allowed)"
                    },
                    {
                        name: "Test 7: Block SSH from PC_A to PC_D",
                        endpoints: [0, 6],
                        packet: { src: "172.16.1.2", des: "10.20.1.3", protocol: "tcp:22" },
                        expected: false,
                        description: "Should block SSH from PC_A to PC_D (only HTTP allowed)"
                    },
                    {
                        name: "Test 8: Block UDP/53 from PC_A to PC_D",
                        endpoints: [0, 6],
                        packet: { src: "172.16.1.2", des: "10.20.1.3", protocol: "udp:53" },
                        expected: false,
                        description: "Should block DNS from PC_A to PC_D (no rule for DNS)"
                    },
                    {
                        name: "Test 9: Block HTTP from PC_B to PC_D",
                        endpoints: [1, 6],
                        packet: { src: "172.16.1.3", des: "10.20.1.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block HTTP from PC_B to PC_D"
                    },
                    // {
                    //     name: "Test 10: Block HTTP from PC_A to PC_B",
                    //     endpoints: [0, 1],
                    //     packet: { src: "172.16.1.2", des: "172.16.1.3", protocol: "tcp:80" },
                    //     expected: false,
                    //     description: "Should block HTTP from PC_A to PC_B (no rule for this)"
                    // }
                ];
                this.difficulty = "Hard";
                this.subtasks = [
                    { id: 1, title: "Allow SSH", description: "Allow SSH from PC_A to PC_C" },
                    { id: 2, title: "Block PC_B to PC_D", description: "Block all traffic from PC_B to PC_D" },
                    { id: 3, title: "Allow HTTP", description: "Allow HTTP from PC_A to PC_D" }
                ];
                this.hints = [
                    "SSH uses tcp:22, HTTP uses tcp:80",
                    "Block all from PC_B to PC_D",
                    "Rules should be on R_A input/output"
                ];
            } break;

            case 6: {
                const devices = [
                    new Device("PC_1", ["192.168.10.2"]),
                    new Device("PC_2", ["192.168.10.3"]),
                    new Device("S_1", ["", "", ""], 0, 0),
                    new Device("R_1", ["192.168.10.1", "10.30.1.1"]),
                    new Device("R_2", ["10.30.1.2", "172.16.20.1"]),
                    new Device("S_2", ["", "", ""], 0, 0),
                    new Device("PC_3", ["172.16.20.2"]),
                    new Device("PC_4", ["172.16.20.3"]),
                ];
                const connections = [
                    [2],        // PC_1 -> S_1
                    [2],        // PC_2 -> S_1
                    [0, 1, 3],  // S_1 -> PC_1, PC_2, R_1
                    [2, 4],     // R_1 -> S_1, R_2
                    [3, 5],     // R_2 -> R_1, S_2
                    [4, 6, 7],  // S_2 -> R_2, PC_3, PC_4
                    [5],        // PC_3 -> S_2
                    [5],        // PC_4 -> S_2
                ];
                this.network.set(devices, connections);
                this.topology = {
                    devices: devices.map((device, index) => ({
                        id: index,
                        name: device.name,
                        interfaces: device.interfaces.map((iface) => iface.inet || "")
                    })),
                    connections: connections.flatMap((conn, index) =>
                        conn.map((target) => ({ source: index, target }))
                    )
                };
                this.title = "Enterprise Routed Network";
                this.desc = [
                    "Allow FTP (tcp:21) from PC_1 to PC_3",
                    "Block all from PC_2 to PC_4",
                    "Allow SMTP (tcp:25) from PC_1 to PC_4"
                ];
                this.tests = [
                    {
                        name: "Test 1: Allow FTP from PC_1 to PC_3",
                        endpoints: [0, 6],
                        packet: { src: "192.168.10.2", des: "172.16.20.2", protocol: "tcp:21" },
                        expected: true,
                        description: "Should allow FTP from PC_1 to PC_3. Requires rules on both R_1 and R_2.",
                    },
                    {
                        name: "Test 2: Block all from PC_2 to PC_4",
                        endpoints: [1, 7],
                        packet: { src: "192.168.10.3", des: "172.16.20.3", protocol: "tcp:80" },
                        expected: false,
                        description: "Should block all from PC_2 to PC_4. Requires rules on both R_1 and R_2.",
                    },
                    {
                        name: "Test 3: Allow SMTP from PC_1 to PC_4",
                        endpoints: [0, 7],
                        packet: { src: "192.168.10.2", des: "172.16.20.3", protocol: "tcp:25" },
                        expected: true,
                        description: "Should allow SMTP from PC_1 to PC_4. Requires rules on both R_1 and R_2.",
                    },
                    {
                        name: "Test 4: Validate R_2 input rules for FTP",
                        endpoints: [3, 4],
                        packet: { src: "192.168.10.2", des: "172.16.20.2", protocol: "tcp:21" },
                        expected: true,
                        description: "R_2 should allow FTP traffic from R_1 to PC_3.",
                    },
                    {
                        name: "Test 5: Validate R_2 input rules for SMTP",
                        endpoints: [3, 4],
                        packet: { src: "192.168.10.2", des: "172.16.20.3", protocol: "tcp:25" },
                        expected: true,
                        description: "R_2 should allow SMTP traffic from R_1 to PC_4.",
                    },
                    {
                        name: "Test 6: Validate R_2 input rules for blocking PC_2",
                        endpoints: [3, 4],
                        packet: { src: "192.168.10.3", des: "172.16.20.3", protocol: "tcp:80" },
                        expected: false,
                        description: "R_2 should block traffic from PC_2 to PC_4.",
                    }
                ];
                this.difficulty = "Hard";
                this.subtasks = [
                    { id: 1, title: "Allow FTP", description: "Allow FTP from PC_1 to PC_3" },
                    { id: 2, title: "Block PC_2 to PC_4", description: "Block all from PC_2 to PC_4" },
                    { id: 3, title: "Allow SMTP", description: "Allow SMTP from PC_1 to PC_4" }
                ];
                this.hints = [
                    "FTP uses tcp:21, SMTP uses tcp:25",
                    "Block all from PC_2 to PC_4",
                    "Rules should be on both R_1 and R_2"
                ];

                // Add required rules
                this.network.configure(3, 0, "output", "add", -1, { action: "permit", src: "192.168.10.2", des: "172.16.20.2", protocol: "tcp:21" }); // R_1 for FTP
                this.network.configure(4, 0, "input", "add", -1, { action: "permit", src: "192.168.10.2", des: "172.16.20.2", protocol: "tcp:21" }); // R_2 for FTP
                this.network.configure(3, 0, "output", "add", -1, { action: "deny", src: "192.168.10.3", des: "172.16.20.3", protocol: "any" }); // R_1 to block PC_2 to PC_4
                this.network.configure(4, 0, "input", "add", -1, { action: "deny", src: "192.168.10.3", des: "172.16.20.3", protocol: "any" }); // R_2 to block PC_2 to PC_4
                this.network.configure(3, 0, "output", "add", -1, { action: "permit", src: "192.168.10.2", des: "172.16.20.3", protocol: "tcp:25" }); // R_1 for SMTP
                this.network.configure(4, 0, "input", "add", -1, { action: "permit", src: "192.168.10.2", des: "172.16.20.3", protocol: "tcp:25" }); // R_2 for SMTP
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