import React from 'react'

import './Header.css'

export default function Header({handleClearAll}) {


	return (
		<>
			<header className='header'>
				<div className='title'>
					<h1>Lista de Tarefas</h1>
				</div>
				<div className='trash'>
					<i className="fa-solid fa-trash" onClick={handleClearAll}></i>
				</div>
			</header>
		</>
	)
}
