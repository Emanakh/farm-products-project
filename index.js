const fs = require('fs'); //it was not me - auto from the program
//create servers with http module
const http = require("http");
//for routing
const url = require('url');

//string.replace method(search,new )
const replaceTemplate = (temp, product) => {
    //using regular exprressions
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) {
        //if this not organic we will put the class not organic
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }
    return output;


}


//we will read the templates first sync
const tempOverview = fs.readFileSync(`${__dirname}/templates/templateoverview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/templatecard.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    //destructure 
    const  {query , pathname } = url.parse(req.url, true)
//    console.log(req.url)
//    console.log(url.parse(req.url, true))
    // const pathName = req.url;

    //overview page
    if (pathname === '/' || pathname === '/overview') {

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.writeHead(200, { 'Content-Type': 'text/html' })
        //instead of send the tempOverview we send the output after we replace the product cards
        res.end(output);

        //product page
    } else if (pathname === '/product') {
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product)
        res.end(output);

        //api
    } else if (pathname === '/api') {
        res.writeHead(200, { 'content-Type': 'application/json' });
        res.end(data)

        //not found

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html', 'my-own-header': 'i am perfect' })
        res.end('<h1>page Not found<h1/>')
    }
})
server.listen(8000, '127.0.0.1', () => {
    console.log('listen on port 8000')
});

