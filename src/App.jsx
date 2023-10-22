

import { useContext, useEffect, useRef, useState } from 'react';
import './App.css';
import Guesser from './Guesser';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { GameContext } from './contexts/Game';
import Winner from './Winner';
import Stats from './Stats';
const WINNING_SCORE = 100;

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
        if (p.score > WINNING_SCORE && roundCompleted) {
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

function App() {
  const { setPlayers, players } = useContext(GameContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <>
      <Stats floating />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/start" element={<Start />} />
        <Route path="/play" element={<Play />} />
        <Route path="/winner" element={<Winner />} />
      </Routes>
      {players &&
        <button
          className='reset'
          onClick={() => { navigate("/"); setPlayers(null); }}>
          {pathname === "/winner" ? "Play again" : "Reset"}
        </button>}
      {/* <Guesser /> */}
    </>
  );
}

export default App;
