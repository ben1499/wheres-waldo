
import { useRef, useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import ImageMagnifier from "../components/ImageMagnifier";
import waldo from "../assets/waldo.jpg";
import wilma from "../assets/wilma.jpg";
import odlaw from "../assets/odlaw.jpg";
import { FaMagnifyingGlass } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import ScoreForm from "../components/ScoreForm";

function Game() {
  const { games } = useOutletContext();

  const [characters, setCharacters] = useState([
    {
      key: "waldo",
      name: "Waldo",
      isMarked: false,
      image: waldo,
      position: null
    },
    {
      key: "wilma",
      name: "Wilma",
      isMarked: false,
      image: wilma,
      position: null
    },
    {
      key: "odlaw",
      name: "Odlaw",
      isMarked: false,
      image: odlaw,
      position: null
    },
  ])

  const url = import.meta.env.VITE_API_URL;
  const imageRef = useRef();

  const { game } = useParams();

  const [enableMagnifier, setEnableMagnifier] = useState(false);

  const [showMarker, setShowMarker] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({x: 0, y: 0})

  const [isModalVisible, setModalVisible] = useState(false);
  const [timer, setTimer] = useState(0);

  const [isRunning, setRunning] = useState(true);
  const [timeCompleted, setTimeCompleted] = useState({ minutes: 0, seconds: 0, milliseconds: 0 });

  const currentGame = games.find((item) => item.key === game);

  // Using timestamps so that timer continues even on tab change
  const intervalRef = useRef(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    axios.get(`${url}/start-game`)
    .then(() => {
      startRef.current = Date.now();
        intervalRef.current = setInterval(() => {
          const now = Date.now();
          setTimer(now - startRef.current);
        }, 45)
    }).catch((err) => console.log(err));

    // Cleanup function
    return () => {
      clearInterval(intervalRef.current);
    }

  }, [url]);

  // Hours calculation
  // const hours = Math.floor(timer / 360000);

  // Minutes calculation
  let minutes = Math.floor((timer % 360000) / (1000 * 60));

  // Seconds calculation
  let seconds = Math.floor((timer % (1000 * 60) / 1000));

  // Milliseconds calculation
  let milliseconds = timer % 1000;

  const normalizeImageCoords = (x, y) => {
    const boundingBox = imageRef.current.getBoundingClientRect();
    setMarkerPosition({ 
      x: Math.trunc(x - boundingBox.left), 
      y: Math.trunc(y - boundingBox.top) 
    })
  }

  const handleImageClick = (e) => {
    setShowMarker(!showMarker)
    normalizeImageCoords(e.clientX, e.clientY);
  }

  const toggleMagnifier = () => {
    setEnableMagnifier(!enableMagnifier);
  }

  const handleSelection = (characterName) => {
    return () => {
      axios.get(`${url}/verify`, {
        params: {
          game,
          character: characterName,
          coordinates: [markerPosition.x, markerPosition.y]
        }
      }).then((res) => {
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true
        })
        const modifiedCharacters = characters.map((item) => {
          if (item.name === characterName) {
            return {
              ...item,
              isMarked: true,
              position: markerPosition
            }
          }
          return item;
        });
        if (modifiedCharacters.every((item) => item.isMarked)) {
          axios.get(`${url}/end-game`)
          .then((res) => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setModalVisible(true);
            setRunning(false);
            setTimeCompleted(res.data.time_completed);
          })
        }
        setCharacters(modifiedCharacters);
        setShowMarker(false);
      }).catch((err) => {
        if (err.response.status === 404) {
          toast.error(err.response.data.message, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true
          })
        }
      })
    }
  }

  return (
    <div className="text-center game-container" style={{ width: '900px' }}>
      <ScoreForm isVisible={isModalVisible} time={timeCompleted} game={game} />
      <div className="flex justify-between items-center px-4 py-1">
        <button 
          className="flex items-center gap-x-1 border-solid border-2 px-1 text-sm magnify-btn" 
          style={{backgroundColor: enableMagnifier ? "#dd6937" : "#df997c", color: enableMagnifier ? "#fff" : "" }}
          onClick={toggleMagnifier}>
            <FaMagnifyingGlass /> Magnifier
        </button>
        <div className="flex items-center gap-x-8">
          <div className="flex gap-x-4">
            <div className="flex items-center">
              <img width="35" src={waldo} alt="" />
              Waldo</div>
            <div className="flex items-center">
            <img width="35" src={wilma} alt="" />
              Wilma</div>
            <div className="flex items-center">
              <img width="35" src={odlaw} alt="" />
              Odlaw</div>
          </div>
          {isRunning ? (
            <p>{`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(3, "0")}`}</p>
          ) : <p>00:00:000</p>}
        </div>
      </div>
      {/* <img className="w-full" ref={imageRef} src={currentGame.image} alt="" onClick={handleImageClick} /> */}
      <div style={{ position: "relative"}}>
        <ImageMagnifier
          ref={imageRef}
          src={currentGame.image}
          zoomLevel={2.5}
          enableMagnifier={enableMagnifier}
          magnifierHeight={130}
          magnifierWidth={130}
          onClick={handleImageClick}
        />
        <div
          className="image-marker"
          style={{ display: showMarker ? "" : "none", top: markerPosition.y - 10, left: markerPosition.x - 12  }}>
            <div className="marker"></div>
            <div className="selector">
              {characters.map((character) => {
                if (!character.isMarked) {
                  return <div key={character.key} className="flex selection-item" onClick={handleSelection(character.name)}>
                  <img width="40" src={character.image} alt="" />
                  {character.name}</div>
                } else return null;
                }
              )}
            </div>
        </div>
        {characters.map((item) => {
          if (item.isMarked) {
            return <div key={item.key} className="char-marker" style={{ top: item.position.y - 10, left: item.position.x - 12 }}></div>
          } else return null;
        })}
      </div>
    </div>
  )
}

export default Game;