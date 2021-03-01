package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// DbClient singleton representing the database connection
// Go routines will need to clone this to make their own independant connection to the database
var DbClient *mongo.Client

// Connect to Mongo DB
func connectMongo() bool {

	fmt.Print("Connecting to MongoDB... ")
	connStr := "mongodb://" + cfg.User + ":" + cfg.Password + "@" + cfg.Host + ":" + cfg.Port
	DbClient, err := mongo.NewClient(options.Client().ApplyURI(connStr))
	if err != nil {
		fmt.Print(" could not create MongoDB client")
		os.Exit(1)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	err = DbClient.Connect(ctx)
	if err != nil {
		fmt.Print(" could not connect to database")
		os.Exit(1)
	}

	fmt.Println("ok")

	return true
}
