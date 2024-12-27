package main

type RoomRequest struct {
	MaxPlayers int `json:"max_players"`
}

type PlayerJoined struct {
	PlayerName string `json:"player_name"`
}

type Message struct {
	Type    MessageType `json:"type"`
	Payload any         `json:"payload"`
}

func NewMessage(msgType MessageType, payload any) Message {
	return Message{
		Type:    msgType,
		Payload: payload,
	}
}

type MessageType string

const (
	PositionUpdate MessageType = "Position"
	StatusUpdate   MessageType = "Status"
)

// NamePool : Default names assigned to the players
var NamePool = []string{"Gryffindor", "HufflePuff", "Ravenclaw", "Slytherin"}

// RoomStatus : Status of the Game
type RoomStatus string

const (
	Created    RoomStatus = "created"
	InProgress RoomStatus = "in_progress"
	Finished   RoomStatus = "finished"
)
