package main

import (
	"fmt"

	"github.com/google/uuid"
)

type Room struct {
	ID        string     `json:"-"`
	Status    RoomStatus `json:"status"`
	Paragraph string     `json:"paragraph"`
	Winner    string     `json:"winner"`

	players    map[*Player]bool
	maxPlayers int

	broadcast chan Message
	join      chan *Player
	leave     chan *Player
}

func NewRoom(maxPlayers int) *Room {
	return &Room{
		ID:        uuid.NewString()[:6],
		Status:    Created,
		Paragraph: "What even is Life? Isn't it just a tiny phenomena in this massive universe. If that were true(which I certainly believe it is), can't everything we think of or do be predicted? Think about it. If there was a certain computer which enough storage to have all the information of existence and could compute everything, won't it be able to predict everything that is about to happend from this point on?",

		players:    make(map[*Player]bool, maxPlayers),
		maxPlayers: maxPlayers,

		broadcast: make(chan Message),
		join:      make(chan *Player),
		leave:     make(chan *Player),
	}
}

func (r *Room) run() {
	for {
		select {
		case p := <-r.join:
			r.players[p] = true

			newPlayer := NewMessage(PositionUpdate, p)
			broadcastMessage(r, newPlayer) // Broadcast newPlayer details to all

			roomDetails := NewMessage(StatusUpdate, r)
			p.send <- roomDetails // Send room details to the new player

			if len(r.players) == r.maxPlayers {
				fmt.Printf("\nMax players reached: %d. Starting Game...: ", len(r.players))

				r.Status = InProgress
				newMessage := NewMessage(StatusUpdate, r)

				broadcastMessage(r, newMessage)
			}

		case p := <-r.leave:
			delete(r.players, p)
			close(p.send)

		case message := <-r.broadcast:
			// Announce the winner if anyone finishes typing the paragraph
			if player, ok := message.Payload.(Player); ok && player.Position == len(r.Paragraph)-1 && r.Winner == "" {
				r.Winner = player.Name
				r.Status = Finished
				newMessage := NewMessage(StatusUpdate, r)
				message = newMessage
			}

			broadcastMessage(r, message)
		}
	}
}

// broadcastMessage sends the message to each player's send channel
func broadcastMessage(r *Room, message Message) {
	for p := range r.players {
		select {
		case p.send <- message:
		default:
			close(p.send)
			delete(r.players, p)
		}
	}
}
