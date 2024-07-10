import Modal from 'react-modal';
import PropTypes from "prop-types";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "rgb(231, 255, 241)"
  },
};

function ScoreForm({ isVisible, time, game }) {

  const url = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const [username, setUsername] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const submitScore = () => {
    axios.post(`${url}/scores`, {
      name: username,
      game,
      time_completed: time
    }).then(() => {
      return navigate("/leaderboard", { state: { game } });
    }).catch((err) => console.log(err));
  }

  return (
    <Modal isOpen={isVisible} style={customStyles}>
      <div className="score-form">
        <p>You finished in {`${String(time.minutes).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}:${String(time.milliseconds).padStart(3, "0")}`} minutes!</p>
        <p className='font-light text-sm'>Submit your score to the leaderboard</p>
        <div className='my-3'>
          <label className='block text-md' style={{fontSize: "15px"}} htmlFor="username">Username</label>
          <input className="user-field" id="username" type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div className='flex justify-end'><button className='block submit-btn' onClick={submitScore}>Submit</button></div>
      </div>
    </Modal>
  )
}

ScoreForm.propTypes = {
  isVisible: PropTypes.bool,
  time: PropTypes.object,
  game: PropTypes.string
}

export default ScoreForm;