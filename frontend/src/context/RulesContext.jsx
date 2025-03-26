import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const RulesContext = createContext();

const RulesContextProvider = (props) => {
  const [rules, setRules] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const socket = io("http://localhost:5003");

  useEffect(() => {
    setLoading(true);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");

      // Fetch initial rules
      socket.emit("get_rules", 0, 0, "input");
      socket.on("rules", (data) => {
        setRules(data);
        setLoading(false);
      });

      // Fetch challenges (mocked for now)
      setChallenges([
        {
          id: 1,
          description:
            "Allow TCP from 192.168.1.1 to any on port 53 on Device-A",
          expected: {
            action: "Allow",
            protocol: "TCP",
            source: "192.168.1.1",
            destination: "any",
            port: "53",
            device: "PC-A",
          },
          isCorrect: null,
        },
        {
          id: 2,
          description:
            "Deny UDP from 192.168.1.3 to 192.168.1.3 on port 443 on Device-B",
          expected: {
            action: "Deny",
            protocol: "UDP",
            source: "192.168.1.3",
            destination: "192.168.1.3",
            port: "443",
            device: "PC-B",
          },
          isCorrect: null,
        },
      ]);
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
      setError("Failed to connect to WebSocket server.");
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const addRule = (rule) => {
    socket.emit("add_rule", 0, 0, "input", rule);
    socket.on("rules", (data) => {
      setRules(data);
    });
  };

  const removeRule = (id) => {
    socket.emit("remove_rule", id);
    socket.on("rules", (data) => {
      setRules(data);
    });
  };

  const editRule = (updatedRule) => {
    socket.emit("edit_rule", updatedRule.id, updatedRule);
    socket.on("rules", (data) => {
      setRules(data);
    });
  };

  const validateChallenge = (challengeId) => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    const matchingRule = rules.find(
      (r) =>
        r.action === challenge.expected.action &&
        r.protocol === challenge.expected.protocol &&
        (r.source === challenge.expected.source ||
          challenge.expected.source === "any") &&
        (r.destination === challenge.expected.destination ||
          challenge.expected.destination === "any") &&
        r.port === challenge.expected.port
    );

    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId ? { ...c, isCorrect: Boolean(matchingRule) } : c
      )
    );
  };

  const value = {
    rules,
    addRule,
    removeRule,
    editRule,
    challenges,
    validateChallenge,
    loading,
    error,
  };

  return (
    <RulesContext.Provider value={value}>
      {props.children}
    </RulesContext.Provider>
  );
};

export default RulesContextProvider;
