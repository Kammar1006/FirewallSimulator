from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for rules and challenges
rules = []
challenges = [
    {
        "id": 1,
        "description": "Allow TCP from 192.168.1.1 to any on port 53",
        "expected": {
            "action": "Allow",
            "protocol": "TCP",
            "source": "192.168.1.1",
            "destination": "192.168.1.1",  # Fixed to match the description
            "port": "53",
        },
        "isCorrect": None,
    },
    {
        "id": 2,
        "description": "Deny UDP from 192.168.1.3 to 192.168.1.3 on port 443",
        "expected": {
            "action": "Deny",
            "protocol": "UDP",
            "source": "192.168.1.3",
            "destination": "192.168.1.3",
            "port": "443",
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

@app.route("/challenges", methods=["GET"])
def get_challenges():
    return jsonify(challenges)

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
