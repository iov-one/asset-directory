const fs = require( "fs" );
const path = require( "path" );


let error = false;

const assets = {};
const props = [
   "caip-20",
   "starname-uri",
   "name",
   "symbol",
];

process.chdir( path.join( ".", "assets" ) );
fs.readdirSync( "." ).forEach( file => {
   const json = fs.readFileSync( file, "utf-8" );
   const o = JSON.parse( json );

   props.forEach( prop => {
      if ( !o.hasOwnProperty( prop ) ) {
         error = true;
         console.error( `${file} is missing property '${prop}'.` );
      }
   } );

   const symbol = o.symbol.toLowerCase();

   if ( o["starname-uri"] != `asset:${symbol}` ) {
      error = true;
      console.error( `Invalid uri of '${o["starname-uri"]}' in ${file}; should be 'asset:${symbol}'.` );
   }

   if ( assets[symbol] ) {
      error = true;
      console.error( `Duplicate symbol '${o.symbol}' in ${file}'.` );
   }

   assets[symbol] = true;
} );

process.exit( error ? -1 : 0 );
