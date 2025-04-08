/*
    Created by Kammar1006
*/

const PORT = 5003;
const COOKIE_FLAG = "example_cookie";

const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
app.use(express.static(`${__dirname}/../frontend`));

const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const { randomBytes } = require("crypto");
const { Task } = require("./task");

let translationTab = [];
const setCID = (sock) => {
	//console.log(sock.request.headers.cookie);
	let cid;
	if (sock.handshake.headers.cookie == undefined) {
		return false;
	}
	let cookie = sock.handshake.headers.cookie.split(" ");
	cookie.forEach((element) => {
		if (element.split("=")[0] == COOKIE_FLAG) cid = element.split("=")[1];
	});
	if (cid == undefined || cid == "") {
		return false;
	} 
	else{
		if (cid[cid.length - 1] == ";") {
			cid = cid.substring(0, cid.length - 1);
		}
	}
	return cid;
};

const setTranslationTab = (cid) => {
	if (translationTab[cid] == undefined) {
		translationTab[cid] = {
			user_id: -1,
			sid: 0,
			test_counter: 0,
			task: new Task(),
			progress: 0,
			in_progress: 0,
		};
		translationTab[cid].task.set(1); // Initialize the task with ID 1
	}
};

const load_question = (id) => {
	return `Q${id}`;
};

