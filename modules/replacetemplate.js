
//exports this anonynous func
//string.replace method(search,new )
module.exports =  (temp, product) => {
    //using regular exprressions
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%VITAMINE%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%SLUG%}/g, product.slug);

    if (!product.organic) {
        //if this not organic we will put the class not organic
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    }
    return output;


}

