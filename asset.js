const fetch = require( "node-fetch" );
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
   const reSymbol = new RegExp( /[A-Z]/ );
   const fetched = await fetch( "https://raw.githubusercontent.com/trustwallet/wallet-core/master/coins.json" ).catch( e => { throw e } );
   const trust = await fetched.json().catch( e => { throw e } );

   while ( true ) {
      const symbol = await prompt( `Enter the symbol of the token or Ctrl-c to quit: ` ).catch( e => { throw e } );

      if ( !symbol.match( reSymbol ) ) throw new Error( `Symbol should be mostly upper case, not '${symbol}'.` );

      const lowercased = symbol.toLowerCase();
      const file = path.join( "assets", `${lowercased}.json` );
      const trusted = trust.find( coin => coin.symbol == symbol );
      const name = trusted && trusted.name || await prompt( `Enter the name of the token: ` ).catch( e => { throw e } );
      const asset = {
         "caip-20": "",
         "name": name,
         "starname-uri": `asset:${lowercased}`,
         "symbol": symbol,
         "trust-wallet-coinId": trusted ? trusted.coinId : null,
      };

      fs.writeFileSync( file, stringify( asset, { space: "  " } ) + "\n" );
      console.log( `Wrote ${file}.` );
   }
}


main().then( () => {
   process.exit( 0 );
} ).catch( e => {
   console.error( e.stack || e.message || e );
   process.exit( -1 );
} );
