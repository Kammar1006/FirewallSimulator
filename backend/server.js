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
const { firewall } = require('./firewall');

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
			firewall: new firewall(),
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

	sock.on("get_questions", () => {
		if(translationTab[cid].in_progress = 0)
			sock.emit("question", load_question(translationTab[cid].progress+1));
	});

	sock.on("edit", () => {})

	sock.on("counter", () => {
		translationTab[cid].test_counter++;
		sock.emit("message", "Count: "+translationTab[cid].test_counter);
	});

});

server.listen(PORT, () => {
	console.log("Work");
});