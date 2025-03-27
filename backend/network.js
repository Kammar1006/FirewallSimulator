/* Created by Kammar1006 */

const reFinder = (topology, c_path, last_id) => {

    console.log(topology, c_path, last_id)

    let c_id = c_path[c_path.length-1];

    console.log(topology[c_id], c_path)

    let posibilities = topology[c_id].filter((e) => c_path.indexOf(e) == -1);

    for(const p of posibilities){
        let n_path = [...c_path];
        n_path.push(p);
        console.log(n_path);
        if(p == last_id) return n_path;

        let path = reFinder(topology, n_path, last_id);

        if(path)
            return path; 
        
    }

    return false;
}

function Network(){
    this.devices = [];
    this.connections = [];
    this.path = [];

    this.set = (devices, connections) => {
        this.devices = devices;
        this.connections = connections;
    }

    this.simulate = (first_id, last_id, packet) => {
        if(first_id == last_id) return false;

        this.path = reFinder(this.connections, [first_id], last_id);

        let path = [...this.path]

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
        return {
            path: path,
            result: result
        };
    }

    this.configure = (device_id, inet, type, action, id, data) => {
        if(0 <= device_id && device_id < this.devices.length){
            return this.devices[device_id].configure(inet, type, action, id, data);
        }
        return false;
    }
}

module.exports = {Network}