const fs = require( "fs" );
const path = require( "path" );
const stringify = require( "json-stable-stringify" );


const prompt = async ( display ) => {
   return new Promise( ( resolve ) => {
      process.stdout.write( display );
      process.stdin.resume();
      process.stdin.once( "data", data => {
         resolve( String( data ).trim() );
      } );
   } );
};


const main = async () => {
   const name = await prompt( `Enter the name of the token: ` ).catch( e => { throw e } );
   const ticker = await prompt( `Enter the symbol (ticker) of the token: ` ).catch( e => { throw e } );
   const symbol = ticker.toLowerCase();
   const asset = {
      "caip-20": "",
      "iov-name-service-uri": `asset:${symbol}`,
      "name": name,
      "symbol": ticker.toUpperCase()
   };

   fs.writeFileSync( path.join( "assets", `${symbol}.json` ), stringify( asset, { space: "  " } ) + "\n" );
}


main().then( () => {
   process.exit( 0 );
} ).catch( e => {
   console.error( e.stack || e.message || e );
   process.exit( -1 );
} );
