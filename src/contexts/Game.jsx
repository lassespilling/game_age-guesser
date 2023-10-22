import React, { createContext, useCallback, useEffect, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    function useStickyState(defaultValue, key) {
        const [value, setValue] = React.useState(() => {
            const stickyValue = window.localStorage.getItem(key);
            return stickyValue !== null
                ? JSON.parse(stickyValue)
                : defaultValue;
        });
        React.useEffect(() => {
            window.localStorage.setItem(key, JSON.stringify(value));
        }, [key, value]);
        return [value, setValue];
    }
    const [players, setPlayers] = useStickyState(null, "players");
    const [turn, setTurn] = useState(null);
    const [roundCompleted, setRoundCompleted] = useState(false);
    useEffect(() => {
        setRoundCompleted(false);
    }, [turn]);

    const [totalTurns, setTotalTurns] = useState(0);
    const nextPlayer = useCallback(
        (current) => {
            let keys = Object.keys(players);
            let currentIndex = keys.indexOf(current.name);
            let nextIndex = currentIndex === Object.keys(players)?.length - 1 ? 0 : currentIndex + 1;
            if (nextIndex === 0) {
                setRoundCompleted(true);
            }
            let nextItem = players[keys[nextIndex]];
            // console.log(currentIndex, Object.keys(players)?.length);
            setTotalTurns(p => p + 1);
            setTurn(nextItem);
        },
        [players],
    );

    const updateScore = useCallback(
        (score, current) => {
            if (score) {
                setPlayers(pArr => {
                    let totalScore = parseInt(current.score || 0) + parseInt(score);
                    return { ...pArr, [current.name]: { ...current, score: totalScore } };
                });
            }
        },
        [setPlayers],
    );

    const [winner, setWinner] = useState(null);

    return <GameContext.Provider value={{ setPlayers, players, turn, setTurn, nextPlayer, updateScore, winner, setWinner, totalTurns, roundCompleted }}>{children}</GameContext.Provider>;
};