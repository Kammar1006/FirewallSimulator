/* Created by Kammar1006 */

const {compareSRC, compareDES, compareProtocol} = require("./compare");

function firewall(){
    this.list = []
    
    this.add = (data) => {
        if(this.validate(data))
            this.list.push(data);
    }

    this.edit = (id, data) => {
        if(this.validate(data) && id >= 0 && id < this.list.length)
            this.list[id] = data;
    }

    this.remove = (id) => {
        if(id >= 0 && id < this.list.length)
            this.list.splice(id);
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
            else{
                score.push("go_next");
            }
        });

        return [status, score]
    }

    this.validate = (record) => {
        /* Function for validate record */
        return true
    }

    this.test = (packet) => {

    }
}

module.exports = {firewall}