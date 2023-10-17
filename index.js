const fs = require('fs'); //it was not me - auto from the program
//create servers with http module
const http = require('http');
//for routing
const url = require('url');
//from npm
const slugify = require('slugify');

//my own modules - import it
const replaceTemplate = require('./modules/replacetemplate');

//we will read the templates first sync
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/templateoverview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/templatecard.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//using slugify module
dataObj.map((el) => {
  el['slug'] = slugify(el.productName, {
    lower: true,
  });
});

const server = http.createServer((req, res) => {
  //destructure
  const { query, pathname } = url.parse(req.url, true);
  //    console.log(req.url)
  //    console.log(url.parse(req.url, true))
  // const pathName = req.url;

  //overview page
  if (pathname === '/' || pathname === '/overview') {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    //instead of send the tempOverview we send the output after we replace the product cards
    res.end(output);

    //product page
  } else if (pathname.includes('/product')) {
    const slug = pathname.replace('/product/', '');
    const product = dataObj.filter((element) => {
      return element.slug === slug;
    })[0];
    // const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //api
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'content-Type': 'application/json',
    });
    res.end(data);

    //not found
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'i am perfect',
    });
    res.end('<h1>page Not found<h1/>');
  }
});
server.listen(8000, '127.0.0.1', () => {
  console.log('listen on port 8000');
});
