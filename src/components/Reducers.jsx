import { combineReducers } from 'redux';
import { useDispatch, useSelector } from 'react-redux';



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



const reducer = (state = initialState, action) => {
  switch (action.type) {
    // ...
    case 'REMOVE_CARD':
      return handleRemoveCard(state, action);
    // ...
    default:
      return state;
  }
};

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

    default:
      return state;
  }
}

function handleTrash(index) {
  const cards = useSelector((state) => state.cards.cards); // Acessar o estado do Redux
  const cardId = cards[index].id;
  const dispatch = useDispatch(); // Obter a função de dispatch do Redux

  axios
    .delete(`http://localhost:3000/cards/${cardId}`)
    .then((response) => {
      if (response.status === 200) {
        console.log('Card deletado com sucesso!');
        dispatch(removeCard(index)); // Dispatch da ação para remover o card do estado do Redux
      } else {
        console.error('Erro ao deletar o card:', response.status);
      }
    })
    .catch((error) => {
      console.error('Erro ao deletar o card:', error);
    });
}

const handleRemoveCard = (state, action) => {
  const updatedCards = state.cards.filter((_, index) => index !== action.index);
  return { ...state, cards: updatedCards };
};

const rootReducer = combineReducers({
  cards: cardsReducer,
});



export default rootReducer;