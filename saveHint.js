const fs = require('fs');
const http = require("http");
const nunjucks = require("nunjucks");
// const express = require("express");

// const app = express();



function saveHint(req, res) {
        if(req.url.startsWith("/saveHint.js")) {
            const query = new URL(req.url, `http://${req.headers.host}`).searchParams;
            console.log(query);
            console.log(req.url);

            const hintType = query.get('hintType');
            console.log(hintType +"hereeee ");
            let readName;
            let readHint;

            //getting the hintType from query & load  hint.json file using the hintType to serch the hint corresponding to the game we got
            //also - change the json file so that it contains all the hints togetherrrrrr!!!!!!

            fs.readFile("./minigames/cardflip/data/hints.json", "utf-8", (err, data) => {
                
                    if (err) { 
                                res.end('Error loading messages.');
                                    return;
                    }

                    //changing the format of the json file to facilitate writing of the hind, so change the reading to!!!!!!
                        console.log("reading json file");
                        const allHints = JSON.parse(data);
                        console.log(allHints);
                        const theHint = allHints.find(m => m.name === hintType)

                        if(theHint){
                            name = theHint.name;
                            hint = theHint.hint;
                            console.log(name + " Name of the hint");
                            console.log(hint + " Hint");
                        }else{
                            res.end("Hint not found");
                            return;
                        }

                fs.readFile("./inventory/inventory.json", "utf-8", (err, data) => {
                    let inventory =[];
                        inventory = JSON.parse(data);
                        inventory.push({
                            name,
                            hint
                        });

                        fs.writeFile("./inventory/inventory.json",JSON.stringify(inventory),(err)=>{
                                if(err){
                                    res.end("Error while saving hint");
                                    return;
                                }
                                res.end(); 

                        });
                });
            });

  }
  console.log(req.url);

}
module.exports = saveHint; 