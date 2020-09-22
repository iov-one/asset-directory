const fs = require( "fs" );
const path = require( "path" );
const stringify = require( "json-stable-stringify" );


process.chdir( path.join( ".", "assets" ) );
fs.readdirSync( "." ).forEach( file => {
   const json = fs.readFileSync( file, "utf-8" );
   const o = JSON.parse( json );

   fs.writeFileSync( file, stringify( o, { space: "  " } ) );
} );
