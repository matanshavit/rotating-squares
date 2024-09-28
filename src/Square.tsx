import { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable';

type SquareProps = {
  squareId: String
  onUpdateSquareBounds?: (bounds: {
    top: number,
    bottom: number,
    left: number,
    right: number,
  }) => void
  isColliding?: () => boolean
}

function Square({squareId, onUpdateSquareBounds = ()=>{}, isColliding = ()=>false}: SquareProps) {

  const [squareBounds, setSquareBounds] = useState(
    {top: 0, bottom: 0, left: 0, right: 0,}
  );

  useEffect(() => {
    onUpdateSquareBounds(squareBounds)
  }, [squareBounds])

  const fullSquareRef = useRef<HTMLDivElement>(null);

  const GREEN = "#44FF99"
  const RED = "#FF4499"
  const [boundsBorderColor, setBoundsBorderColor] = useState(GREEN)

  const updateSquareBounds = () => {
    if (fullSquareRef.current !== null) {
      setSquareBounds(fullSquareRef.current.getBoundingClientRect())
      setBoundsBorderColor(isColliding() ? RED : GREEN)
    }
  }

  const [rotateAngle, setRotateAngle] = useState(0);

  useEffect(updateSquareBounds, [fullSquareRef.current, rotateAngle])
  useEffect(() => {
    document.defaultView?.addEventListener('resize', updateSquareBounds)
    return () => document.defaultView?.removeEventListener('resize', updateSquareBounds)
  }, [])

  const handleDrag = () => {
    updateSquareBounds()
  }

  const squareCenterX = (squareBounds.left + squareBounds.right) / 2
  const squareCenterY = (squareBounds.top + squareBounds.bottom) / 2


  const getAngle = (xPosition: number, yPosition: number) => {
    if (xPosition == 0) {
      if (yPosition == 0) {
        return 0
      }
      if (yPosition > 0) {
        return Math.PI / 2
      }
      return -1 * Math.PI / 2
    }
    const angle = Math.atan(yPosition / xPosition)
    if (xPosition < 0) {
      return Math.PI + angle
    }
    return angle
  }

  const handleRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (event: MouseEvent) => {
    const xPosition = event.clientX - squareCenterX;
    const yPosition = event.clientY - squareCenterY;

    const angle = getAngle(xPosition, yPosition)
    setRotateAngle(angle + (Math.PI / 4))
  };

  const [grabbing, setGrabbing] = useState(false)


  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mouseleave', onMouseUp);

    if(handleRef.current) {
      handleRef.current.style.cursor = "grab";
    }
    document.documentElement.style.cursor = "default";

    setGrabbing(false)
  };

  const onHandleMouseDown = () => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseUp);

    if(handleRef.current) {
      handleRef.current.style.cursor = "grabbing";
    }
    document.documentElement.style.cursor = "grabbing";

    setGrabbing(true)
  }

  const sideLength = 100;
  const handleSize = 33;

  const [handleVisible, setHandleVisible] = useState(false);

  const boundsBorderSize = 4;

  return (
    <>
    <div
      style={{
        position: "fixed",
        top: `${squareBounds.top - boundsBorderSize}px`,
        left: `${squareBounds.left - boundsBorderSize}px`,
        width: `${squareBounds.right - squareBounds.left}px`,
        height: `${squareBounds.bottom - squareBounds.top}px`,
        border: `${boundsBorderSize}px ${boundsBorderColor} solid`,
      }}
    />
    <Draggable
      handle={`#square-${squareId}`}
      onDrag={handleDrag}
      onStop={updateSquareBounds}
    ><div>
      <div
        ref={fullSquareRef}
        style={{
          height: `${sideLength}px`,
          transform: `rotate(${rotateAngle}rad)`,
          position: 'relative'
        }}
        onMouseEnter={() => setHandleVisible(true)}
        onMouseLeave={() => setHandleVisible(false)}
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          height={`${sideLength}px`}
          width={`${sideLength}px`}
          id={`square-${squareId}`}
        >
          <rect width="100" height="100" fill="#4499FF"/>
        </svg>

        <div
          onMouseDown={onHandleMouseDown}
          ref={handleRef}
          style={{
            cursor: "grab",
            userSelect: "none",

            position: 'absolute',
            top: `-${handleSize / 2}px`,
            left: `${sideLength - (handleSize / 2)}px`,

            display: (handleVisible || grabbing) ? 'block' : 'none',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            height={`${handleSize}px`}
            width={`${handleSize}px`}
          >
          <g>
            <circle cx="50" cy="50" r="46" style={{
              stroke: "white",
              strokeWidth: "8px",
              fill: "#222222",
            }} />
            <text x="50%" y="50%" textAnchor="middle" fill="white" dy="0.3em" style={{
              color: "white",
              fontSize: "50px",
              fontWeight: "bold",
            }}>
              ↻
            </text>
          </g>
        </svg>
        </div>
      </div>
    </div></Draggable>
    </>
  )
}

export default Square
