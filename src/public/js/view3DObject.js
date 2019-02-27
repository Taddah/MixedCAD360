var showObject = function(container, objectPath, materialPath, timestamp) {

    //Set date

    var date = new Date(parseInt(timestamp));
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    document.getElementById('date').innerHTML = month.toString() + '/' + day.toString() + '/' + year.toString();
    // Get the DOM element to attach to
    var controls, light;

    // Set the scene size.
    const WIDTH = container.clientWidth;
    const HEIGHT = container.clientWidth;

    // Set some camera attributes.
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    // Create a WebGL renderer, camera
    // and a scene
    const renderer = new THREE.WebGLRenderer();
    const camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );

    controls = new THREE.OrbitControls(camera, container);
    controls.target.set(0, 100, 0);
    controls.update();

    const scene = new THREE.Scene();

    // Add the camera to the scene.
    scene.add(camera);

    // Start the renderer.
    renderer.setSize(WIDTH, HEIGHT);

    // Attach the renderer-supplied
    // DOM element.
    container.appendChild(renderer.domElement);

    scene.background = new THREE.Color(0xa0a0a0);

    light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 200, 100);
    light.castShadow = true;
    light.shadow.camera.top = 180;
    light.shadow.camera.bottom = -100;
    light.shadow.camera.left = -120;
    light.shadow.camera.right = 120;
    scene.add(light);

    // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

    // ground
    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }

    };

    var onError = function() {};
    THREE.Loader.Handlers.add(/\\.dds$/i, new THREE.DDSLoader());

    new THREE.MTLLoader().load(materialPath, function(materials) {
        materials.preload();
        new THREE.OBJLoader().setMaterials(materials).load(objectPath, function(object) {
            object.position.y = -95;
            object.scale.set(1000, 1000, 1000);
            scene.add(object);
            console.log(object);
        }, onProgress, onError);
    });


    function update() {
        // Draw!
        renderer.render(scene, camera);

        // Schedule the next frame.
        requestAnimationFrame(update);

        //renderer.setSize(container.clientWidth / 2, container.clientWidth / 2);
    }

    // Schedule the first frame.
    requestAnimationFrame(update);
}