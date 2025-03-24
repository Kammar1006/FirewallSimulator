import { createContext, useState, useEffect } from "react";

export const RulesContext = createContext();

const RulesContextProvider = (props) => {
    // Load rules from localStorage or initialize as an empty array
    const [rules, setRules] = useState(() => {
        const savedRules = localStorage.getItem("rules");
        return savedRules ? JSON.parse(savedRules) : [];
    });

    // Load challenges from localStorage or initialize with predefined challenges
    const [challenges, setChallenges] = useState(() => {
        const savedChallenges = localStorage.getItem("challenges");
        return savedChallenges
            ? JSON.parse(savedChallenges)
            : [
                  {
                      id: 1,
                      description: "Allow TCP from 192.168.1.1 to any on port 53",
                      expected: {
                          action: "Allow",
                          protocol: "TCP",
                          source: "192.168.1.1",
                          destination: "192.168.1.1",
                          port: "53",
                      },
                      isCorrect: null,
                  },
                  {
                      id: 2,
                      description: "Deny UDP from 192.168.1.3 to 192.168.1.3 on port 443",
                      expected: {
                          action: "Deny",
                          protocol: "UDP",
                          source: "192.168.1.3",
                          destination: "192.168.1.3",
                          port: "443",
                      },
                      isCorrect: null,
                  },
                  {
                      id: 3,
                      description: "Allow TCP from 192.168.1.4 to 192.168.1.4 on port 22",
                      expected: {
                          action: "Allow",
                          protocol: "TCP",
                          source: "192.168.1.4",
                          destination: "192.168.1.4",
                          port: "22",
                      },
                      isCorrect: null,
                  },
              ];
    });

    // Save rules to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("rules", JSON.stringify(rules));
    }, [rules]);

    // Save challenges to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("challenges", JSON.stringify(challenges));
    }, [challenges]);

    const areRulesEqual = (rule1, rule2) => {
        return (
            rule1.action === rule2.action &&
            rule1.protocol === rule2.protocol &&
            rule1.source === rule2.source &&
            rule1.destination === rule2.destination &&
            rule1.port === rule2.port
        );
    };

    const validateChallenge = (challengeId) => {
        setChallenges((prevChallenges) =>
            prevChallenges.map((challenge) => {
                if (challenge.id === challengeId) {
                    const matchingRule = rules.find((rule) =>
                        areRulesEqual(rule, challenge.expected)
                    );
                    return { ...challenge, isCorrect: !!matchingRule };
                }
                return challenge;
            })
        );
    };

    const addRule = (rule) => {
        setRules([...rules, rule]);
    };

    const removeRule = (id) => {
        setRules(rules.filter((rule) => rule.id !== id));
    };

    const editRule = (updatedRule) => {
        setRules((prevRules) =>
            prevRules.map((rule) =>
                rule.id === updatedRule.id ? updatedRule : rule
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
    };

    return (
        <RulesContext.Provider value={value}>
            {props.children}
        </RulesContext.Provider>
    );
};

export default RulesContextProvider;