/* Created by Kammar1006 */

const {compareSRC, compareDES, compareProtocol} = require("./compare");

function Firewall(){
    this.list = [];
    
    this.add = (data) => {
        if(this.validate(data)) {
            // Ensure protocol has proper format
            if (data.protocol && !data.protocol.includes(":")) {
                data.protocol = data.protocol + ":any";
            }
            this.list.push(data);
        }
    }

    this.edit = (id, data) => {
        if(this.validate(data) && id >= 0 && id < this.list.length) {
            // Ensure protocol has proper format
            if (data.protocol && !data.protocol.includes(":")) {
                data.protocol = data.protocol + ":any";
            }
            this.list[id] = data;
        }
    }

    this.remove = (id) => {
        if(id >= 0 && id < this.list.length) {
            this.list.splice(id, 1);
        }
    }

    this.configure = (action, id, data) => {
        switch(action){
            case "add":
                this.add(data);
                break;
            case "edit":
                this.edit(id, data);
                break;
            case "remove":
                this.remove(id);
                break;
            case "export_iptables":
                return this.exportToIptables();
            case "export_cisco":
                return this.exportToCiscoACL();
        }
        return this.list;
    }

    this.simulate = (packet) => {
        // If no rules, default permit
        if (this.list.length === 0) {
            console.log("No rules configured. Default permit.");
            return [true, ["default_permit"]];
        }

        let score = [];
        
        // Ensure packet protocol has proper format
        if (packet.protocol && !packet.protocol.includes(":")) {
            packet.protocol = packet.protocol + ":any";
        }

        console.log("Simulating packet:", packet);
        console.log("Against rules:", this.list);

        // Check each rule in order
        for (const rule of this.list) {
            const srcMatch = compareSRC(packet.src, rule.src);
            const desMatch = compareDES(packet.des, rule.des);
            const protocolMatch = compareProtocol(packet.protocol, rule.protocol);

            console.log(`Rule check:`, rule);
            console.log(`Matches - src: ${srcMatch}, des: ${desMatch}, protocol: ${protocolMatch}`);

            if (srcMatch && desMatch && protocolMatch) {
                // Rule matches - apply action and stop processing
                const action = rule.action === "permit";
                score.push(rule.action);
                console.log(`Rule matched. Action: ${rule.action}`);
                return [action, score];
            }
            score.push("no_match");
        }

        // If no rules matched, implicit deny
        console.log("No matching rules. Implicit deny.");
        return [false, [...score, "implicit_deny"]];
    }

    this.validate = (record) => {
        if (!record) return false;
        
        // Check required fields
        if (!record.action || !record.src || !record.des || !record.protocol) {
            return false;
        }

        // Validate action
        const validActions = ["permit", "deny", "accept", "drop"];
        if (!validActions.includes(record.action)) {
            return false;
        }

        // Validate protocol format
        if (record.protocol !== "any" && record.protocol !== "any:any") {
            const [proto, port] = record.protocol.split(":");
            const validProtos = ["tcp", "udp", "icmp", "ip"];
            if (!validProtos.includes(proto)) {
                return false;
            }
            if (port && port !== "any" && isNaN(parseInt(port))) {
                return false;
            }
        }

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
        return this.list.map(rule => {
            let action = rule.action === "permit" ? "ACCEPT" : "DROP";
            let src = rule.src === "any" ? "0.0.0.0/0" : rule.src;
            let des = rule.des === "any" ? "0.0.0.0/0" : rule.des;
            
            let [proto, port] = (rule.protocol || "any").split(":");
            
            let cmd = `iptables -A INPUT -p ${proto === "any" ? "all" : proto}`;
            if (src !== "0.0.0.0/0") cmd += ` -s ${src}`;
            if (des !== "0.0.0.0/0") cmd += ` -d ${des}`;
            if (port && port !== "any") cmd += ` --dport ${port}`;
            cmd += ` -j ${action}`;
            
            return cmd;
        }).join("\n");
    }

    this.exportToCiscoACL = () => {
        return this.list.map(rule => {
            let action = rule.action === "permit" ? "permit" : "deny";
            let [proto, port] = (rule.protocol || "any").split(":");
            
            let src = rule.src === "any" ? "any" : 
                     (rule.src.includes(" ") ? rule.src : `host ${rule.src}`);
            let des = rule.des === "any" ? "any" : 
                     (rule.des.includes(" ") ? rule.des : `host ${rule.des}`);
            
            let cmd = `access-list 100 ${action} ${proto === "any" ? "ip" : proto} ${src} ${des}`;
            if (port && port !== "any") cmd += ` eq ${port}`;
            
            return cmd;
        }).join("\n");
    }
}

module.exports = {Firewall}