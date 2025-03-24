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
const { Firewall } = require('./firewall');
const { Network } = require('./network');
const { Device } = require('./device');

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
			firewall: new Firewall(),
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

	sock.on("get_rules", () => {
        sock.emit("rules", translationTab[cid].firewall.list);
    });

	sock.on("add_rule", (rule) => {
        translationTab[cid].firewall.add(rule);
        sock.emit("rules", translationTab[cid].firewall.list);
    });

	sock.on("edit_rule", ({ id, rule }) => {
        translationTab[cid].firewall.edit(id, rule);
        sock.emit("rules", translationTab[cid].firewall.list);
    });

	sock.on("remove_rule", (id) => {
        translationTab[cid].firewall.remove(id);
        sock.emit("rules", translationTab[cid].firewall.list);
    });

	sock.on("export_iptables", () => {
        sock.emit("iptables_data", translationTab[cid].firewall.exportToIptables());
    });

	sock.on("export_cisco", () => {
        sock.emit("cisco_data", translationTab[cid].firewall.exportToCiscoACL());
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



n = new Network();
n.set([], [[1], [0, 2], [1, 3, 4], [2], [2]])
n.simulate(0, 4, []);
n.simulate(3, 4, []);
n.simulate(2, 4, []);
n.simulate(4, 1, []);





/*

f = new firewall()

f.add({ action: "permit", src: "192.168.1.1", des: "10.0.0.0/24", protocol: "tcp:80", additional: {} });
f.add({ action: "deny", src: "192.168.1.2", des: "any", protocol: "udp:53", additional: {} });
f.add({ action: "deny", src: "any", des: "any", protocol: "any", additional: {} });

console.log("firewall rules")
console.log(f.list)

console.log("-------------------")

// Pakiety do testów
const packet1 = { src: "192.168.1.1", des: "10.0.0.5", protocol: "tcp:80" };
const packet2 = { src: "192.168.1.2", des: "8.8.8.8", protocol: "udp:53" };
console.log("packet1")
console.log(packet1)
console.log("packet2")
console.log(packet2)

console.log("--------------------------")
console.log("Simulate: ")

console.log("Test pakiet 1:", f.simulate(packet1)); // Powinno zwrócić "permit"
console.log("Test pakiet 2:", f.simulate(packet2)); // Powinno zwrócić "deny"

console.log("--------------------------")
console.log("To Iptables: ")
console.log(f.exportToIptables())


console.log("--------------------------")
console.log("To ACL: ")
console.log(f.exportToCiscoACL())

console.log("--------------------------")
console.log("Test: ")

console.log(f.test([
	{packet: packet1, result: "permit"}, 
	{packet: packet2, result: "deny"}
]));

console.log("--------------------------")

*/