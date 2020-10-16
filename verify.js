const fs = require( "fs" );
const path = require( "path" );


let error = false;

const assets = {};
const propsAsset = [
   "caip-19",
   "symbol",
   "trustwallet-uid",
];
const propsMetadata = [
   "starname-uri",
   "trustwallet-info",
];

process.chdir( path.join( ".", "assets" ) );
fs.readdirSync( "." ).filter( dir => fs.statSync( dir ).isDirectory() ).forEach( dir => {
   const fileAsset = path.join( dir, "asset.json" ); // HARD-CODED
   const fileMetadata = path.join( dir, "metadata", "info.json" ); // HARD-CODED
   const jsonAsset = fs.readFileSync( fileAsset, "utf-8" );
   const jsonMetadata = fs.readFileSync( fileMetadata, "utf-8" );

   try {
      const asset = JSON.parse( jsonAsset );
      const metadata = JSON.parse( jsonMetadata );

      // check properties
      propsAsset.forEach( prop => {
         if ( !asset.hasOwnProperty( prop ) ) {
            error = true;
            console.error( `${fileAsset} is missing property '${prop}'.` );
         }
      } );
      propsMetadata.forEach( prop => {
         if ( !metadata.hasOwnProperty( prop ) ) {
            error = true;
            console.error( `${fileMetadata} is missing property '${prop}'.` );
         }
      } );

      // check symbol
      const symbol = asset.symbol.toLowerCase();

      if ( symbol != dir ) {
         error = true;
         console.error( `Invalid directory or symbol for ${fileAsset}.` );
      }

      if ( assets[symbol] ) {
         error = true;
         console.error( `Duplicate symbol '${asset.symbol}' in ${fileAsset}'.` );
      }

      // check congruency
      if ( metadata["starname-uri"] != `asset:${symbol}` ) { // HARD-CODED
         error = true;
         console.error( `Invalid uri of '${metadata["starname-uri"]}' in ${fileMetadata}; should be 'asset:${symbol}'.` );
      }

      // add to assets
      assets[symbol] = true;
   } catch ( e ) {
      console.error( fileAsset, fileMetadata, e.message );
   }
} );

process.exit( error ? -1 : 0 );
