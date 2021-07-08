package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/ilyakaznacheev/cleanenv"
)



func insertCommodities(bodies chan *mongo.Client) {
	// Wait for the MongoDB client to be passed and then get going
	var client *mongo.Client
	client <- bodies

	// ensure that the collection has the schema, and
	CheckAndInsertCommoditiesV6Schema(client)

	// download and process the collection
	ProcessCommodities(client)
}

func main() {

	fmt.Println("EliteBGS EDDB API Importer " + Eddb_importer_api + " starting up")

	// read the configuration from defaults > config.yml > environment variables into global cfg
	readConfig()

	// Connect to MongoDB
	client := connectMongo()

	startTime := time.Now()

	commodities := make(chan *mongo.Client, 1)
	go insertCommodities(commodities)
	commodities <- client

	// insertCommodities(client)
	// insertFactions(client)
	// insertSystems(client)
	// insertStations(client)
	// insertPopulatedSystems(client)

	<-commodities

	endTime := time.Now()

	fmt.Println("Import completed. Time taken: ", endTime.Sub(startTime))
}
