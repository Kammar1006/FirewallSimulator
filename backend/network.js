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

        let path = [[...this.path], [...this.path.reverse()]]

        console.log(path)

        let result = [[], []];

        console.log(path[0])
        console.log("out")
        result[0].push(this.devices[path[0][0]].packet_out(packet, this.connections[path[0][0]].indexOf(path[0][1])))
        let previos_id = path[0].shift()
        while(path[0].length > 1){
            console.log(path[0][0])
            console.log("in")
            result[0].push(this.devices[path[0][0]].packet_in(packet, this.connections[path[0][0]].indexOf(previos_id)))
            console.log("out")
            result[0].push(this.devices[path[0][0]].packet_out(packet, this.connections[path[0][0]].indexOf(path[0][1])))
            previos_id = path[0].shift()
        }
        console.log(path[0][0])
        console.log("in")
        result[0].push(this.devices[path[0][0]].packet_in(packet, this.connections[path[0][0]].indexOf(previos_id)))

        console.log(path[1])
        console.log("out")
        result[1].push(this.devices[path[1][0]].packet_out(packet, this.connections[path[1][0]].indexOf(path[1][1])))
        previos_id = path[1].shift()
        while(path[1].length > 1){
            console.log(path[1][0])
            console.log("in")
            result[1].push(this.devices[path[1][0]].packet_in(packet, this.connections[path[1][0]].indexOf(previos_id)))
            console.log("out")
            result[1].push(this.devices[path[1][0]].packet_out(packet, this.connections[path[1][0]].indexOf(path[1][1])))
            previos_id = path[1].shift()
        }
        console.log(path[1][0])
        console.log("in")
        result[1].push(this.devices[path[1][0]].packet_in(packet, this.connections[path[1][0]].indexOf(previos_id)))

        return {
            path: this.path,
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