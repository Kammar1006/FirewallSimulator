/* Created by Kammar1006 */

function Network(){
    this.devices = [];
    this.connections = [];
    this.path = [];

    this.set = (devices, connections) => {
        this.devices = devices;
        this.connections = connections;
    }

    this.simulate = (first_id, end_id, packet) => {
        if(first_id == end_id) return false;

        this.path = [first_id];
        let current_id = first_id;
        let last_id = current_id;
        let i = 10;
        let connections = [...this.connections]
        while(i > 0){
            let posibilities = [...connections[current_id]];
            console.log(connections, posibilities, current_id, posibilities.indexOf(current_id));
            let remove_id = posibilities.indexOf(last_id);

            last_id = current_id;

            if(remove_id != -1)
                posibilities.splice(remove_id, 1);
            if(posibilities.length == 1){
                current_id = posibilities[0];
                this.path.push(current_id);
                if(current_id == end_id) break;
            }
            else{
                if(posibilities.indexOf(end_id) != -1){
                    this.path.push(end_id);
                    break;
                }
            }
            i--;
        }

        console.log(this.path)

        let result = [];

        console.log(this.path[0])
        console.log("out")
        result.push(this.devices[this.path[0]].packet_out(packet, this.connections[this.path[0]].indexOf(this.path[1])))
        let previos_id = this.path.shift()
        while(this.path.length > 1){
            console.log(this.path[0])
            console.log("in")
            result.push(this.devices[this.path[0]].packet_in(packet, this.connections[this.path[0]].indexOf(previos_id)))
            console.log("out")
            result.push(this.devices[this.path[0]].packet_out(packet, this.connections[this.path[0]].indexOf(this.path[1])))
            previos_id = this.path.shift()
        }
        console.log(this.path[0])
        console.log("in")
        result.push(this.devices[this.path[0]].packet_in(packet, this.connections[this.path[0]].indexOf(previos_id)))
        return result;
    }

    this.configure = (device_id, inet, type, action, id, data) => {
        if(0 <= device_id && device_id < this.devices.length){
            return this.devices[device_id].configure(inet, type, action, id, data);
        }
        return false;
    }
}

module.exports = {Network}