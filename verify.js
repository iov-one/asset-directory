const fs = require( "fs" );
const path = require( "path" );


let error = false;
const props = [
   "caip-20",
   "iov-name-service-uri",
   "name",
   "symbol",
];

process.chdir( path.join( "..", "assets" ) );
fs.readdirSync( "." ).forEach( file => {
   const json = fs.readFileSync( file, "utf-8" );
   const o = JSON.parse( json );

   props.forEach( prop => {
      if ( !o.hasOwnProperty( prop ) ) {
         error = true;
         console.error( `${file} is missing property '${prop}'.` );
      }
   } );

   if ( o["iov-name-service-uri"] != `asset:${o.symbol.toLowerCase()}` ) {
      error = true;
      console.error( `Invalid uri of '${o["iov-name-service-uri"]}'; should be 'asset:${o.symbol.toLowerCase()}'.` );
   }
} );

process.exit( error ? -1 : 0 );
