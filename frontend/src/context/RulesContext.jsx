import { createContext, useState } from "react";

export const RulesContext = createContext();

const RulesContextProvider = (props) => {
    const [rules, setRules] = useState([
        { id: 1, action: "Allow", protocol: "TCP", source: "192.168.1.1", destination: "192.168.1.1", port: "53" },
        { id: 2, action: "Allow", protocol: "TCP", source: "192.168.1.2", destination: "192.168.1.2", port: "80" },
        { id: 3, action: "Deny", protocol: "UDP", source: "192.168.1.3", destination: "192.168.1.3", port: "443" },
        { id: 4, action: "Allow", protocol: "TCP", source: "192.168.1.4", destination: "192.168.1.4", port: "22" }
    ]);

    const addRule = (rule) => {
        setRules([...rules, rule]);
    };

    const removeRule = (id) => {
        setRules(rules.filter(rule => rule.id !== id));
    };

    const editRule = (updatedRule) => {
        setRules(rules.map(rule => rule.id === updatedRule.id ? updatedRule : rule));
    };

    const value = {
        rules,
        addRule,
        removeRule,
        editRule
    };

    return (
        <RulesContext.Provider value={value}>
            {props.children}
        </RulesContext.Provider>
    );
}

export default RulesContextProvider;