io.on("connection", (sock) => {
	let cid = setCID(sock);
	if (!cid) {
		cid = randomBytes(30).toString("hex");
		sock.emit(
		"set-cookie",
		`${COOKIE_FLAG}=${cid}; Path=/; SameSite=None; Secure`
		);
	}
	setTranslationTab(cid);

	console.log("User: " + cid);
	if (translationTab[cid].sid)
		sock.emit("set_sid", true, translationTab[cid].sid);

	sock.on("set_sid", (sid) => {
		console.log(sid);
		if (sid > 270000 && sid < 280000) {
			translationTab[cid].sid = sid;
			sock.emit("set_sid", true, translationTab[cid].sid);
		} 
		else sock.emit("set_sid", false);
	});

	sock.on("get_rules", (device_id, interface_id, type) => {
		sock.emit("rules",translationTab[cid].task.network.configure(device_id, interface_id, type));
	});

	sock.on("add_rule", (device_id, interface_id, type, rule) => {
		sock.emit("rules", translationTab[cid].task.network.configure(device_id, interface_id, type, "add", -1, rule));
	});

	sock.on("edit_rule", (device_id, interface_id, type, id, rule) => {
		sock.emit("rules", translationTab[cid].task.network.configure(device_id, interface_id, type, "edit", id, rule));
	});

	sock.on("remove_rule", (device_id, interface_id, type, id) => {
		sock.emit("rules", translationTab[cid].task.network.configure(device_id, interface_id, type, "remove", id, ""));
	});

	sock.on("export_iptables", (device_id, interface_id, type) => {
		sock.emit("rules", translationTab[cid].task.network.configure(device_id, interface_id, type, "export_iptables"));
	});

	sock.on("export_cisco", (device_id, interface_id, type) => {
		sock.emit("rules", translationTab[cid].task.network.configure(device_id, interface_id, type, "export_cisco"));
	});

	sock.on("get_questions", () => {
		if ((translationTab[cid].in_progress = 0))
		sock.emit("question", load_question(translationTab[cid].progress + 1));
	});

	sock.on("counter", () => {
		translationTab[cid].test_counter++;
		sock.emit("message", "Count: " + translationTab[cid].test_counter);
	});

	sock.on("get_tasks", () => {
		const taskData = {
			titles: [translationTab[cid].task.title], // Include the title
			desc: translationTab[cid].task.desc || ["No description available."],
			tests: translationTab[cid].task.tests || [],
			subtasks: translationTab[cid].task.subtasks || [],
			topology: translationTab[cid].task.topology || {}, // Include topology
		};
		sock.emit("tasks", taskData);
	});

	sock.on("console_command", ({ deviceId, command }) => {
		console.log(`Received command "${command}" for device ${deviceId}`);
		let output = "";

		const args = command.split(" ");
		const cmd = args[0].toLowerCase();

		switch (cmd) {
			case "show":
				if (args[1] === "ip" && args[2] === "interface") {
					output = `Device ${deviceId} - IP Interfaces:\n- Interface 1: 192.168.1.1\n- Interface 2: 10.0.0.1`;
				} else if (args[1] === "running-config") {
					output = "Displaying running configuration...";
				} else {
					output = `Unknown show command: ${command}`;
				}
				break;

			case "add_rule":
				if (args.length === 6) {
					const rule = {
						action: args[1],
						src: args[2],
						des: args[3],
						protocol: args[4],
						port: args[5],
					};
					translationTab[cid].task.network.configure(deviceId, 0, "input", "add", -1, rule);
					output = `Rule added to Device ${deviceId}: ${JSON.stringify(rule)}`;
				} else {
					output = `Invalid add_rule syntax. Usage: add_rule <action> <src> <des> <protocol> <port>`;
				}
				break;

			case "list_rules":
				const rules = translationTab[cid].task.network.configure(deviceId, 0, "input");
				output = `Rules for Device ${deviceId}:\n${rules.map((rule, index) => `${index + 1}. ${JSON.stringify(rule)}`).join("\n")}`;
				break;

			case "delete_rule":
				if (args.length === 2) {
					const ruleIndex = parseInt(args[1], 10) - 1;
					const rulesBefore = translationTab[cid].task.network.configure(deviceId, 0, "input");
					if (ruleIndex >= 0 && ruleIndex < rulesBefore.length) {
						translationTab[cid].task.network.configure(deviceId, 0, "input", "remove", ruleIndex, "");
						output = `Rule ${ruleIndex + 1} deleted from Device ${deviceId}.`;
					} else {
						output = `Invalid rule index. Use "list_rules" to see available rules.`;
					}
				} else {
					output = `Invalid delete_rule syntax. Usage: delete_rule <rule_index>`;
				}
				break;

			case "ping":
				if (args.length === 2) {
					const targetIp = args[1];
					output = `Pinging ${targetIp} from Device ${deviceId}...\nReply from ${targetIp}: bytes=32 time<1ms TTL=64`;
				} else {
					output = `Invalid ping syntax. Usage: ping <target_ip>`;
				}
				break;

			case "run_tests":
				const task = translationTab[cid].task;
				const results = task.tests.map((test, index) => {
					const result = task.network.simulate(
						test.endpoints[0],
						test.endpoints[1],
						test.packet
					);
					const passed = result.result.some(
						(e, i) =>
							(e[0] === test.result[0] || e[0] === "permit") &&
							i === test.result[1] - 1
					);
					return {
						test: index + 1,
						passed,
						expected: test.result,
						actual: result.result,
					};
				});

				output = results
					.map(
						(res) =>
							`Test ${res.test}: ${res.passed ? "PASSED" : "FAILED"}\n` +
							`Expected: ${JSON.stringify(res.expected)}\n` +
							`Actual: ${JSON.stringify(res.actual)}`
					)
					.join("\n\n");
				break;

			case "configure":
				if (args[1] === "terminal") {
					output = "Enter configuration commands, one per line. End with CNTL/Z.";
				} else {
					output = `Invalid configure syntax. Usage: configure terminal`;
				}
				break;

			case "hostname":
				if (args.length === 2) {
					const newHostname = args[1];
					output = `Hostname changed to ${newHostname}`;
				} else {
					output = `Invalid hostname syntax. Usage: hostname <name>`;
				}
				break;

			case "interface":
				if (args.length === 2) {
					output = `Configuring interface ${args[1]}`;
				} else {
					output = `Invalid interface syntax. Usage: interface <name>`;
				}
				break;

			case "ip":
				if (args[1] === "address" && args.length === 4) {
					output = `IP address ${args[2]} with subnet mask ${args[3]} configured.`;
				} else {
					output = `Invalid IP syntax. Usage: ip address <ip> <subnet>`;
				}
				break;

			case "exit":
				output = "Exiting configuration mode.";
				break;

			default:
				output = `Unknown command: ${command}`;
		}

		sock.emit("console_output", { deviceId, output });
	});
});

server.listen(PORT, () => {
	console.log("Work");
});



	task = new Task;
	task.set(1);
	task.network.configure(1, 0, "input", "add", 0, {action: "permit", src: "192.168.1.6 0.0.0.252", des: "192.168.3.2 0.0.0.255", protocol: "ip:80"})
	task.network.configure(1, 0, "input", "add", 0, {action: "deny", src: "any", des: "any", protocol: "any"})
	let logs = task.network.simulate(0, 4, {src: "192.168.1.2", des: "192.168.3.2", protocol: "udp:80"});
	console.log(logs.path);
	console.log(logs.result);
	//console.log(task.check());

