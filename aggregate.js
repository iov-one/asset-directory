const fs = require( "fs" );
const path = require( "path" );
const stringify = require( "json-stable-stringify" );


const assets = [];

fs.readdirSync( "assets" ).forEach( file => {
   const json = fs.readFileSync( path.join( "assets", file ), "utf-8" );
   const o = JSON.parse( json );

   assets.push( o );
} );

fs.writeFileSync( "assets.json", stringify( assets.sort( ( a, b ) => a.symbol.localeCompare( b.symbol ) ), { space: "  " } ) + "\n" );
