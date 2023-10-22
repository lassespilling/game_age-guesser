
import { useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import Guesser from './Guesser';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { GameContext } from './contexts/Game';

const Intro = () => {
  const { setPlayers } = useContext(GameContext);
  const navigate = useNavigate();
  const playerInput = useRef();
  useEffect(() => {
    if (playerInput.current) playerInput.current.focus();
  }, [playerInput]);
  useEffect(() => {
    setPlayers(null);
  }, []);


  return (
    <div className='box'>
      <h1>
        Who is playing?
      </h1>
      <input
        ref={playerInput}
        placeholder="e.g. Alex, John"
        onChange={e => {
          if (e.target.value?.length === 0) setPlayers(null);
        }}
        onKeyDown={e => {
          if (e.key === "Enter") {
            let playerObject = {};
            e.target.value.split(",")?.forEach(p => {
              playerObject[p] = { name: p, score: 0 };
            });
            setPlayers(playerObject);
            navigate("/start");
          }
        }} />
    </div>
  );
};
const Start = () => {
  const { players } = useContext(GameContext);
  const navigate = useNavigate();
  const playNowBtn = useRef();
  useEffect(() => {
    if (playNowBtn.current) {
      playNowBtn.current.focus();
    }
  }, [playNowBtn]);

  return (
    <div className='box'>
      <h1>Welcome</h1>
      <h2>{Object.values(players)?.map((p, index) => <>{index !== 0 ? " & " : ""} {p.name}</>)}</h2>
      <hr />
      <div className='ui-row'>
        <button onClick={() => navigate("/")} className='back'>Back</button>
        <button onClick={() => navigate("/play")} className='ok' ref={playNowBtn}>Play now</button>
      </div>
    </div>
  );
};

const Play = () => {
  const { players, turn, setTurn, setWinner, totalTurns, roundCompleted } = useContext(GameContext);
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const navigate = useNavigate();
  useEffect(() => {
    if (players && turn === null) {
      let pIndexes = Object.keys(players);
      let random = getRandom(pIndexes);
      setTurn(players[random]);
    }
  }, [players, turn]);

  useEffect(() => {
    if (players) {
      Object.values(players).forEach((p, index) => {
        if (p.score > 200 && roundCompleted) {
          setWinner(players[p.name]);
          navigate("/winner");
        }
      });
    }
  }, [players, roundCompleted]);

  return (
    <>
      <h2 style={{ marginBottom: "1rem" }}>{turn?.name}, your turn:</h2>
      <Guesser player={turn} key={totalTurns + "guesser"} />
    </>
  );
};

const Winner = () => {
  const { winner } = useContext(GameContext);

  return (
    <>
      <h1>Congrats {winner?.name}, you won!</h1>
    </>
  );
};
function App() {
  const { setPlayers, players } = useContext(GameContext);
  const navigate = useNavigate();
  const [sortedByHighest, setSortedByHighest] = useState([]);
  useEffect(() => {
    if (players) {
      setSortedByHighest(Object.values(players)?.map(p => p.score).sort((a, b) => a < b ? +1 : -1));
    }
  }, [players]);

  return (
    <>
      {players && <div className='stats box'>
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
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/start" element={<Start />} />
        <Route path="/play" element={<Play />} />
        <Route path="/winner" element={<Winner />} />
      </Routes>
      {players && <button className='reset' onClick={() => { navigate("/"); setPlayers(null); }}>Reset</button>}
      {/* <Guesser /> */}
    </>
  );
}

export default App;
