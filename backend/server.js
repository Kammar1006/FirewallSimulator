/*
    Created by Kammar1006
*/

const PORT = 5003;
const COOKIE_FLAG = "example_cookie";

const express = require("express");
const path = require('path');
const http = require("http");
const socketio = require("socket.io");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/../frontend/dist`));

const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		credentials: true,
	},
});

const { randomBytes } = require("crypto");
const { Task } = require("./task");

let translationTab = [];
let studentSocketMap = {}; // studentId -> [socketId, ...]

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
			consoleHistory: [],
		};
		translationTab[cid].task.set(1);
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

	sock.on("switch_task", (taskId) => {
		if (translationTab[cid]) {
			translationTab[cid].task.set(taskId);
			console.log(`Switched to task ${taskId} for user ${cid}`);
		}
	});

	sock.on("set_sid", (sid) => {
		console.log(sid);
		if (sid > 270000 && sid < 280000) {
			translationTab[cid].sid = sid;
			sock.emit("set_sid", true, translationTab[cid].sid);
			if (!studentSocketMap[sid]) studentSocketMap[sid] = [];
			if (!studentSocketMap[sid].includes(sock.id)) studentSocketMap[sid].push(sock.id);
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
		const tasks = [];
		for (let i = 1; i <= 6; i++) {
			const task = new Task();
			task.set(i);
			tasks.push({
				id: i,
				title: task.title,
				desc: task.desc,
				difficulty: task.difficulty,
				subtasks: task.subtasks,
				topology: task.topology,
				hints: task.hints || [],
			});
		}
		sock.emit("tasks", tasks);
	});

	sock.on("send_packet", (src_id, des_id, protocol, port) => {
		console.log(src_id, des_id)
		let network = translationTab[cid].task.network;
		if(!(0 <= Number(src_id) && Number(src_id) < network.devices.length)) return;
		try{
			des_id = network.findId(des_id);
		}
		catch(err){
			console.log(err);
		}
		if(!(0 <= Number(des_id) && Number(des_id) < network.devices.length) && des_id !== false) return;
		let res = network.simulate(src_id, des_id, {src: network.devices[src_id].interfaces[0], des: network.devices[des_id].interfaces[0], protocol: protocol+":"+port});
		console.log("HI")
		sock.emit("packet_response", JSON.stringify(res));
	});

	sock.on("console_command", ({ deviceId, command }) => {
		console.log(`Received command "${command}" for device ${deviceId}`);
		let output = "";

		const args = command.split(" ");
		const cmd = args[0].toLowerCase();

		let network = translationTab[cid].task.network;

		if(!(0 <= Number(deviceId) && Number(deviceId) < network.devices.length)) return;

		let device = network.devices[deviceId];

		let mode = device.configuration_mode;

		if(mode == "main"){
			switch (cmd) {
				case "interface": case "int":{
					if (args.length === 2 && device.configurability == 1) {
						let int = Number(args[1])
						if(!(0 <= int && int < device.interfaces.length)){
							output = `Invalid interface number. Out of range.`;
							break;
						}
						else{
							output = `Configuring interface ${args[1]}`;
							device.configuration_mode = "int";
							device.configuration_submode = int;
						}
					} else if(device.configurability == 1){
						output = `Invalid interface syntax. Usage: interface <name>`;
					}
				}break;
				case "sp": case "send_packet":{
					//console.log(device)
					if (args.length === 4 && device.routability == 1) {
						
						let protocol = args[2]
						let port = args[3]

						try{
							let des_id = network.findId(args[1])
							console.log(des_id)
	
							if(!(0 <= des_id && des_id < network.devices.length && des_id !== false)){
								output = `Invalid des device ind`;
								break;
							}

							result = (network.simulate(deviceId, des_id, {src: network.devices[deviceId].interfaces[0], des: network.devices[des_id].interfaces[0], protocol: protocol+":"+port}));

							req = result.result[0].filter((e) => e.res[0] === true || e.res[0] === "permit").length == result.result[0].length
							res = result.result[1].filter((e) => e.res[0] === true || e.res[0] === "permit").length == result.result[1].length
							//console.log(result.result[0].filter((e) => e.res[0] === true || e.res[0] === "permit").length, result.result[0].length);
							//console.log(result.result[1].filter((e) => e.res[0] === true || e.res[0] === "permit").length, result.result[1].length);
	
							output = "Result: "+(req && res)+"\n"+JSON.stringify(result)
						}
						catch(err){
							console.log(err)
						}
						

					} else if(device.routability == 1) {
						output = `Invalid interface syntax. Usage: send_packet <des_device_id> <tcp|udp|icmp|ip> <?port>`;
					}
				}break;
				case "help": {
					output = "Command Lists:";
					if(device.configurability) output += "\ninterface <number>"
					if(device.routability) output += "\nsend_packet <des_device_id> <tcp|udp|icmp|ip> <?port>"
				}break;
			}
		}
		else if(mode == "int"){
			let int = Number(device.configuration_submode);
			switch (cmd) {
				case "add_rule":{
					if (args.length >= 5) {
						const rule = {
							type: args[1],
							action: args[2],
							src: args[3],
							des: args[4],
							protocol: args[5] ? args[5] : "any", // Default to "any" if not specified
						};

						if(rule.type == "o" || rule.type == "out" || rule.type == "output"){
							rule.type = "output";
						}
						else if(rule.type == "i" || rule.type == "in" || rule.type == "input"){
							rule.type = "input";
						}
						else{
							output = `Invalid rule syntax. Usage: add_rule <input|output> <permit|deny> <src> <des> <protocol> <port>`;
							break;
						}

						const isValid = ["permit", "deny"].includes(rule.action) && rule.src && rule.des && rule.protocol;
						if (isValid) {
							// Fix: Format protocol with colon if port is provided
							if (args.length >= 6 && args[6]) {
								rule.protocol = `${rule.protocol}:${args[6]}`;
							}
							
							// Special handling for "any" protocol
							if (rule.protocol === "any" && args.length >= 6 && args[6] === "any") {
								rule.protocol = "any:any";
							}
							
							translationTab[cid].task.network.configure(deviceId, int, rule.type, "add", -1, rule);
							output = `Rule added to Device ${deviceId} and Int ${int}: ${JSON.stringify(rule)}`;
						} else {
							output = `Invalid rule syntax. Usage: add_rule <input|output> <permit|deny> <src> <des> <protocol> <port>`;
						}
					} else {
						output = `Invalid add_rule syntax. Usage: add_rule <input|output> <permit|deny> <src> <des> <protocol> <port>`;
					}
				}break;
				case "list_rules":{
					const rules1 = translationTab[cid].task.network.configure(deviceId, int, "input");
					const rules2 = translationTab[cid].task.network.configure(deviceId, int, "output");
					if (rules1.length + rules2.length > 0) {
						output = `Rules for Device ${deviceId} and Int ${int}:`;
						output += `\n "INPUT rules:"`;
						output += `\n${rules1.map((rule, index) => `${index + 1}. ${JSON.stringify(rule)}`).join("\n")}`;
						output += `\n "OUTPUT rules:"`;
						output += `\n${rules2.map((rule, index) => `${index + 1}. ${JSON.stringify(rule)}`).join("\n")}`;
					} else {
						output = `No rules configured for Device ${deviceId} and Int ${int}.`;
					}
				}break;
				case "delete_rule":{
					if (args.length === 3) {
						const ruleIndex = parseInt(args[2], 10) - 1;

						let type = args[1];
						if(type == "o" || type == "out" || type == "output"){
							type = "output";
						}
						else if(type == "i" || type == "in" || type == "input"){
							type = "input";
						}
						else{
							output = `Invalid rule type. Must choose between input and output.`;
							break;
						}

						const rulesBefore = translationTab[cid].task.network.configure(deviceId, int, "input");
						if (ruleIndex >= 0 && ruleIndex < rulesBefore.length) {
							translationTab[cid].task.network.configure(deviceId, int, "input", "remove", ruleIndex, "");
							output = `Rule ${ruleIndex + 1} deleted from Device ${deviceId} and Int ${int}.`;
						} else {
							output = `Invalid rule index. Use "list_rules" to see available rules.`;
						}
					} else {
						output = `Invalid delete_rule syntax. Usage: delete_rule <input|output> <rule_index>`;
					}
				}break;
				case "exit":{
					output = "Exiting configuration mode.";
					device.configuration_mode = "main";
				}break;
				case "help": {
					output = "Command Lists:";
					output += "\nexit"
					output += "\nadd_rule <input|output> <permit|deny> <src> <des> <protocol> <port>"
					output += "\nlist_rules"
					output += "\ndelete_rule <input|output> <rule_index>"
				}break;
			}
		}
		if(device.configurability == 0){
			output += `\nDevice is unconfigurable.`;
		}

			/*
			case "show":
				if (args[1] === "ip" && args[2] === "interface") {
					output = `Device ${deviceId} - IP Interfaces:\n- Interface 1: 192.168.1.1\n- Interface 2: 10.0.0.1`;
				} else if (args[1] === "running-config") {
					output = "Displaying running configuration...";
				} else {
					output = `Unknown show command: ${command}`;
				}
				break;
			*/

			

			/*
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

			case "ip":
				if (args[1] === "address" && args.length === 4) {
					output = `IP address ${args[2]} with subnet mask ${args[3]} configured.`;
				} else {
					output = `Invalid IP syntax. Usage: ip address <ip> <subnet>`;
				}
				break;
			

			case "en":
			case "enable":
				output = "Entering privileged EXEC mode.";
				break;

			case "conf":
			case "configure":
				if (args[1] === "t" || args[1] === "terminal") {
					output = "Enter configuration commands, one per line. End with CNTL/Z.";
				} else {
					output = `Invalid configure syntax. Usage: configure terminal or conf t`;
				}
				break;

			case "end":
				output = "Exiting configuration mode.";
				break;

			case "exit":
				output = "Exiting current mode.";
				break;

			case "clear":
				translationTab[cid].consoleHistory = [];
				output = "";
				break;

			default:
				output = `Unknown command: ${command}`;

			*/

		translationTab[cid].consoleHistory.push(output);
		//console.log("HI")
		sock.emit("console_output", { deviceId, output });
	});

	sock.on("login", ({ id, lastName }) => {
		const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8'));
		const student = students.find(
			(student) => student.id === id && student.lastName.toLowerCase() === lastName.toLowerCase()
		);

		if (student) {
			translationTab[cid].sid = id;
			sock.emit("login_success", { id: student.id, name: `${student.firstName} ${student.lastName}` });
		} else {
			sock.emit("login_failure", "Invalid ID or Last Name.");
		}
	});

	sock.on("run_tests", () => {
		sock.emit("test_results", results);
	});

	sock.on("submit_task", ({ taskId, studentId }) => {
		const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8'));
		const student = students.find((student) => student.id === studentId);
		if (student) {
			if (!student.progress) {
				student.progress = [0, 0, 0, 0, 0, 0];
			}
			student.progress[taskId - 1] = 1;
			fs.writeFileSync(path.join(__dirname, 'students.json'), JSON.stringify(students, null, 2));
			io.emit("task_completed", { studentId, taskId });
			sock.emit("task_submitted", { taskId, success: true });
		} else {
			sock.emit("task_submitted", { taskId, success: false });
		}
	});

	sock.on("check_task_completion", () => {
		const task = translationTab[cid].task;
		const isCompleted = task.check();
		sock.emit("task_completion_status", { taskId: task.id, isCompleted });
	});

	sock.on("submit_task", ({ taskId }) => {
		if (!translationTab[cid].completedTasks) {
			translationTab[cid].completedTasks = [];
		}
		if (!translationTab[cid].completedTasks.includes(taskId)) {
			translationTab[cid].completedTasks.push(taskId);
		}
		sock.emit("task_submitted", { taskId });
	});

	sock.on("check_task_completion", () => {
		const task = translationTab[cid].task;
		const isCompleted = task.check();
		sock.emit("task_completion_status", { taskId: task.id, isCompleted });
	});

	sock.on("get_student_progress", ({ studentId }) => {
		const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8'));
		const student = students.find((student) => student.id === studentId);
		if (student) {
			sock.emit("student_progress", { progress: student.progress });
		} else {
			sock.emit("student_progress", { progress: [] });
		}
	});

	// Handle task reset
	sock.on("reset_task", (data) => {
		const { studentId, taskId } = data;
		try {
			const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8'));
			const studentIndex = students.findIndex(s => s.id === studentId);
			
			if (studentIndex !== -1) {
				// Reset the task completion status to 0
				students[studentIndex].progress[taskId - 1] = 0;
				fs.writeFileSync(path.join(__dirname, 'students.json'), JSON.stringify(students, null, 2));
				
				// Broadcast task reset to all clients
				io.emit("task_completed", { studentId, taskId });
				
				sock.emit("task_reset_confirmed", { success: true });
			} else {
				sock.emit("task_reset_confirmed", { success: false, error: "Student not found" });
			}
		} catch (error) {
			console.error("Error resetting task:", error);
			sock.emit("task_reset_confirmed", { success: false, error: "Internal server error" });
		}
	});

	sock.on("disconnect", () => {
		Object.keys(studentSocketMap).forEach(sid => {
			studentSocketMap[sid] = studentSocketMap[sid].filter(id => id !== sock.id);
			if (studentSocketMap[sid].length === 0) delete studentSocketMap[sid];
		});
	});
});

// Get all students
app.get('/students', (req, res) => {
	try {
		const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8'));
		res.json(students);
	} catch (error) {
		console.error('Error reading students:', error);
		res.status(500).json({ error: 'Error reading students data' });
	}
});

// Add new student
app.post('/students', (req, res) => {
	try {
		const newStudent = req.body;
		const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8'));
		
		// Check if student already exists
		if (students.some(s => s.id === newStudent.id)) {
			return res.status(400).json({ error: 'Student with this ID already exists' });
		}
		
		students.push(newStudent);
		fs.writeFileSync(path.join(__dirname, 'students.json'), JSON.stringify(students, null, 2));
		res.status(201).json(newStudent);
	} catch (error) {
		console.error('Error adding student:', error);
		res.status(500).json({ error: 'Error adding student' });
	}
});

// Update student progress
app.put('/students/:id/progress', (req, res) => {
	try {
		const studentId = req.params.id;
		const { taskIndex, value } = req.body;
		const students = JSON.parse(fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8'));
		const student = students.find(s => s.id === studentId);
		if (student) {
			if (taskIndex === "all") {
				for (let i = 0; i < student.progress.length; i++) {
					student.progress[i] = value;
				}
			} else {
				student.progress[taskIndex] = value;
			}
			fs.writeFileSync(path.join(__dirname, 'students.json'), JSON.stringify(students, null, 2));
			res.json(student);
			io.emit("student_progress_updated", { studentId });
		} else {
			res.status(404).json({ error: 'Student not found' });
		}
	} catch (error) {
		console.error('Error updating progress:', error);
		res.status(500).json({ error: 'Error updating student progress' });
	}
});

server.listen(PORT, () => {
	console.log("Work");
});
const task = new Task();
task.set(1);

// Add rules
task.network.configure(1, 0, "input", "add", 0, { action: "permit", src: "192.168.1.2", des: "192.168.3.2", protocol: "udp:80" });
task.network.configure(1, 0, "input", "add", 0, { action: "deny", src: "any", des: "any", protocol: "any" });

let lastStudentsData = fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8');

fs.watchFile(path.join(__dirname, 'students.json'), { interval: 2000 }, (curr, prev) => {
    const newData = fs.readFileSync(path.join(__dirname, 'students.json'), 'utf8');
    if (newData !== lastStudentsData) {
        try {
            const oldArr = JSON.parse(lastStudentsData);
            const newArr = JSON.parse(newData);
            newArr.forEach((student, idx) => {
                if (JSON.stringify(student.progress) !== JSON.stringify(oldArr[idx]?.progress)) {
                    // Emit to ALL clients (including admin panel)
                    io.emit('student_progress_updated', { studentId: student.id });
                }
            });
        } catch (e) {
            console.error('Error parsing students.json:', e);
        }
        lastStudentsData = newData;
    }
});
