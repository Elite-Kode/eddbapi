package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Connect to Mongo DB
func connectMongo() *mongo.Client {

	fmt.Print("Connecting to MongoDB... ")
	connStr := "mongodb://" + cfg.User + ":" + cfg.Password + "@" + cfg.Host + ":" + cfg.Port
	client, err := mongo.NewClient(options.Client().ApplyURI(connStr))
	if err != nil {
		fmt.Print(" could not create MongoDB client")
		os.Exit(1)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		fmt.Print(" could not connect to database")
		os.Exit(1)
	}

	fmt.Println("ok")
	return client
}
