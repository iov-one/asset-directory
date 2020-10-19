const fs = require( "fs" );
const encoding = require( "@cosmjs/encoding" );
const path = require( "path" );
const stringify = require( "json-stable-stringify" );

"use strict";


const assets = fs.readdirSync( "assets" ).filter( dir => fs.statSync( path.join( "assets", dir ) ).isDirectory() ).map( dir => {
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

   // replace logo with base64
   try { // dmjp
   const fileLogo = asset.logo || path.join( ".", metadata["trustwallet-info"].replace( "info.json", "logo.png" ) ); // HARD-CODED
   const binary = fs.readFileSync( fileLogo );
   const logo = encoding.toBase64( binary );

   asset.logo = `data:image/png;base64,${logo}`;
   } catch (e ) {}

   return asset;
} );

fs.writeFileSync( "assets.json", stringify( assets.sort( ( a, b ) => a.symbol.localeCompare( b.symbol ) ), { space: "  " } ) + "\n" );
