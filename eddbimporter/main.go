package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"github.com/ilyakaznacheev/cleanenv"
)

const configFile = "config.yml"

// ConfigDatabase provides default values, which can be overriden by the configuration file and environment variables
type ConfigDatabase struct {
	Port     string `yaml:"port" env:"PORT" env-default:"27017"`
	Host     string `yaml:"host" env:"HOST" env-default:"localhost"`
	User     string `yaml:"user" env:"USER" env-default:""`
	Password string `yaml:"password" env:""`
}

// type EDDN struct {
// 	SchemaRef string          `json:"$schemaRef"`
// 	Header    EDDNHeader      `json:"header"`
// 	Message   json.RawMessage `json:"message"`
// }
// type EDDNHeader struct {
// 	UploaderID       string    `json:"uploaderID"`
// 	SoftwareName     string    `json:"softwareName"`
// 	SoftwareVersion  string    `json:"softwareVersion"`
// 	GatewayTimestamp time.Time `json:"gatewayTimestamp"`
// }

// Here be globals (well, singletons)
var cfg ConfigDatabase
var eddnTimer time.Time

const version = "0.0.1"

func readConfig() {
	fmt.Print("Reading configuration... ")

	err := cleanenv.ReadConfig(configFile, &cfg)
	if err != nil {
		fmt.Println(" could not read the configuration")
		os.Exit(1)
	}

	fmt.Println("ok")
}

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

func getJSON(url string, target interface{}) error {
	httpClient := &http.Client{Timeout: 10 * time.Second}

	res, err := httpClient.Get(url)
	if err != nil {
		fmt.Println("Cannot obtain data from ", url)
		os.Exit(1)
	}
	defer res.Body.Close()

	return json.NewDecoder(res.Body).Decode(target)
}

// // Returns true if Elite Launcher is up, false if not
// // If Elite Launcher is not okay, EDDN will be silent
// func getEliteLauncherStatus() (eliteUp bool) {

// 	fmt.Print("Checking Elite Dangerous status at " + cfg.LauncherStatusURL + "... ")

// 	eliteLauncher := eliteLauncherStatus{}

// 	getJSON(cfg.LauncherStatusURL, &eliteLauncher)

// 	if eliteLauncher.Status == 2 && eliteLauncher.Text == "OK" {
// 		fmt.Println("ok")
// 		return true
// 	}

// 	fmt.Println("Elite is down, exiting")
// 	return false
// }

func insertCommodities(bodies chan *mongo.Client) {
	// Wait for the MongoDB client to be passed and then get going
	var client *mongo.Client
	client <- bodies

	// Open a stream from
}

func main() {

	fmt.Println("EliteBGS EDDB API Importer " + version + " starting up")

	// read the configuration from defaults > config.yml > environment variables into global cfg
	readConfig()

	// Connect to MongoDB
	client := connectMongo()

	startTime := time.Now()

	// bodies := make(chan *mongo.Client, 1)
	// go insertBodies(bodies)
	// bodies <- client

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
