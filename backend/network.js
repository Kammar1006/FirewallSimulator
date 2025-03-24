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


        console.log(this.path[0])
        console.log("out")
        this.path.shift()
        while(this.path.length > 1){
            console.log(this.path[0])
            console.log("in")
            console.log("out")
            this.path.shift()
        }
        console.log(this.path[0])
        console.log("in")
    }
}

module.exports = {Network}