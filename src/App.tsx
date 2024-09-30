import { useCallback, useState } from 'react';
import Square from './Square';
import './App.css';
import { SquaresContextProvider, useSquaresContext } from './SquaresContext';

function App() {

  const squaresContext = useSquaresContext();

  if (!squaresContext) {
    return <></>
  }

  const {
    squareBoundsStates,
    outerRectangle,
    outerRectangleWidth,
    outerRectangleHeight,
    outerSquareXPadding,
    outerSquareYPadding,
    outerRectangleBorderSize,
    outerSquareSide,
    isColliding,
  } = squaresContext;

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
          isColliding={isColliding(index)}
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

const WrappedApp = () => (
  <SquaresContextProvider>
    <App />
  </SquaresContextProvider>
)

export default WrappedApp
