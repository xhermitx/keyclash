package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

var addr = flag.String("addr", ":8080", "http service address")

func main() {
	flag.Parse()

	r := mux.NewRouter()

	r = r.PathPrefix("/game").Subrouter().StrictSlash(true)

	gs := NewGameServer()

	r.HandleFunc("/create", gs.CreateGame)
	r.HandleFunc("/ws/{room_id}", gs.GameServer)

	log.Fatal(http.ListenAndServe(*addr, r))
}
