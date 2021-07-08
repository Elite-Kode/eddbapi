package main

import (
	"fmt"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

const configFile = "config.yml"

// ConfigDatabase provides default values, which can be overriden by the configuration file and environment variables
type ConfigDatabase struct {
	Collection string `yaml:"port" env:"PORT" env-default:"eddb"`
	Port       string `yaml:"port" env:"PORT" env-default:"27017"`
	Host       string `yaml:"host" env:"HOST" env-default:"localhost"`
	User       string `yaml:"user" env:"USER" env-default:""`
	Password   string `yaml:"password" env:""`
}

// Cfg is a global variable containing the configuration details
var Cfg ConfigDatabase

// ReadConfig() reads the configuration using the defaults
// The defaults can be overridden in the YAML file config.yml
// or lastly from environment variables
func ReadConfig() {
	fmt.Print("Reading configuration... ")

	err := cleanenv.ReadConfig(configFile, &cfg)
	if err != nil {
		fmt.Println(" could not read the configuration")
		os.Exit(1)
	}

	fmt.Println("ok")
}
