package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Player struct {
	Name     string `json:"name"`
	Position int    `json:"position"`

	room *Room
	conn *websocket.Conn
	send chan Message
}

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (p *Player) readPump() {
	defer func() {
		p.room.leave <- p
		_ = p.conn.Close()
	}()
	p.conn.SetReadLimit(maxMessageSize)
	err := p.conn.SetReadDeadline(time.Now().Add(pongWait))
	if err != nil {
		return
	}
	p.conn.SetPongHandler(func(string) error {
		err := p.conn.SetReadDeadline(time.Now().Add(pongWait))
		if err != nil {
			return err
		}
		return nil
	})
	for {
		var message Player
		if err := p.conn.ReadJSON(&message); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			log.Println(err)
		}
		log.Printf("\nReceived message %+v", message)

		newMessage := NewMessage(PositionUpdate, message)
		p.room.broadcast <- newMessage
	}
}

// writePump pumps messages from the room to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (p *Player) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		_ = p.conn.Close()
	}()
	for {
		select {
		case message, ok := <-p.send:
			err := p.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err != nil {
				return
			}
			if !ok {
				// The room closed the channel.
				err := p.conn.WriteMessage(websocket.CloseMessage, []byte{})
				if err != nil {
					return
				}
				return
			}

			if err := p.conn.WriteJSON(message); err != nil {
				log.Println("Error Writing the message")
				return
			}

		case <-ticker.C:
			err := p.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err != nil {
				return
			}

			if err := p.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// serveWs handles websocket requests from the peer.
func serveWs(room *Room, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	player := &Player{
		Name: NamePool[len(room.players)], // Name assigned using NamePool

		room: room,
		conn: conn,
		send: make(chan Message, 256),
	}

	player.room.join <- player

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go player.writePump()
	go player.readPump()
}
