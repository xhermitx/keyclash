package main

import (
	"fmt"
	"log"
)

type Room struct {
	ID        string     `json:"id"`
	Status    RoomStatus `json:"status"`
	Paragraph string     `json:"paragraph"`
	Winner    string     `json:"winner"`

	players map[*Player]bool

	broadcast    chan any
	join         chan *Player
	leave        chan *Player
	statusUpdate chan RoomStatus
}

func NewRoom(id string) *Room {
	return &Room{
		ID:        id,
		Status:    Created,
		Paragraph: "This is a Test Paragraph",

		players:   make(map[*Player]bool),
		broadcast: make(chan any),
		join:      make(chan *Player),
		leave:     make(chan *Player),
	}
}

func (r *Room) run() {
	for {
		select {
		case p := <-r.join:
			r.players[p] = true
			p.send <- r // Send room details when a new player joins

		case p := <-r.leave:
			delete(r.players, p)
			close(p.send)

		case r.Status = <-r.statusUpdate:
			r.broadcast <- r

		case message := <-r.broadcast:
			// Announce the winner if anyone finishes typing the paragraph
			if message.(Message).Position == len(r.Paragraph)-1 && r.Winner == "" {
				r.Winner = message.(Message).Name
				message = r
			}

			fmt.Println(message)

			for p := range r.players {
				select {
				case p.send <- message:
					log.Println("Broadcasting message to the rest of the players")
				default:
					close(p.send)
					delete(r.players, p)
				}
			}
		}
	}
}
