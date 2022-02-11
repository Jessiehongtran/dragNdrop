import React, {useState, useCallback} from 'react';
import styled from 'styled-components';
import Draggable from './Draggable';
import {range, inRange} from 'lodash';

const MAX = 5;
const HEIGHT = 80

function App() {
  const items = range(MAX);
  const [state, setState] = useState({
    order: items,
    dragOrder: items,
    draggedIndex: null
  });

  const handleDrag = useCallback(({translation, id}) => {
    const delta = Math.round(translation.y/HEIGHT);
    // console.log('translation.y', translation.y, 'HEIGHT', HEIGHT, 'delta', delta)
    const index = state.order.indexOf(id);
    const dragOrder = state.order.filter(index => index !== id)

    console.log('id', id, 'index', index, 'delta', delta )

    console.log('dragOrder before', dragOrder)

    if (! inRange(index + delta, 0, items.length)){
      return 
    }

    dragOrder.splice(index + delta, 0, id);

    console.log('dragOrder after', dragOrder)

    setState(state => ({
      ...state,
      draggedIndex: id, 
      dragOrder
    }))
  }, [state.order, items.length])

  const handleDragEnd = useCallback(() => {
    setState(state => ({
      ...state,
      order: state.dragOrder,
      draggedIndex: null
    }))
  }, [])

  return (
    <Container>
      {items.map(index => {
        const isDragging = state.draggedIndex === index;
        const draggedTop = state.order.indexOf(index)*(HEIGHT + 10);
        const top = state.dragOrder.indexOf(index)*(HEIGHT + 10);

        return (
          <Draggable
            key ={index}
            id={index}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <Rect
              top= {isDragging ? draggedTop : top}
              isDragging = {isDragging}
            >
              {index}
            </Rect>
          </Draggable>
        )
      })}
    </Container>
  );
}

export default App;

const Container = styled.div`
  width: 100vw;
  min-height: 100vh
`;

const Rect = styled.div.attrs(props => ({
  style: {
    top: `${props.top}px`,
    transition: props.isDragging ? 'none' : 'all 500ms'
  }
}))`
  width: 300px;
  height: ${HEIGHT}px;
  user-select: none;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: cal(50vw - 150px);
  color: #777;
  font-size: 20px
`