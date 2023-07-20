import { combineReducers } from 'redux';

const initialState = {
  cards: [],
};
export const addCard = (card) => ({
  type: 'ADD_CARD',
  payload: card,
});

export const removeCard = (index) => ({
  type: 'REMOVE_CARD',
  index: index,
});

export const setCards = (cards) => ({
  type: 'SET_CARDS',
  payload: cards,
});

export const removeAllCards = (index) => ({
  type: 'REMOVE_ALL_CARDS',
  index: index,
});

export const checkCard = (cards) => ({
  type: 'CHECK_CARD',
  payload: cards,
});


function cardsReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.payload],
      };
    case 'REMOVE_CARD':
      const updatedCards = state.cards.filter((card) => card.id !== action.id);
      return {
        ...state,
        cards: updatedCards,
      };

    case 'SET_CARDS':
      return {
        ...state,
        cards: action.payload,
      };

    case 'REMOVE_ALL_CARDS':
      return {
        ...state,
        cards: [],
      };

    case 'CHECK_CARD':
      const updatedCard = state.cards.map((card) =>
        card.id === action.payload.id ? { ...card, check: action.payload.check } : card
      );
      return {
        ...state,
        cards: updatedCard,
      };


    default:
      return state;
  }
}


const rootReducer = combineReducers({
  cards: cardsReducer,
});



export default rootReducer;