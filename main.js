// You'll need to sign up for a free Cesium ion account and get an access token.
// Go to: https://cesium.com/ion/signup/
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0OGJiMDU5OS04MjU3LTQzNjQtODNkYi0wMzI3NThhMzFmZjciLCJpZCI6MzQ3MDcwLCJpYXQiOjE3NTk1Njk2MDR9.p5I1Ldzx0wjqv4MybfUvHF41yJhLOxDyNaNRMT9gRg0';

// 1. Initialize the Cesium Viewer in the 'cesiumContainer' div.
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain(), // Add high-resolution world terrain
  animation: false, // Hide the animation widget
  timeline: false, // Hide the timeline widget
  geocoder: true, // Show the geocoder search bar
  homeButton: true, // Show the home button
  sceneModePicker: true, // Show the 2D/3D mode picker
  baseLayerPicker: true, // Show the base layer picker
  navigationHelpButton: false, // Hide the navigation help button
});

// Remove the Cesium ion logo watermark (optional, for aesthetics in this demo)
viewer.cesiumWidget.creditContainer.style.display = 'none';


// 2. Add a 3D Tileset (Example: Photogrammetry data of a real-world location)
// This is a sample dataset provided by Cesium ion.
const tileset = viewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(96188), // New York City 3D Buildings
  })
);


// 3. Fly the camera to the new 3D dataset
async function zoomToTileset() {
  try {
    await tileset.readyPromise; // Wait for the tileset to be loaded
    viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.5, tileset.boundingSphere.radius * 2.0));
    
    // Optional: Adjust camera orientation for a better view
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

  } catch (error) {
    console.error(`Error loading tileset: ${error}`);
  }
}

zoomToTileset();

// 4. Add a Point of Interest (Example: The location of Google)
const googlePlex = viewer.entities.add({
    name: 'Googleplex',
    position: Cesium.Cartesian3.fromDegrees(-122.084, 37.422),
    point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
    },
    label: {
        text: 'Googleplex',
        font: '14pt monospace',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -9),
    },
});