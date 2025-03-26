import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const RulesContext = createContext();

const RulesContextProvider = (props) => {
    const [rules, setRules] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("Fetching rules and challenges...");
                const rulesResponse = await axios.get("http://localhost:5000/rules");
                const challengesResponse = await axios.get("http://localhost:5000/challenges");
                console.log("Rules fetched:", rulesResponse.data);
                console.log("Challenges fetched:", challengesResponse.data);
                setRules(rulesResponse.data);
                setChallenges(challengesResponse.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data from the backend.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addRule = async (rule) => {
        try {
            const response = await axios.post("http://localhost:5000/rules", rule);
            console.log("Rule added:", response.data);
            setRules((prev) => [...prev, response.data]);
        } catch (error) {
            console.error("Error adding rule:", error);
        }
    };

    const removeRule = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/rules/${id}`);
            console.log("Rule removed with ID:", id);
            setRules((prev) => prev.filter((rule) => rule.id !== id));
        } catch (error) {
            console.error("Error removing rule:", error);
        }
    };

    const editRule = async (updatedRule) => {
        try {
            // Fixed error handling
            const response = await axios.put(`http://localhost:5000/rules/${updatedRule.id}`, updatedRule);
            console.log("Rule updated:", response.data);
            setRules((prev) =>
                prev.map((rule) => (rule.id === updatedRule.id ? response.data : rule))
            );
        } catch (error) {
            console.error("Error editing rule:", error);
        }
    };

    const validateChallenge = async (challengeId) => {
        try {
            const response = await axios.post(`http://localhost:5000/challenges/${challengeId}/validate`);
            console.log("Challenge validated:", response.data);
            setChallenges((prev) =>
                prev.map((challenge) =>
                    challenge.id === challengeId ? response.data : challenge
                )
            );
        } catch (error) {
            console.error("Error validating challenge:", error);
        }
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