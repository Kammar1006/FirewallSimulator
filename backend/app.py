from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for rules and challenges
rules = []
challenges = [
    {
        "id": 1,
        "description": "Allow TCP from 192.168.1.1 to any on port 53 on Device-A",
        "expected": {
            "action": "Allow",
            "protocol": "TCP",
            "source": "192.168.1.1",
            "destination": "any",
            "port": "53",
            "device": "Device-A",
        },
        "isCorrect": None,
    },
    {
        "id": 2,
        "description": "Deny UDP from 192.168.1.3 to 192.168.1.3 on port 443 on Device-B",
        "expected": {
            "action": "Deny",
            "protocol": "UDP",
            "source": "192.168.1.3",
            "destination": "192.168.1.3",
            "port": "443",
            "device": "Device-B",
        },
        "isCorrect": None,
    },
]

# Helper function to compare rules
def are_rules_equal(rule1, rule2):
    return (
        rule1["action"] == rule2["action"]
        and rule1["protocol"] == rule2["protocol"]
        and (rule1["source"] == rule2["source"] or rule2["source"] == "any")
        and (rule1["destination"] == rule2["destination"] or rule2["destination"] == "any")
        and rule1["port"] == rule2["port"]
        and rule1.get("device") == rule2.get("device")
    )

# Routes
@app.route("/rules", methods=["GET", "POST"])
def handle_rules():
    if request.method == "GET":
        return jsonify(rules)
    elif request.method == "POST":
        new_rule = request.json
        rules.append(new_rule)
        return jsonify(new_rule), 201

@app.route("/rules/<int:rule_id>", methods=["PUT", "DELETE"])
def modify_rule(rule_id):
    global rules
    rule = next((r for r in rules if r["id"] == rule_id), None)
    if not rule:
        return jsonify({"error": "Rule not found"}), 404

    if request.method == "PUT":
        updated_rule = request.json
        rules = [updated_rule if r["id"] == rule_id else r for r in rules]
        return jsonify(updated_rule)
    elif request.method == "DELETE":
        rules = [r for r in rules if r["id"] != rule_id]
        return jsonify({"message": "Rule deleted"})

@app.route("/challenges", methods=["GET", "POST"])
def handle_challenges():
    if request.method == "GET":
        device = request.args.get("device")
        if device:
            filtered_challenges = [c for c in challenges if c["expected"]["device"] == device]
            return jsonify(filtered_challenges)
        return jsonify(challenges)
    elif request.method == "POST":
        new_challenge = request.json
        if "expected" not in new_challenge or "device" not in new_challenge["expected"]:
            return jsonify({"error": "Device parameter is required in expected"}), 400
        new_challenge["id"] = len(challenges) + 1
        new_challenge["isCorrect"] = None
        challenges.append(new_challenge)
        return jsonify(new_challenge), 201

@app.route("/challenges/<int:challenge_id>/validate", methods=["POST"])
def validate_challenge(challenge_id):
    challenge = next((c for c in challenges if c["id"] == challenge_id), None)
    if not challenge:
        return jsonify({"error": "Challenge not found"}), 404

    matching_rule = next(
        (r for r in rules if are_rules_equal(r, challenge["expected"])), None
    )
    challenge["isCorrect"] = bool(matching_rule)
    return jsonify(challenge)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
