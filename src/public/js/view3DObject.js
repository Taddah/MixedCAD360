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
    const VIEW_ANGLE = 60;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 1000;

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
    camera.lookAt(new THREE.Vector3(0,0,0));
    camera.position.set(-390, 90, -80);

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

    function countVertice(str) {
        const re = /v /g
        return ((str || '').match(re) || []).length
    }

    function countPolygon(str) {
        const re = /f /g
        return ((str || '').match(re) || []).length
    }

    var onError = function() {};
    THREE.Loader.Handlers.add(/\\.dds$/i, new THREE.DDSLoader());

    new THREE.MTLLoader().load(materialPath, function(materials) {
        materials.preload();
        new THREE.OBJLoader().setMaterials(materials).load(objectPath, function(object) {
            object.position.set(0, 0, 0);
            scene.add(object);

            var box = new THREE.Box3().setFromObject(object);
            const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 0);
            let radius = box.getBoundingSphere(sphere).radius;
            let scale = 200/radius;
            object.scale.multiplyScalar(scale);

            getObjectDetails(object, renderer);

        }, onProgress, onError);
    });


    function update() {
        // Draw!
        renderer.render(scene, camera);

        // Schedule the next frame.
        requestAnimationFrame(update);
    }


    function getObjectDetails(object, renderer){

        //Polygon
        //document.getElementById('polygonCount').innerHTML = "" + renderer.info.render.triangles;

        var verticesCount = 0;
        var polygonCount = 0;

        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", objectPath, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    verticesCount = countVertice(allText);
                    polygonCount = countPolygon(allText);
                }
            }
        }
        rawFile.send(null);

        document.getElementById('polygonsCount').innerHTML = polygonCount;
        document.getElementById('verticesCount').innerHTML = verticesCount;

        if(object.materialLibraries.length > 0)
            document.getElementById('material').innerHTML = "Yes";
        else
            document.getElementById('material').innerHTML = "No";

    }

    // Schedule the first frame.
    requestAnimationFrame(update);
}