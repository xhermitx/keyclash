package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
)

type GameServer struct {
	rooms sync.Map
}

func NewGameServer() *GameServer {
	return &GameServer{
		rooms: sync.Map{},
	}
}

func (gs *GameServer) CreateGame(w http.ResponseWriter, r *http.Request) {
	room := NewRoom(uuid.NewString()[:6])
	gs.rooms.Store(room.ID, room)

	go room.run()

	_, err := w.Write([]byte(fmt.Sprint("New game created:", room.ID)))
	if err != nil {
		log.Println(err)
	}
}

func (gs *GameServer) GameServer(w http.ResponseWriter, r *http.Request) {
	roomId := mux.Vars(r)["room_id"]

	room, exists := gs.rooms.Load(roomId)
	if !exists {
		http.Error(w, "Room does not exist", http.StatusNotFound)
		return
	}

	if len(room.(*Room).players) > 4 {
		http.Error(w, "Too many players", http.StatusTooManyRequests)
		return
	}
	log.Println("Someone joined the game:", roomId)
	serveWs(room.(*Room), w, r)
}
