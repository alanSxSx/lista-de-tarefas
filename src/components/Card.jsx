import React, { useState } from 'react'
import './Card.css'

export default function Card({name,time,check,handleChecked,handleTrash}) {

	function handleCheck() {
		handleChecked();
	}

	return (
		<div className={`card ${check ? 'checked' : ''}`}>
		<input name="checkbox "type="checkbox" onChange={handleCheck} checked={check}></input>
		<strong className={check ? 'strikethrough' : ''} >{name}</strong>
		<small className={check ? 'strikethrough' : ''}>{time}</small>
		<i className="fa-solid fa-trash" onClick={handleTrash}></i>
		</div>
	)
}
