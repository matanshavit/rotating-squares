import { createContext, FC, PropsWithChildren, useState, useCallback, useContext } from "react";

type Bounds = {
    top: number,
    bottom: number,
    left: number,
    right: number,
}

type SquareContextValue = {
    squareBoundsStates: [Bounds, (bounds: Bounds) => void][],
    outerRectangle: Bounds,
    outerRectangleWidth: number,
    outerRectangleHeight: number,
    outerSquareXPadding: number,
    outerSquareYPadding: number,
    outerRectangleBorderSize: number,
    outerSquareSide: number,
    isColliding: (index: number) => boolean,
}

const SquaresContext = createContext<SquareContextValue | undefined>(undefined);

export const SquaresContextProvider:  FC<PropsWithChildren>= ({ children }) => {

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

    const isColliding = useCallback((index: number) => {
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
    }, [squareBoundsStates])


    return (
        <SquaresContext.Provider value={{
            squareBoundsStates,
            outerRectangle,
            outerRectangleWidth,
            outerRectangleHeight,
            outerSquareXPadding,
            outerSquareYPadding,
            outerRectangleBorderSize,
            outerSquareSide,
            isColliding,
        }}>
            {children}
        </SquaresContext.Provider>
    );
};

export const useSquaresContext = () => useContext(SquaresContext);
