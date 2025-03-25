/*
    Created by Kammar1006
*/

const PORT = 5003;
const COOKIE_FLAG = "example_cookie"

const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
app.use(express.static(`${__dirname}/../frontend`));

const server = http.createServer(app);
const io = socketio(server, {
	cookie: true,
});

const { randomBytes } = require('crypto');
const { Task } = require('./task');

let translationTab = [];
const setCID = (sock) => {
	//console.log(sock.request.headers.cookie);
	let cid;
	if(sock.handshake.headers.cookie == undefined){
		return false;
	}
	let cookie = (sock.handshake.headers.cookie).split(" ");
	cookie.forEach(element => {
		if(element.split("=")[0]==COOKIE_FLAG) cid = element.split("=")[1];	
	});
	if(cid == undefined || cid == ""){
		return false;
	}
	else{
		if(cid[cid.length-1] == ";"){
			cid = cid.substring(0, cid.length-1);
		}
	}
	return cid;
}
const setTranslationTab = (cid) => {
	if(translationTab[cid]==undefined){
		translationTab[cid]={
			user_id: -1,
			sid: 0,
			test_counter: 0,
			task: new Task(),
			progress: 0,
			in_progress: 0,
		};
	}
}

const load_question = (id) => {
	return `Q${id}`
}

io.on('connection', (sock) => {
	let cid = setCID(sock);
	if(!cid){
		cid = randomBytes(30).toString('hex');
		sock.emit("set-cookie", `${COOKIE_FLAG}=${cid}; Path=/; SameSite=None; Secure`);
	}
	setTranslationTab(cid);

	console.log("User: "+cid);
	if(translationTab[cid].sid) sock.emit("set_sid", true, translationTab[cid].sid);


	sock.on("set_sid", (sid) => {
		console.log(sid)
		if(sid > 270000 && sid < 280000){
			translationTab[cid].sid = sid;
			sock.emit("set_sid", true, translationTab[cid].sid);
		}
		else sock.emit("set_sid", false);
	});

	sock.on("get_rules", (device_id, interface_id, type) => {
        sock.emit("rules", translationTab[cid].task.network.configure(device_id, interface_id, type));
    });

	sock.on("add_rule", (device_id, interface_id, type, rule) => {
        sock.emit("rules", translationTab[cid].task.network.configure(device_id, interface_id, type, "add", -1, rule));
    });

	sock.on("edit_rule", ( id, rule ) => {
        sock.emit("rules", translationTab[cid].task.network.configure(device_id, interface_id, type, "edit", id, rule));
    });

	sock.on("remove_rule", (id) => {
        sock.emit("rules", translationTab[cid].task.network.configure(device_id, interface_id, type, "remove", id, ""));
    });

	sock.on("export_iptables", () => {
        //sock.emit("iptables_data", translationTab[cid].firewall.exportToIptables());
    });

	sock.on("export_cisco", () => {
        //sock.emit("cisco_data", translationTab[cid].firewall.exportToCiscoACL());
    });

	sock.on("get_questions", () => {
		if(translationTab[cid].in_progress = 0)
			sock.emit("question", load_question(translationTab[cid].progress+1));
	});

	sock.on("counter", () => {
		translationTab[cid].test_counter++;
		sock.emit("message", "Count: "+translationTab[cid].test_counter);
	});

});

server.listen(PORT, () => {
	console.log("Work");
});


/*
n = new Network();
n.set(
	[
		new Device("PC_1", ["192.168.1.2"]),
		new Device("R_1", ["192.168.1.1", "10.1.1.1"]),
		new Device("R_2", ["10.1.1.2", "192.168.2.1", "192.168.3.1"]),
		new Device("PC_2", ["192.168.2.2"]),
		new Device("PC_3", ["192.168.3.2"])
	], 
	[[1], [0, 2], [1, 3, 4], [2], [2]]
)
console.log(n.simulate(0, 4, []));
n.simulate(3, 4, []);
n.simulate(2, 4, []);
n.simulate(4, 1, []);
*/