import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from './contexts/Game';
import "./Stats.css";
const Stats = ({ floating, className = "" }) => {
    const { players } = useContext(GameContext);
    const [sortedByHighest, setSortedByHighest] = useState([]);
    useEffect(() => {
        if (players) {
            setSortedByHighest(Object.values(players)?.map(p => p.score).sort((a, b) => a < b ? +1 : -1));
        }
    }, [players]);
    if (floating) className += " stats--floating";
    return (
        <>
            {players && <div className={`stats box ${className}`}>
                <table>
                    <thead>
                        <tr><td>Player</td><td className='stats__score'>score</td></tr>
                    </thead>
                    <tbody>
                        {Object.values(players)?.map(p => {
                            return <tr className='row'><th>{p.name}</th><td className={`stats__score ${p.score === sortedByHighest[0] ? "stats__score--leading" : "stats__score--losing"}`}><span>{p.score}</span></td></tr>;
                        })}
                    </tbody>
                </table>
            </div>
            }
        </>
    );
};

export default Stats;