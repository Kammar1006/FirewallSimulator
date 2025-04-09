/* Created by Kammar1006 */

const ipaddr = require("ipaddr.js");

const compareSRC = (packetSRC, ruleSRC) => {
    return compareIP(packetSRC, ruleSRC);
}

const compareDES = (packetDES, ruleDES) => {
    return compareIP(packetDES, ruleDES);
}

const compareProtocol = (packetProtocol, ruleProtocol) => {
    if (ruleProtocol === "any") return true;

    let [ruleProto, rulePort] = ruleProtocol.split(":");
    let [packetProto, packetPort] = packetProtocol.split(":");

    if (ruleProto !== packetProto && ruleProto !== "ip") return false;
    if (rulePort && packetPort && rulePort !== packetPort) return false;

    return true;
}

function compareIP(packetIP, ruleIP) {
    if (ruleIP === "any") return true;
    
    const packetParts = packetIP.split(".").map(Number);
    const ruleParts = ruleIP.split(" ");
    
    if (ruleParts.length === 1) {
        return packetIP === ruleIP;
    }
    
    if (ruleParts.length === 2) {
        const ruleIPParts = ruleParts[0].split(".").map(Number);
        const wildcardParts = ruleParts[1].split(".").map(Number);
        
        for (let i = 0; i < 4; i++) {
           // console.log(packetParts[i], ruleIPParts[i], wildcardParts[i])
	       // console.log((packetParts[i] - (packetParts[i] & wildcardParts[i])), (ruleIPParts[i] - (ruleIPParts[i] & wildcardParts[i])))
            if ((packetParts[i] - (packetParts[i] & wildcardParts[i])) !== (ruleIPParts[i] - (ruleIPParts[i] & wildcardParts[i]))) {
                return false;
            }
        }
        return true;
    }
    
    return false;
}

// function isSameSubnet(ip1, ip2, subnetMask) {
//     const ip1Parts = ip1.split(".").map(Number);
//     const ip2Parts = ip2.split(".").map(Number);
//     const maskParts = subnetMask.split(".").map(Number);

//     for (let i = 0; i < 4; i++) {
//         if ((ip1Parts[i] & maskParts[i]) !== (ip2Parts[i] & maskParts[i])) {
//             return false;
//         }
//     }
//     return true;
// }

module.exports = { compareSRC, compareDES, compareProtocol };