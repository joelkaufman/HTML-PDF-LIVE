
const fs = require('fs');
const http = require('http');
const { watch } = require('gulp');
const browserSync = require('browser-sync');

function readFile(fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName, 'utf8', function (error, data) {
        if (error) return reject(error)
        resolve(data);
      })
    });
  }


async function render(){
    let html;
    let css;
    await Promise.all([
        readFile("./src/page.html").then(d=>html=d),
        readFile("./src/page.css").then(d=>css=d),
    ]);

    var options = {
        method: 'POST',
        host: 'localhost',
        port: 8080,
        path: '/service/convert/html/body',
        headers: {
            'Content-Type': "application/json"
          }
      };

    return new Promise((resolve, reject) => {
        var request = http.request(options, function(response) { 
            var data = []; 
        
            response.on('data', function(chunk) { 
                data.push(chunk); 
            }); 
        
            response.on('end', function() { 
                data = Buffer.concat(data); // do something with data 


                // write to a new file named 2pac.txt
                fs.writeFile('src/file.pdf', data, (err) => {
                    // throws an error, you could also catch it here
                    if (err) reject(err);

                    // success case, the file was saved
                    console.log('PDF saved!');
                    resolve();
                });
            }); 
        }); 
        request.write(JSON.stringify({
            html:html,
            css:css
        }));
        
        request.end();
    });
    
}


async function main(){
    
    const { exec } = require('child_process');
    exec('docker run --rm -p 8080:8080 farrukhmpk/html-pdf-service', (err, stdout, stderr) => {
        if (err) {
            //some err occurred
            console.error(err)
        } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        }
    });
    watch(['src/*', '!src/file.pdf'], async function(cb) {
        console.log('changed');
        await render();
        cb();
        browserSync.reload();
    });

    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
}
main();


