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

    if (ruleProto !== packetProto) return false;
    if (rulePort && packetPort && rulePort !== packetPort) return false;

    return true;
}

function compareIP(packetIP, ruleIP) {
    if (ruleIP === "any") return true;

    if (ruleIP.includes("/")) {
        return ipaddr.parse(packetIP).match(ipaddr.parseCIDR(ruleIP));
    }

    return packetIP === ruleIP;
}

module.exports = {compareSRC, compareDES, compareProtocol}