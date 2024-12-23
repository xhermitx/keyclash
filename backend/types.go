package main

type Message struct {
	Type     MessageType `json:"type"`
	Name     string      `json:"name"`
	Position int         `json:"position"`
	Status   RoomStatus  `json:"status"`
}

type MessageType string

const (
	PositionBroadcast MessageType = "position"
	StatusBroadcast   MessageType = "status"
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
