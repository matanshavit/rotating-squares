import { useState } from 'react';
import Square from './Square';
import './App.css';

function App() {

  const squareCount = 5
  const squareBoundsStates = [...Array(squareCount)].map(() => (
    useState({top: 0, bottom: 0, left: 0, right: 0,})
  ))

  const outerRectangle = {
    top: Math.min(...squareBoundsStates.map(squareBoundsState => squareBoundsState[0].top)),
    bottom: Math.max(...squareBoundsStates.map(squareBoundsState => squareBoundsState[0].bottom)),
    left: Math.min(...squareBoundsStates.map(squareBoundsState => squareBoundsState[0].left)),
    right: Math.max(...squareBoundsStates.map(squareBoundsState => squareBoundsState[0].right)),
  }
  const outerRectangleWidth = outerRectangle.right - outerRectangle.left
  const outerRectangleHeight = outerRectangle.bottom - outerRectangle.top
  const outerRectangleBorderSize = 16

  const outerSquareSide = Math.max(outerRectangleWidth, outerRectangleHeight)
  const outerSquareXPadding = (outerSquareSide - outerRectangleWidth) / 2
  const outerSquareYPadding = (outerSquareSide - outerRectangleHeight) / 2

  const isColliding = (index: number) => {
    const squareBounds = squareBoundsStates[index][0]
    return [
      ...squareBoundsStates.slice(0, index),
      ...squareBoundsStates.slice(index + 1),
    ].some(squareBoundsState => {
      const otherSquareBounds = squareBoundsState[0]
      return (
        squareBounds.left < otherSquareBounds.right &&
        squareBounds.right > otherSquareBounds.left &&
        squareBounds.top < otherSquareBounds.bottom &&
        squareBounds.bottom > otherSquareBounds.top
      );
    })
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: `${outerRectangle.top  - outerSquareYPadding - outerRectangleBorderSize}px`,
          left: `${outerRectangle.left - outerSquareXPadding - outerRectangleBorderSize}px`,
          width: `${outerSquareSide}px`,
          height: `${outerSquareSide}px`,
          border: `${outerRectangleBorderSize}px #FFDD44 solid`,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: `${outerRectangle.top - outerRectangleBorderSize}px`,
          left: `${outerRectangle.left - outerRectangleBorderSize}px`,
          width: `${outerRectangleWidth}px`,
          height: `${outerRectangleHeight}px`,
          border: `${outerRectangleBorderSize}px #FF9944 solid`,
        }}
      />
      {squareBoundsStates.map((squareBoundsState, index) => (
        <Square
          squareId={index.toString()}
          onUpdateSquareBounds={(squareBounds) => {squareBoundsState[1](squareBounds)}}
          isColliding={() => isColliding(index)}
        />
      ))}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          display: "flex",
          gap: "16px",
          margin: "16px",
        }}
      >
        outerSquare:<br />
        top: {outerRectangle.top}<br />
        bottom: {outerRectangle.bottom}<br />
        left: {outerRectangle.left}<br />
        right: {outerRectangle.right}<br />

        <br />score: {outerSquareSide / 100}<br />
      </div>
    </>
  )
}

export default App
