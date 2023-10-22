import { useCallback, useContext, useRef, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { GameContext } from './contexts/Game';

function Guesser({ player }) {
    const { nextPlayer, updateScore } = useContext(GameContext);
    const [name, setName] = useState(null);
    const [age, setAge] = useState(null);
    const [error, setError] = useState(null);

    const getName = useCallback(
        () => {
            axios.get("https://api.codetabs.com/v1/proxy?quest=https://api.namefake.com/norwegian-norway").then(r => {
                if (r.data) {
                    setName(r.data.name.split(" ")[0]);
                }
            }).catch(console.error);
        },
        [],
    );
    useEffect(() => {
        if (name !== null) getName();
    }, []);

    const getAge = useCallback(
        () => {
            axios.get(`https://api.codetabs.com/v1/proxy?quest=https://api.agify.io/?name=${name}`).then(r => {
                // console.log(r.data);
                if (r.data.age) {
                    setAge(r.data.age);
                }
                else {
                    setError("could not find age");
                }
            }).catch(err => {
                setError(err);
            });
        },
        [setAge, name],
    );

    useEffect(() => {
        getName();
    }, [getName]);
    const guess = useRef();

    useEffect(() => {
        if (name && guess.current) {
            guess.current.focus();
        }
    }, [name]);

    const newName = useRef();
    useEffect(() => {
        if (age && newName.current) {
            newName.current.focus();
        }
    }, [age]);
    const ageBtn = useRef();

    const [guessedAge, setGuessedAge] = useState(null);
    const [score, setScore] = useState(null);

    useEffect(() => {
        if (guessedAge && age) {
            const calcPercentage = (x, y) => {
                if (y > x) {
                    return (x / y * 100).toFixed(0);
                } else {
                    return (y / x * 100).toFixed(0);
                }
            };
            let s = calcPercentage(guessedAge, age);
            setScore(s);
        }
    }, [guessedAge, age]);
    const reset = useCallback(
        () => {
            getName();
            setName(null);
            setAge(null);
            guess.current.value = null;
            setGuessedAge(null);
            setScore(null);
            setError(null);
            guess.current.focus();
        },
        [],
    );

    useEffect(() => {
        const r = (e) => {
            if (e.key === "Escape") {
                reset();
            }
        };
        document.body.addEventListener('keydown', (e) => r(e));
        return () =>
            document.body.removeEventListener('keydown', r);
    }, []);

    useEffect(() => {
        if (guessedAge && newName.current) {
            setTimeout(() => {

                newName.current.focus();
            }, 300);
        }
    }, [guessedAge, newName]);


    return (
        <div className='box'>
            <h2>How old is: </h2>
            <input type="text" defaultValue={name} className='name'
                onBlur={(e) => {
                    if (e.target.value.length === 0) {
                        getName();
                    } else {
                        setName(e.target.value);
                    }
                }}
            // // onKeyDown={e => {
            // //   if (e.key === "Enter") {
            // //     setName(e.target.value);
            // //   }
            // // }}
            />
            {!guessedAge && <input ref={guess} type="text" placeholder='age' style={{ width: 40 }}
                onKeyDown={e => {
                    if (e.key === "Enter") {
                        setGuessedAge(e.target.value);
                        // ageBtn.current.click();
                        getAge();
                    }
                }}
            ></input>}
            {/* {name && !age &&
                <button ref={ageBtn} onClick={() => {
                    getAge();
                }}>
                    Reveal age
                </button>
            } */}
            {age &&
                <>
                    <hr />
                    <h2>AI says: {age}</h2>
                    <hr />
                </>
            }

            {score &&
                <>
                    <div className={`score
          ${score < 40 ? "score--low" : ""}
          ${score > 40 && score < 75 ? "score--medium" : ""}
          ${score > 75 ? "score--high" : ""}
          `}><small>You scored:</small><br />
                        {score}/100
                    </div>
                </>
            }
            <button style={{ display: score ? "block" : "none" }} ref={newName} onClick={() => {
                updateScore(score, player);
                nextPlayer(player);
            }}>Next</button>
            {error && <><pre>{JSON.stringify(error, null, 1)}</pre><button onClick={() => reset()}>New name</button></>}
        </div>
    );
}

export default Guesser;
