import "./Winner.css";
import Lottie from "lottie-react";
import winAnimation from "./win2.json";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Stats from "./Stats";
const Winner = () => {
    const winner = { name: "Player 1" };
    useEffect(() => {
        document.body.classList.add("victory");
    }, []);

    return (
        <>
            <div
                className="winner__animation">
                <Lottie
                    animationData={winAnimation}
                    loop={false}
                />
            </div>
            <motion.div className="winner-wrapper" transition={{ delay: 1, duration: 1 }} initial={{ height: 0 }} animate={{ height: "auto" }} style={{ overflow: "hidden" }}>
                <div>
                    <div className="floating">
                        <div className='box winner'>
                            <h1>Congrats <em>{winner?.name}</em>, <br />you won!</h1>
                        </div>
                    </div>
                    <div className="stats-wrapper"> <Stats /></div>
                </div>
            </motion.div>
        </>
    );
};

export default Winner;