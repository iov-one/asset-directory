const fs = require( "fs" );
const path = require( "path" );
const stringify = require( "json-stable-stringify" );

"use strict";

const assets = [];

fs.readdirSync( "assets" ).filter( dir => fs.statSync( path.join( "assets", dir ) ).isDirectory() ).forEach( dir => {
   const fileAsset = path.join( "assets", dir, "asset.json" ); // HARD-CODED
   const fileMetadata = path.join( "assets", dir, "metadata", "info.json" ); // HARD-CODED
   const jsonAsset = fs.readFileSync( fileAsset, "utf-8" );
   const jsonMetadata = fs.readFileSync( fileMetadata, "utf-8" );
   const asset = JSON.parse( jsonAsset );
   const metadata = JSON.parse( jsonMetadata );

   Object.keys( metadata ).forEach( key => asset[key] = metadata[key] );

   // possibly inject name
   if ( !asset.name ) {
      const fileInfo = path.join( ".", ...metadata["trustwallet-info"].split( "/" ) );
      const jsonInfo = fs.readFileSync( fileInfo );
      const info = JSON.parse( jsonInfo );

      if ( !info.name ) {
         error = true;
         console.error( `${fileInfo} is missing property 'name'!` );
      }

      asset.name = info.name;
   }

   // possibly inject logo
   if ( !asset.logo && metadata["trustwallet-info"] ) asset.logo = metadata["trustwallet-info"].replace( "info.json", "logo.png" ); // HARD-CODED

   assets.push( asset );
} );

fs.writeFileSync( "assets.json", stringify( assets.sort( ( a, b ) => a.symbol.localeCompare( b.symbol ) ), { space: "  " } ) + "\n" );
