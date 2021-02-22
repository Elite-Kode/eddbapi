package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

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

func CsvToJson(path string) string {
	// function CsvToJson(path) {
	//     eventEmmiter.call(this);
	//     let firstData = true;
	//     csvtojson()
	//         .fromStream(fs.createReadStream(path))
	//         .on('json', json => {
	//             if (firstData) {
	//                 firstData = !firstData;
	//                 this.emit('start');
	//             }
	//             this.emit('json', json);
	//         })
	//         .on('done', (error) => {
	//             if (error) {
	//                 this.emit('error', error);
	//             } else {
	//                 this.emit('end');
	//             }
	//         });
	// }
	return "[]"
}

func DownloadUpdate(pathFrom string, filetype string) {
	// function DownloadUpdate(pathFrom, type) {
	//     eventEmmiter.call(this);
	//     if (type === 'jsonl') {
	//         request.get(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true })
	//             .on('response', response => {
	//                 response.statusCode = 200;
	//                 this.emit('start', response);
	//             })
	//             .pipe(ndjson.parse())
	//             .on('data', json => {
	//                 this.emit('json', json);
	//             })
	//             .on('end', () => {
	//                 this.emit('end');
	//             })
	//             .on('error', error => {
	//                 this.emit('error', error);
	//             })
	//     } else if (type === 'json') {
	//         request.get(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true })
	//             .on('response', response => {
	//                 response.statusCode = 200;
	//                 this.emit('start', response);
	//             })
	//             .pipe(jsonStream.parse('*'))
	//             .on('data', json => {
	//                 this.emit('json', json);
	//             })
	//             .on('end', () => {
	//                 this.emit('end');
	//             })
	//             .on('error', error => {
	//                 this.emit('error', error);
	//             })
	//     } else if (type === 'csv') {
	//         csvtojson()
	//             .fromStream(request.get(pathFrom, { headers: { 'Accept-Encoding': 'gzip, deflate, sdch' }, gzip: true })
	//                 .on('response', response => {
	//                     response.statusCode = 200;
	//                     this.emit('start', response);
	//                 }))
	//             .on('json', json => {
	//                 this.emit('json', json);
	//             })
	//             .on('done', (error) => {
	//                 if (error) {
	//                     this.emit('error', error);
	//                 } else {
	//                     this.emit('end');
	//                 }
	//             });
	//     }
	// }
}

func Download(pathFrom string, pathTo string) {
	// function Download(pathFrom, pathTo) {
	//     eventEmmiter.call(this);
	//     let progressPercent = 0.0;
	//     progress(request.get(pathFrom, {headers: {'Accept-Encoding': 'gzip, deflate, sdch'}, gzip: true}))
	//         .on('response', response => {
	//             response.statusCode = 200;
	//             this.emit('start', response);
	//         })
	//         .on('progress', status => {
	//             if (process.env.NODE_ENV === 'development') {
	//                 console.log(`Downloading File of size ${fileSize.withValue(status.size.total)}\nTime Elapsed: ${status.time.elapsed}\t Time Remaining: ${status.time.remaining}\n${(status.percent * 100).toFixed(2)}% completed\t ${fileSize.withValue(status.size.transferred)} data transferred`);
	//             }
	//             progressPercent = status.percent * 100;
	//         })
	//         .on('error', err => {
	//             this.emit('error', {
	//                 error: err,
	//                 progress: progressPercent
	//             });
	//         })
	//         .pipe(fs.createWriteStream(pathTo)
	//             .on('finish', () => {
	//                 this.emit('end');
	//             })
	//             .on('error', err => {
	//                 this.emit('error', {
	//                     error: err,
	//                     progress: progressPercent
	//                 });
	//             }));
	// }
}

func JsonParse(path string) {
	// function JsonParse(path) {
	//     eventEmmiter.call(this);
	//     let firstData = true;
	//     fs.createReadStream(path)
	//         .pipe(jsonStream.parse('*'))
	//         .on('data', json => {
	//             if (firstData) {
	//                 firstData = false;
	//                 this.emit('start');
	//             }
	//             this.emit('json', json);
	//         })
	//         .on('end', () => {
	//             this.emit('end');
	//         })
	//         .on('error', error => {
	//             this.emit('error', error);
	//         });
	// }
}

func JsonlToJson(path string) {
	// function JsonlToJson(path) {
	//     eventEmmiter.call(this);
	//     let firstData = true;
	//     fs.createReadStream(path)
	//         .pipe(ndjson.parse())
	//         .on('data', json => {
	//             if (firstData) {
	//                 firstData = !firstData;
	//                 this.emit('start');
	//             }
	//             this.emit('json', json);
	//         })
	//         .on('end', () => {
	//             this.emit('end');
	//         })
	//         .on('error', error => {
	//             this.emit('error', error);
	//         })
	// }
}
