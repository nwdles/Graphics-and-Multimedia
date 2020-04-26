/// <reference path="lib/babylon.2.1.d.ts" />

var BjsApp = BjsApp || {};

BjsApp.init = () => {
    //Получаем элемент canvas
    const canvas = document.getElementById('renderCanvas');

    //Генерация движка BABYLON 3D
    const engine = new BABYLON.Engine(canvas, true);

    //Создание сцены
    const scene = new BABYLON.Scene(engine);

    //Добавление камеры и прикрекпление к эл-ту канвас
    const camera = new BABYLON.ArcRotateCamera(
        'camera',
        0,
        1.2,
        15,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(canvas);

    camera.upperRadiusLimit = 50;

    //Добавление света
    const light = new BABYLON.HemisphericLight(
        'light1',
        new BABYLON.Vector3(0, 1, 0),
        scene
    );
    light.intensity = 0.5;
    light.groundColor = new BABYLON.Color3(0, 0, 1);

    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    //Создание 3D объекта из импортируемой модели
    BABYLON.SceneLoader.ImportMesh("","./assets/models/","star-wars-vader-tie-fighter.babylon", scene, function (meshes) {
        scene.createDefaultCameraOrLight(true, true, true);
        meshes.forEach(function(mesh) {
            mesh.position.x = 5;
            mesh.position.y = 1;
            //mesh.scaling = new BABYLON.Vector3(0.03,0.03,0.03);

            mesh.orbit = {
                radius: mesh.position.z,
                speed: -0.025,
                angle: 0
            };
            
        });

        //Добавление анимации
        scene.getMeshByName("group").rotationQuaternion = null;  
        scene.registerBeforeRender(function () {
            const object = scene.getMeshByName("group");
            object.rotation.y += 0.005;

            object.position.x = object.orbit.radius * Math.sin(object.orbit.angle);
            object.position.z = object.orbit.radius * Math.cos(object.orbit.angle);
            object.orbit.angle += object.orbit.speed;
        });
        
    });

    //Создание объекта "солнце"
    const sun = BABYLON.Mesh.CreateSphere('sun', 16, 4, scene);
    //Добавление материала/текстуры к объекту
    const sunMaterial = new BABYLON.StandardMaterial('sunMaterial', scene);
    sunMaterial.emissiveTexture = new BABYLON.Texture(
        'assets/images/sun.jpg',
        scene
    );
    sunMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    sunMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    sun.material = sunMaterial;

    //Добавление света для реалистичности представления солнца
    const sunLight = new BABYLON.PointLight(
        'sunLight',
        BABYLON.Vector3.Zero(),
        scene
    );
    sunLight.intensity = 2;

    //Создание планет
    const planetMaterial = new BABYLON.StandardMaterial('planetMat', scene);
    //Установка текстуры
    planetMaterial.diffuseTexture = new BABYLON.Texture(
        'assets/images/sand.jpg',
        scene
    );
    planetMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    //Создание планет с помощью объекта BABYLON сферы
    const planet1 = BABYLON.Mesh.CreateSphere('planet1', 16, 1, scene);
    //Изменение стартовой позиции и начальных параметров
    planet1.position.x = 4;
    planet1.material = planetMaterial;
    planet1.orbit = {
        radius: planet1.position.x,
        speed: 0.01,
        angle: 0
    };

    const planet2 = BABYLON.Mesh.CreateSphere('planet2', 16, 1, scene);
    planet2.position.x = 6;
    planet2.material = planetMaterial;
    planet2.orbit = {
        radius: planet2.position.x,
        speed: -0.01,
        angle: 0
    };

    const planet3 = BABYLON.Mesh.CreateSphere('planet3', 16, 1, scene);
    planet3.position.x = 8;
    planet3.material = planetMaterial;
    planet3.orbit = {
        radius: planet3.position.x,
        speed: 0.02,
        angle: 0.2
    };

    //Создание "коробки" космоса
    const skybox = BABYLON.Mesh.CreateBox('skybox', 1000, scene);
    const skyboxMaterial = new BABYLON.StandardMaterial('skyboxMat', scene);

    //dont render what we cant see
    skyboxMaterial.backFaceCulling = false;

    //Движение "коробки" вместе с камерой
    skybox.infiniteDistance = true;

    skybox.material = skyboxMaterial;

    //Удаление рефлексии для того, чтобы свет не отражался на поверхности "космоса"
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

    //Установка текстуры
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
        'assets/images/space',
        scene
    );
    skyboxMaterial.reflectionTexture.coordinatesMode =
        BABYLON.Texture.SKYBOX_MODE;

    //Устанавливаем параметры анимации перед каждым рендерингом
    scene.beforeRender = () => {
        
        //Вращение вокруг своей оси
        sun.rotation.y += 0.005;

        //Передвижение по орбитам
        planet1.position.x = planet1.orbit.radius * Math.sin(planet1.orbit.angle);
        planet1.position.z = planet1.orbit.radius * Math.cos(planet1.orbit.angle);
        planet1.orbit.angle += planet1.orbit.speed;

        planet2.position.x = planet2.orbit.radius * Math.sin(planet2.orbit.angle);
        planet2.position.z = planet2.orbit.radius * Math.cos(planet2.orbit.angle);
        planet2.orbit.angle += planet2.orbit.speed;

        planet3.position.x = planet3.orbit.radius * Math.sin(planet3.orbit.angle);
        planet3.position.z = planet3.orbit.radius * Math.cos(planet3.orbit.angle);
        planet3.orbit.angle += planet3.orbit.speed;
    };

    //Зацкиливание рендеринга
    engine.runRenderLoop(() => {
        scene.render();
    });

    //При изменении размера в браузере происходит изменение размера внутри канваса
    window.addEventListener('resize',  () => {
        engine.resize();
    });
};
