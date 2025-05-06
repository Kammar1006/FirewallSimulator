import React, { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

export const RulesContext = createContext();

export const SERVER_CONFIG = {
  address: "http://localhost:5003"
};

const RulesContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [rules, setRules] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newSocket = io( { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    newSocket.on("rules", (data) => {
      setRules(data);
    });

    newSocket.on("error", (err) => {
      setError(err);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const getRules = (deviceId, interfaceId, type) => {
    if (socket) {
      setLoading(true);
      socket.emit("get_rules", deviceId, interfaceId, type);
      setLoading(false);
    }
  };

  const addRule = (deviceId, interfaceId, type, rule) => {
    if (socket) {
      setLoading(true);
      socket.emit("add_rule", deviceId, interfaceId, type, rule);
      setLoading(false);
    }
  };

  const editRule = (deviceId, interfaceId, type, ruleId, rule) => {
    if (socket) {
      setLoading(true);
      socket.emit("edit_rule", deviceId, interfaceId, type, ruleId, rule);
      setLoading(false);
    }
  };

  const removeRule = (deviceId, interfaceId, type, ruleId) => {
    if (socket) {
      setLoading(true);
      socket.emit("remove_rule", deviceId, interfaceId, type, ruleId);
      setLoading(false);
    }
  };

  const validateChallenge = (challengeId) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, isCorrect: true }
          : challenge
      )
    );
  };

  return (
    <RulesContext.Provider
      value={{
        rules,
        challenges,
        getRules,
        addRule,
        editRule,
        removeRule,
        validateChallenge,
        loading,
        error,
        socket,
        serverConfig: SERVER_CONFIG
      }}
    >
      {children}
    </RulesContext.Provider>
  );
};

export default RulesContextProvider;
