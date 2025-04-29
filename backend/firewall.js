/* Created by Kammar1006 */

const {compareSRC, compareDES, compareProtocol} = require("./compare");

function Firewall(){
    this.list = []
    
    this.add = (data) => {
        if (this.validate(data)) {
            // Sprawdź, czy reguła już istnieje
            const exists = this.list.some(
                (rule) =>
                    rule.type === data.type &&
                    rule.action === data.action &&
                    rule.src === data.src &&
                    rule.des === data.des &&
                    rule.protocol === data.protocol
            );
            if (!exists) {
                this.list.push(data);
            } else {
                console.log("Rule already exists:", data); // Debugging log
            }
        }
    }

    this.edit = (id, data) => {
        if(this.validate(data) && id >= 0 && id < this.list.length)
            this.list[id] = data;
    }

    this.remove = (id) => {
        if(id >= 0 && id < this.list.length)
            this.list.splice(id);
    }

    this.configure = (action, id, data) => {
        switch(action){
            case "add":{
                this.add(data);
            }break;
            case "edit":{
                this.edit(id, data);
            }break;
            case "remove":{
                this.remove(id);
            }break;
            case "export_iptables":{
                this.exportToIptables();
            }break;
            case "export_cisco":{
                this.exportToCiscoACL();
            }break;
        }

        return this.list;
    }

    this.simulate = (packet) => {
        let status = true;
        let changeable = true;
        let score = [];
        this.list.forEach(record => {
            if(compareSRC(packet.src, record.src) && compareDES(packet.des, record.des) && compareProtocol(packet.protocol, record.protocol) && changeable){
                status = record.action;
                changeable = false;
                score.push("end");
            }
            else if(changeable){
                score.push("go_next");
            }
        });

        return [status, score]
    }

    this.validate = (record) => {
        /* Function for validate record */
        const validActions = ["permit", "deny", "accept", "drop"];
        if (!validActions.includes(record.action)) return false;
        if (!record.src || !record.des || !record.protocol) return false;
        return true;
    }

    this.test = (test) => {
        let status = true;
        test.forEach(e => {
            packet = e.packet;
            result = e.result;

            console.log(this.simulate(packet)[0], result)

            if(this.simulate(packet)[0] != result){
                status = false;
            }
        });

        return status;
    }

    this.exportToIptables = () => {
        return this.list.map(record => {
            let action = record.action === "permit" ? "ACCEPT" : "DROP";
            let src = record.src === "any" ? "0.0.0.0/0" : record.src;
            let des = record.des === "any" ? "0.0.0.0/0" : record.des;
            
            let protocol, port;
            if (record.protocol.includes(":")) {
                [protocol, port] = record.protocol.split(":");
            } else {
                protocol = record.protocol;
                port = "";
            }

            let rule = `iptables -A INPUT -p ${protocol}`;
            if (src) rule += ` -s ${src}`;
            if (des) rule += ` -d ${des}`;
            if (port) rule += ` --dport ${port}`;
            rule += ` -j ${action}`;

            return rule;
        }).join("\n");
    }

    this.exportToCiscoACL = () => {
        return this.list.map(record => {
            let action = record.action === "permit" ? "permit" : "deny";
            let protocol, port;
            if (record.protocol.includes(":")) {
                [protocol, port] = record.protocol.split(":");
            } else {
                protocol = record.protocol;
                port = "";
            }

            let src = record.src === "any" ? "any" : (record.src.split(" ").length === 1 ? `host ${record.src}` : record.src);
            let des = record.des === "any" ? "any" : (record.des.split(" ").length === 1 ? `host ${record.des}` : record.des);

            let rule = `access-list 100 ${action} ${protocol} ${src} ${des}`;
            if (port) rule += ` eq ${port}`;

            return rule;
        }).join("\n");
    }
}

module.exports = {Firewall}