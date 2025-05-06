/* Created by Kammar1006 */

const reFinder = (topology, c_path, last_id) => {
    let c_id = c_path[c_path.length-1];
    let possibilities = topology[c_id].filter((e) => c_path.indexOf(e) == -1);

    for(const p of possibilities){
        let n_path = [...c_path];
        n_path.push(p);
        if(p == last_id) return n_path;

        let path = reFinder(topology, n_path, last_id);
        if(path) return path;
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

        // Find path from source to destination
        this.path = reFinder(this.connections, [first_id], last_id);
        if (!this.path) return false;

        let forward_path = [...this.path];
        let return_path = [...this.path].reverse();
        
        console.log("Simulating packet:", packet);
        console.log("Forward path:", forward_path);
        console.log("Return path:", return_path);

        let result = [[], []];
        let forward_success = true;
        let blockingDevice = null; // Track the blocking device

        // Simulate forward path
        for (let i = 0; i < forward_path.length - 1; i++) {
            let current = forward_path[i];
            let next = forward_path[i + 1];
            
            // If not first device, check input rules
            if (i > 0) {
                let prev = forward_path[i - 1];
                let inInterface = this.connections[current].indexOf(prev);
                if (inInterface === -1 || !this.devices[current].interfaces[inInterface]) {
                    forward_success = false;
                    blockingDevice = current;
                    break;
                }
                let inResult = this.devices[current].packet_in(packet, inInterface);
                result[0].push({res: inResult, id: current});
                if (!inResult[0]) {
                    forward_success = false;
                    blockingDevice = current;
                    break;
                }
            }

            // Check output rules
            let outInterface = this.connections[current].indexOf(next);
            if (outInterface === -1 || !this.devices[current].interfaces[outInterface]) {
                forward_success = false;
                blockingDevice = current;
                break;
            }
            let outResult = this.devices[current].packet_out(packet, outInterface);
            result[0].push({res: outResult, id: current});
            if (!outResult[0]) {
                forward_success = false;
                blockingDevice = current;
                break;
            }
        }

        // Check input rules on final device
        if (forward_success) {
            let final = forward_path[forward_path.length - 1];
            let prev = forward_path[forward_path.length - 2];
            let inInterface = this.connections[final].indexOf(prev);
            if (inInterface === -1 || !this.devices[final].interfaces[inInterface]) {
                forward_success = false;
                blockingDevice = final;
            } else {
                let inResult = this.devices[final].packet_in(packet, inInterface);
                result[0].push({res: inResult, id: final});
                if (!inResult[0]) {
                    forward_success = false;
                    blockingDevice = final;
                }
            }
        }

        // Only simulate return path if forward path succeeded
        if (forward_success) {
            // Simulate return path
            for (let i = 0; i < return_path.length - 1; i++) {
                let current = return_path[i];
                let next = return_path[i + 1];
                
                // If not first device, check input rules
                if (i > 0) {
                    let prev = return_path[i - 1];
                    let inInterface = this.connections[current].indexOf(prev);
                    if (inInterface === -1 || !this.devices[current].interfaces[inInterface]) {
                        forward_success = false;
                        blockingDevice = current;
                        break;
                    }
                    let inResult = this.devices[current].packet_in(packet, inInterface);
                    result[1].push({res: inResult, id: current});
                    if (!inResult[0]) {
                        forward_success = false;
                        blockingDevice = current;
                        break;
                    }
                }

                // Check output rules
                let outInterface = this.connections[current].indexOf(next);
                if (outInterface === -1 || !this.devices[current].interfaces[outInterface]) {
                    forward_success = false;
                    blockingDevice = current;
                    break;
                }
                let outResult = this.devices[current].packet_out(packet, outInterface);
                result[1].push({res: outResult, id: current});
                if (!outResult[0]) {
                    forward_success = false;
                    blockingDevice = current;
                    break;
                }
            }
        }

        // Check input rules on final device
        if (forward_success) {
            let final = return_path[return_path.length - 1];
            let prev = return_path[return_path.length - 2];
            let inInterface = this.connections[final].indexOf(prev);
            if (inInterface === -1 || !this.devices[final].interfaces[inInterface]) {
                forward_success = false;
                blockingDevice = final;
            } else {
                let inResult = this.devices[final].packet_in(packet, inInterface);
                result[1].push({res: inResult, id: final});
                if (!inResult[0]) {
                    forward_success = false;
                    blockingDevice = final;
                }
            }
        }

        return { result, success: forward_success, blockingDevice };
    }

    this.configure = (device_id, inet, type, action, id, data) => {
        if(0 <= device_id && device_id < this.devices.length){
            return this.devices[device_id].configure(inet, type, action, id, data);
        }
        return false;
    }

    this.findId = (ip) => {
        for(dev in this.devices){
            for(int in this.devices[dev].interfaces){
                console.log(this.devices[dev].interfaces[int].inet)
                if(this.devices[dev].interfaces[int].inet == ip && ip !== "127.0.0.1"){
                    console.log(ip, dev);
                    return dev;
                }
            }
        }
        return false;
    }
}

module.exports = {Network}