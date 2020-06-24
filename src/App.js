import React, { useState } from 'react';
import './App.css';

function App() {

  const [state, setState] = useState(null)
  const [participants, setParticipants] = useState([])
  const [svg, setSvg] = useState(null)
  const [reloads, setReloads] = useState(0)
  const [matches, setMatches] = useState(null)

  function handleChange(event) {
    event.persist()
    setState((latestState) => ({
      ...latestState,
      [event.target.name]: event.target.value,
    }))

  }
  function createTournament(event) {
    event.preventDefault()
    fetch('http://localhost:3001/createTournament', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state) })
      .then(response => response.json())
      .then(data => {
        setState((latestState) => ({
          ...latestState,
          id: data.id
        }))
      });
  }
  function handleAddParticipant(event) {
    event.preventDefault()
    setParticipants(participants => [...participants, { name: state.partName, seed: state.seed }])
  }

  function handleAddParticipants(e) {
    console.log(participants, state)
    let body = {
      tournamentId: state?.id,
      participants: participants
    }

    fetch('http://localhost:3001/bulkAddParticipants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
  }

  async function handleRefresh(e) {
    setReloads((prevValue) => prevValue + 1)
    let res = await fetch(`http://localhost:3001/showTournament?id=${state.id}`)
    let svgUrl = await res.json()
    // let svg = await fetch(svgUrl.link)
    // let final = await svg.text()
    console.log(svgUrl.link)
    setSvg(svgUrl.link)
    // console.log(final)
    //dodaj u DOM svg, makni visak
  }

  async function handleStartTournament(e) {
    let body = {
      tournamentId: state.id
    }
    let res = await fetch(`http://localhost:3001/startTournament`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    let tourRes = await res.json()
    setMatches(tourRes.tournament.matches)
  }

  async function handleDeclareWin(event){
    event.preventDefault()
    let body = {
      tournamentId: state.id,
      matchId: state.matchId,
      winnerId: state.winnerId,
      score: state.score
    }
    let res = await fetch(`http://localhost:3001/declareWinner`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    let tourRes = await res.json()
    
  }

  return (
    <div className="App">
      <div style={{ backgroundColor: "white", position: "relative" }}>
        <form onSubmit={e => createTournament(e)}>
          <label>Event id:</label>
          <input onChange={e => handleChange(e)} type="text" name="event_id"></input><br></br>
          <label >Vlasink id:</label>
          <input onChange={e => handleChange(e)} type="text" name="owner_id"></input><br></br>
          <label >Ime turnira:</label>
          <input onChange={e => handleChange(e)} type="text" name="name"></input><br></br>
          <label >Tip turnira:</label>
          <input onChange={e => handleChange(e)} type="text" name="tournament_type"></input><br></br>
          <label >Treće mjesto:</label>
          <input onChange={e => handleChange(e)} type="text" name="hold_third_place_match"></input><br></br>
          <label >Max igraca:</label>
          <input onChange={e => handleChange(e)} type="text" name="signup_cap"></input><br></br>
          <input type="submit" value="Submit"></input>
        </form>
        <p>{state ? state.id : null}</p>

        <form onSubmit={e => handleAddParticipant(e)}>
          <label>Ime:</label>
          <input onChange={e => handleChange(e)} type="text" name="partName"></input><br></br>
          <label>Seed:</label>
          <input onChange={e => handleChange(e)} type="text" name="seed"></input><br></br>
          <input type="submit" value="Submit"></input>
        </form>

        {
        participants ?
        participants.map((participant, i) => <p key={i}> {participant.name}: {participant.seed} </p>)
        :
        null
        }

        <button onClick={e => handleAddParticipants(e)}> Dodaj sve</button>
        <button onClick={e => handleRefresh(e)}> Refresh</button>
        <button onClick={e => handleStartTournament(e)}> Start tournament </button>

      </div>
      <div style={{ marginTop: "-54px" }}>
        <img src={`${svg}?r=${reloads}`}></img>
      </div>
<div style={{ marginTop: "54px" }}>
      {
      matches ?
      matches.map((match, i) => <div key={i}> id:{match.match.id} p1:{match.match.player1_id} p2:{match.match.player2_id} order: {match.match.suggested_play_order} </div>)
      :
      null
    }
    <form onSubmit={ e => handleDeclareWin(e)}>
      <label>match id</label>
      <input onChange={e => handleChange(e)} type="text" name="matchId"></input><br></br>
      <label>winner id</label>
      <input onChange={e => handleChange(e)} type="text" name="winnerId"></input><br></br>
      <label>score</label>
      <input onChange={e => handleChange(e)} type="text" name="score"></input><br></br>
      <input type="submit" value="Declare"></input>
    </form>
</div>
    </div>
  );
}

export default App;
