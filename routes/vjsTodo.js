var express = require('express');
var fs = require('fs');

var app = express();

var path = 'C:\\Users\\Eder\\Documents\\nodejs\\lrnNode\\vjsTodo\\items.txt';
var idPath = 'C:\\Users\\Eder\\Documents\\nodejs\\lrnNode\\vjsTodo\\id.txt';

app.get('/', (req, res) => {
    let file = fs.readFileSync(path) + '';
    let fileArray = file.split('\r\n');
    let newFileArray = [];
    let header = [];
    fileArray.forEach((each, i) => {
        if (i == 0) {
            header = each.split(';');
        }
        if (each !== '' && i >= 1) {
            eachArray = cleanBlank(each.split(';'));
            let newEach = {};
            header.forEach((element, i) => {
                newEach[element] = eachArray[i];
            });
            newFileArray.push(newEach);
        }
    });
    res.json(newFileArray);
});

app.post('/', (req, res) => {
    if (req.body.item !== '') {
        let file = fs.readFileSync(path);
        let id = fs.readFileSync(idPath);
        fs.writeFileSync(idPath, +id + 1);
        fs.writeFileSync(path, file + '\r\n' + id + ';' + req.body.item);
        file = fs.readFileSync(path) + '';
        fileArray = file.split('\r\n');
        res.json(cleanBlank(fileArray));
    }
});

app.delete('/', (req, res) => {
    let file = fs.readFileSync(path) + '';
    let fileArray = file.split('\r\n');
    let newFile = '';
    let header = '';
    let eachArray = [];
    fileArray.forEach((item, i) => {
        if (i == 0) {
            header = item;
        } else {
            eachArray = cleanBlank(item.split(';'));
            let newItem = {
                id: eachArray[0],
                name: eachArray[1]
            }
            if (newItem.id !== req.body.id && item !== '') {
                newFile += item + '\r\n';
            }
        }
    });
    fs.writeFileSync(path, header + '\r\n' + newFile);
    file = fs.readFileSync(path) + '';
    fileArray = file.split('\r\n');
    res.json(cleanBlank(fileArray));
});

function cleanBlank(array) {
    let cleanstring = '';
    array.forEach((item) => {
        if (item !== '') cleanstring += item + '%-%';
    });
    let cleanArray = cleanstring.split('%-%')
    cleanArray.pop();
    return cleanArray;
}

module.exports = app;