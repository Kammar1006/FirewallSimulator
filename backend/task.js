/* Created by Kammar1006 */

const { Device } = require("./device");
const { Network } = require("./network");

function Task(){
    this.network = new Network();

    this.set = (nr) => {

        this.id = nr;

        switch(nr){
            case 1:{
                this.network.set(
                    [
                        new Device("PC_1", ["192.168.1.2"]),
                        new Device("R_1", ["192.168.1.1", "10.1.1.1"]),
                        new Device("R_2", ["10.1.1.2", "192.168.2.1", "192.168.3.1"]),
                        new Device("PC_2", ["192.168.2.2"]),
                        new Device("PC_3", ["192.168.3.2"])
                    ], 
                    [[1], [0, 2], [1, 3, 4], [2], [2]]
                );
                this.desc = [

                ];
                this.tests = [
                    {
                        packet: { src: "192.168.1.1", des: "10.0.0.5", protocol: "tcp:80" },
                        result: [true, 6]
                    },
                    {
                        packet: { src: "192.168.1.1", des: "192.168.2.2", protocol: "tcp:80" },
                        result: [false, 3]
                    }
                ];
            }break;
            case 2:{
                
            }break;
            case 3:{
                
            }break;
            case 4:{
                
            }break;
            case 5:{
                
            }break;
            case 6:{
                
            }break;
        }
    }

    this.check = () => {
        let flag = true;

        for(const test of this.tests){
            
            
            let result = this.network.simulate(
                this.network.recognize(test.packet.src),
                this.network.recognize(test.packet.des),
                this.packet
            )

            if(test.result[0])
                if(result.resul.filter(e => {e[0] == true}).length != test.result[1])
                    flag = false;
            else{
                if(result.result.filter((e, i) => {e[0] == true && i < test.result[1]}) != test.result[1]-1)
                    flag = false;
            }
        }
        return flag;
    }
}

module.exports = {Task}