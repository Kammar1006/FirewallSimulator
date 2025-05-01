/* Created by Kammar1006 */

const { Firewall } = require("./firewall");

function Interface(inet) {
    this.input_rules = new Firewall();
    this.output_rules = new Firewall();
    this.inet = inet || "127.0.0.1";
}

module.exports = { Interface }; 