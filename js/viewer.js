import {
    Viewer, XKTLoaderPlugin, WebIFCLoaderPlugin, CityJSONLoaderPlugin,
    GLTFLoaderPlugin, LASLoaderPlugin, OBJLoaderPlugin, XML3DLoaderPlugin
} from './node_modules/@xeokit/xeokit-sdk/dist/xeokit-sdk.min.es.js'
import * as WebIFC from './node_modules/web-ifc/web-ifc-api.js';

window.addEventListener('load', (ev) => {
    const CANVAS_ID = "exokit-widget-attachment-point";
    let el_overlay = null;
    let o_viewer = null;

    const setup_viewer = (url, m_type) => {
        const xeokit_installed_at = '/' + drupalSettings.xeokit_viewer.base_path + "/js/node_modules/@xeokit/xeokit-sdk/";
        o_viewer = new Viewer({
            canvasId: CANVAS_ID,
            transparent: true
        });

        let camera_eye_x = -3.933;
        let camera_eye_y = 2.855;
        let camera_eye_z = 27.018;
        if (drupalSettings.xeokit_viewer.hasOwnProperty('position_x'))
            camera_eye_x = drupalSettings.xeokit_viewer.position_x;
        if (drupalSettings.xeokit_viewer.hasOwnProperty('position_y'))
            camera_eye_y = drupalSettings.xeokit_viewer.position_y;
        if (drupalSettings.xeokit_viewer.hasOwnProperty('position_z'))
            camera_eye_z = drupalSettings.xeokit_viewer.position_z;
        o_viewer.camera.eye = [camera_eye_x, camera_eye_y, camera_eye_z];

        let camera_look_x = 4.400;
        let camera_look_y = 3.724;
        let camera_look_z = 8.899;
        if (drupalSettings.xeokit_viewer.hasOwnProperty('look_x'))
            camera_look_x = drupalSettings.xeokit_viewer.look_x;
        if (drupalSettings.xeokit_viewer.hasOwnProperty('look_y'))
            camera_look_y = drupalSettings.xeokit_viewer.look_y;
        if (drupalSettings.xeokit_viewer.hasOwnProperty('look_z'))
            camera_look_z = drupalSettings.xeokit_viewer.look_z;
        o_viewer.camera.look = [camera_look_x, camera_look_y, camera_look_z];

        let camera_up_x = -0.018;
        let camera_up_y = 0.999;
        let camera_up_z = 0.039;
        if (drupalSettings.xeokit_viewer.hasOwnProperty('up_x'))
            camera_up_x = drupalSettings.xeokit_viewer.up_x;
        if (drupalSettings.xeokit_viewer.hasOwnProperty('up_y'))
            camera_up_y = drupalSettings.xeokit_viewer.up_y;
        if (drupalSettings.xeokit_viewer.hasOwnProperty('up_z'))
            camera_up_z = drupalSettings.xeokit_viewer.up_z;
        o_viewer.camera.up = [camera_up_x, camera_up_y, camera_up_z];

        let modelLoader = null;

        let edges = false;
            if (drupalSettings.xeokit_viewer.edges > 0) edges = true;

        if (m_type == 'ifc' || m_type == 'ifc4') {
            const IfcAPI = new WebIFC.IfcAPI();
            IfcAPI.SetWasmPath('/' + drupalSettings.xeokit_viewer.base_path + "/js/node_modules/web-ifc/");
            IfcAPI.Init().then(() => {
                modelLoader = new WebIFCLoaderPlugin(o_viewer, {
                    WebIFC,
                    IfcAPI
                });
                modelLoader.load({
                    id: 'CurrentModel',
                    src: url,
                    edges: edges
                });
            });
        }
        else {
            if (m_type == 'xkt') {
                modelLoader = new XKTLoaderPlugin(o_viewer);
            }
            else if (m_type == 'cityjson') {
                modelLoader = new CityJSONLoaderPlugin(o_viewer);
            }
            else if (m_type == 'glft' || m_type == 'glb') {
                modelLoader = new GLTFLoaderPlugin(o_viewer);
            }
            else if (m_type == 'laz') {
                modelLoader = new LASLoaderPlugin(o_viewer);
            }
            else if (m_type == 'obj') {
                modelLoader = new OBJLoaderPlugin(o_viewer);
            }
            else if (m_type == '3dxml') {
                modelLoader = new XML3DLoaderPlugin(o_viewer, {
                    workerScriptsPath : xeokit_installed_at + "src/plugins/XML3DLoaderPlugin/zipjs/"
                });
            }

            if (modelLoader !== null) {
                modelLoader.load({
                    id: 'CurrentModel',
                    src: url,
                    edges: edges
                });
            }
        }
    }

    const destroy_viewer = () => {
        o_viewer = null;
        document.getElementById(CANVAS_ID).remove();
        const el_exokit_canvas = document.createElement('canvas');
        el_exokit_canvas.id = CANVAS_ID;
        el_overlay.appendChild(el_exokit_canvas);
    }

    const viewer_link_clicked = (e) => {
        const url = e.currentTarget.parentElement.querySelector('a').href;
        const model_type = e.currentTarget.dataset.model_type;
        if (el_overlay !== null) {
            el_overlay.style.visibility = "visible";
            setup_viewer(url, model_type);
        }
    }

    const close_clicked = (e) => {
        if (el_overlay !== null) {
            el_overlay.style.visibility = "collapse";
            destroy_viewer();
        }
    }

    const setup_links = () => {
        /*
         * Find links on the page that are to supported 3D models
         */
        let link_count = 0;
        const known_types = [
            'xkt',
            'ifc',
            'ifc4',
            'cityjson',
            'glft',
            'glb',
            'laz',
            'obj',
            '3dxml'
        ];
        const bin_links = document.querySelectorAll(".file--mime-application-octet-stream a");
        for (let i = 0; i < bin_links.length; i++) {
            const ext = bin_links[i].href.split('.').slice(-1)[0].toLowerCase();
            if (known_types.includes(ext)) {
                const el_container = bin_links[i].parentElement;
                const el_icon = document.createElement("button");
                el_icon.classList.add('xeokit-viewer__icon');
                el_icon.classList.add('xeokit-viewer__icon-' + ext);
                el_icon.dataset['model_type'] = ext;
                el_icon.addEventListener('click', viewer_link_clicked);
                el_container.appendChild(el_icon);
                link_count += 1;
            }
        }
        return link_count;
    }

    const build_viewer_container = () => {
        el_overlay = document.createElement('div');
        el_overlay.classList.add('xeokit-viewer__overlay');
        const el_exokit_canvas = document.createElement('canvas');
        el_exokit_canvas.id = CANVAS_ID;
        const el_overlay_close = document.createElement('button');
        el_overlay_close.addEventListener('click', close_clicked);
        el_overlay_close.classList.add('xeokit-viewer__overlay_close');
        el_overlay.appendChild(el_exokit_canvas);
        el_overlay.appendChild(el_overlay_close);
        document.body.appendChild(el_overlay);
    }

    if (setup_links() > 0) build_viewer_container();
});