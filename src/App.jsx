import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/Card.jsx'
import Header from './components/Header';
import axios from 'axios';
import { connect } from 'react-redux';
import { addCard, removeCard,setCards,removeAllCards,checkCard } from './components/Reducers';
import { useDispatch,useSelector } from 'react-redux';


function App({  addCard }) {

	const [name, setName] = useState('');
	const [time, setTime] = useState('');
	const dispatch = useDispatch();
	const cards = useSelector((state) => state.cards.cards);
	// let [cards, setCards] = useState([]);

	useEffect(() => {
		fetchCards();
	}, []);


	function fetchCards() {
		axios
		  .get('http://localhost:3000/cards')
		  .then((response) => {
			const cardsData = response.data;
			const fetchedCards = cardsData.map((card) => ({
			  id: card.id,
			  name: card.name,
			  time: card.time,
			  check: card.check,
			}));

			const sortedCards = [...fetchedCards].sort((a, b) => {
        const timeA = parseInt(a.time.split(':').join(''), 10);
        const timeB = parseInt(b.time.split(':').join(''), 10);
        return timeA - timeB;
      });

			dispatch(setCards(sortedCards)); // Dispatch da ação para definir os cards no estado do Redux
		  })
		  .catch((error) => {
			console.error('Erro ao recuperar os cards:', error);
		  });
	  }






	function handleNameChange(e) {
		setName(e.target.value)
	}

	function handleTimeChange(e) {
		setTime(e.target.value)
	}



	function handleSubmit() {
		const newCard = {
			name: name,
			time: time,
			check: false,
			// time: new Date().toLocaleTimeString("pt-br",{
			// 	hour:'2-digit',
			// 	minute:'2-digit',
			// 	second:'2-digit',
			// })

		};


		fetch('http://localhost:3000/cards', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newCard)
		})
			.then(response => {
				if (response.ok) {
					return response.json(); // Obtenha a resposta JSON do servidor
				} else {
					throw new Error('Erro ao adicionar o card: ' + response.status);
				}
			})
			.then(data => {
				const addedCard = {
					id: data.id, // Obtenha o id do card da resposta do servidor
					name: data.name,
					time: data.time,
					check: data.check
				};
				addCard(addedCard);
				const sortedCards = [...cards, addedCard].sort((a, b) => {
					const timeA = parseInt(a.time.split(':').join(''), 10);
					const timeB = parseInt(b.time.split(':').join(''), 10);
					return timeA - timeB;
				});
				dispatch(setCards(sortedCards));
				console.log('Card adicionado com sucesso!');
				setName('');
				setTime('');
			})
			.catch(error => {
				console.error('Erro ao adicionar o card:', error);
			});

		// setCards(prevState => [...prevState, newCard]);
		// setName('')
		// setTime('')

	}



	function handleCheck(index) {
		// const updatedCards = [...cards];
		// updatedCards[index].check = !updatedCards[index].check;
		// setCards(updatedCards);

		const updatedCards = [...cards];
		updatedCards[index].check = !updatedCards[index].check;
		// checkCard();
		// setCards(updatedCards);

		const cardId = cards[index].id;

		fetch(`http://localhost:3000/cards/${cardId}`, {
			method: 'PATCH', // ou 'PUT', dependendo da sua API
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				check: updatedCards[index].check,
			}),
		})
			.then(response => {
				if (response.ok) {
					console.log('Estado do card atualizado com sucesso!');
					dispatch(checkCard(updatedCards))
				} else {
					console.error('Erro ao atualizar o estado do card:', response.status);
				}
			})
			.catch(error => {
				console.error('Erro ao atualizar o estado do card:', error);
			});
	}

	function handleTrash(index) {
		const updatedCards = [...cards];
		const cardId = cards[index].id;
		updatedCards.splice(index, 1); // Remove o card do array usando splice

		removeCard(index);

		fetch(`http://localhost:3000/cards/${cardId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then(response => {
				if (response.ok) {
					console.log('Card deletado com sucesso!');
					fetchCards()
				} else {
					console.error('Erro ao deletar o card:', response.status);
				}
			})
			.catch(error => {
				console.error('Erro ao deletar o card:', error);
			});

	}



	function handleClearAll() {

		const deleteRequests = cards.map((card) =>
		fetch(`http://localhost:3000/cards/${card.id}`, {
		  method: 'DELETE',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ ids: [card.id] }),
		})
	  );

	  Promise.all(deleteRequests)
		.then((responses) => {
		  const allDeleted = responses.every((response) => response.ok);
		  if (allDeleted) {
			console.log('Registros excluídos com sucesso');
			dispatch(removeAllCards()); // Dispatch da ação para remover todos os cards do estado do Redux
			fetchCards(); // Buscar os cards atualizados
		  } else {
			console.log('Erro ao excluir registros');
		  }
		})
		.catch((error) => {
		  console.error(error);
		});
	}





	// useEffect(() => {
	// console.log('Use Effect Foi ativado')
	// },[]);



	return (
		<div className='container'>
			<Header handleClearAll={handleClearAll} />
			<div className='input'>
				<input type='text' placeholder='Digite a Tarefa' value={name} onChange={handleNameChange} />
				<input type='time' placeholder='Digite o Horário Aproximado' value={time} onChange={handleTimeChange} />
			</div>
			<button type='button' onClick={handleSubmit}>Adicionar</button>
			{
				cards.map((card, index) => <Card
					key={index}
					name={card.name}
					time={card.time}
					check={card.check}
					handleChecked={() => handleCheck(index)}
					handleTrash={() => handleTrash(index)}
					handleClearAll={handleClearAll}
				/>)

			}
		</div>
	)
}

const mapStateToProps = (state) => ({
	cards: state.cards.cards,
});

const mapDispatchToProps = (dispatch) => ({
	addCard: (card) => dispatch(addCard(card)),
	removeCard: (index) => dispatch(removeCard(index)),
	removeAllCards: () => dispatch(removeAllCards()),
  });

export default connect(mapStateToProps, mapDispatchToProps)(App)
