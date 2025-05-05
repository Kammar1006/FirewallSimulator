/* Created by Kammar1006 */

const ipaddr = require("ipaddr.js");

const compareSRC = (packetSRC, ruleSRC) => {
    const srcIP = packetSRC.inet || packetSRC;
    return compareIP(srcIP, ruleSRC);
}

const compareDES = (packetDES, ruleDES) => {
    const desIP = packetDES.inet || packetDES;
    return compareIP(desIP, ruleDES);
}

const compareProtocol = (packetProtocol, ruleProtocol) => {
    // Handle any/any:any cases
    if (ruleProtocol === "any" || ruleProtocol === "any:any") return true;
    if (packetProtocol === "any" || packetProtocol === "any:any") return true;

    // Split protocols into protocol and port
    let [packetProto, packetPort = "any"] = packetProtocol.split(":");
    let [ruleProto, rulePort = "any"] = ruleProtocol.split(":");

    // Check protocol match
    if (ruleProto !== packetProto && ruleProto !== "ip") {
        console.log(`Protocol mismatch: packet=${packetProto}, rule=${ruleProto}`);
        return false;
    }

    // Check port match if both have ports
    if (rulePort !== "any" && packetPort !== "any" && rulePort !== packetPort) {
        console.log(`Port mismatch: packet=${packetPort}, rule=${rulePort}`);
        return false;
    }

    return true;
}

function compareIP(packetIP, ruleIP) {
    // Handle any case
    if (ruleIP === "any") return true;
    
    const packetParts = packetIP.split(".").map(Number);
    const ruleParts = ruleIP.split(" ");
    
    // Exact IP match
    if (ruleParts.length === 1) {
        return packetIP === ruleIP;
    }
    
    // IP with wildcard mask
    if (ruleParts.length === 2) {
        const ruleIPParts = ruleParts[0].split(".").map(Number);
        const wildcardParts = ruleParts[1].split(".").map(Number);
        
        for (let i = 0; i < 4; i++) {
            const packetBits = packetParts[i] & (~wildcardParts[i]);
            const ruleBits = ruleIPParts[i] & (~wildcardParts[i]);
            if (packetBits !== ruleBits) {
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