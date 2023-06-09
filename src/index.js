import { mat4 } from 'gl-matrix';
import { glMatrix } from 'gl-matrix';

let m4 = mat4.create();
console.log(m4);

function initialize_webgl(canvas) {
    var gl = canvas.getContext('webgl');
    if (!gl) {
        alert('WebGL not supported!');
    }

    return gl;
}

function create_vertex_shader(gl) {
    // Vertex shader source code
    var vertCode = `
    precision mediump float;
    attribute vec3 coordinates;
    attribute vec3 vertColor;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;
    varying vec3 fragColor;
    void main(void) {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(coordinates, 1.0);
    }`;

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
        var msg = gl.getShaderInfoLog(vertShader);
        alert('Vertex shader compilation failed: ' + msg);
        return null;
    }


    return vertShader;
}

function create_fragment_shader(gl) {
    var fragCode = `
    precision mediump float;
    varying vec3 fragColor;
    void main(void) {
        gl_FragColor = vec4(fragColor, 1.0);
    }`;

    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        var msg = gl.getShaderInfoLog(fragShader);
        alert('Fragment shader compilation failed: ' + msg);
        return null;
    }

    return fragShader;
}

function create_shader_program(gl, vertShader, fragShader) {
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        var msg = gl.getProgramInfoLog(shaderProgram);
        alert(msg);
        return null;
    }

    return shaderProgram;
}

const GRAY = [0.5, 0.5, 0.5];
const WHITE = [1.0, 1.0, 1.0];
const BLACK = [0.0, 0.0, 0.0];
const GREEN = [0.0, 1.0, 0.0];
const RED = [1.0, 0.0, 0.0];
const BLUE = [0.0, 0.0, 1.0];
const YELLOW = [1.0, 1.0, 0.0];
const CYAN = [0.0, 1.0, 1.0];
const MAGENTA = [1.0, 0.0, 1.0];
const ORANGE = [1.0, 0.5, 0.0];

function main() {
    // Get a reference to the canvas
    var canvas = document.getElementById('canvas');
    var gl = initialize_webgl(canvas);

    // Create vertex and fragment shaders
    var vertShader = create_vertex_shader(gl);
    var fragShader = create_fragment_shader(gl);
    var shaderProgram = create_shader_program(gl, vertShader, fragShader);
    gl.useProgram(shaderProgram);

    /*======= Associating shaders to buffer objects =======*/
    var cubeVertices = [
        // X, Y, Z     R, G, B
        // Top face
        -1, 1, -1, ...RED,
        -1, 1, 1, ...RED,
        1, 1, 1, ...RED,
        1, 1, -1, ...RED,

        // Front face
        -1, 1, 1, ...YELLOW,
        -1, -1, 1, ...YELLOW,
        1, -1, 1, ...YELLOW,
        1, 1, 1, ...YELLOW,

        // Left face
        -1, -1, -1, ...GREEN,
        -1, 1, -1, ...GREEN,
        -1, 1, 1, ...GREEN, 
        -1, -1, 1, ...GREEN,

        // Bottom face
        -1, -1, -1, ...ORANGE,
        -1, -1, 1, ...ORANGE,
        1, -1, 1, ...ORANGE,
        1, -1, -1, ...ORANGE,

        // Back face
        -1, -1, -1, ...WHITE,
        -1, 1, -1, ...WHITE,
        1, 1, -1, ...WHITE,
        1, -1, -1, ...WHITE,

        // Right face
        1, -1, -1, ...BLUE,
        1, 1, -1, ...BLUE,
        1, 1, 1, ...BLUE,
        1, -1, 1, ...BLUE
    ];

    var boxIndices = [
        // Top
        0, 1, 2,
        0, 2, 3,

        // Front
        4, 5, 6,
        4, 6, 7,

        // Front
        8, 9, 10,
        8, 10, 11,

        // Back
        12, 13, 14,
        12, 15, 14,

        // Left
        16, 18, 17,
        16, 19, 18,

        // Right
        20, 22, 21,
        20, 23, 22,
    ];


    gl.enable(gl.DEPTH_TEST);
    var boxVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

    var boxIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);



    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBuffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    var color = gl.getAttribLocation(shaderProgram, "vertColor");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(
        coord, // Attribute location
        3, // Number of elements per attribute
        gl.FLOAT, // Type of elements
        false, // Normalized
        6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
        0 // Offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    gl.enableVertexAttribArray(color);


    // Get the uniform locations
    var mWorld = gl.getUniformLocation(shaderProgram, "mWorld");
    var mView = gl.getUniformLocation(shaderProgram, "mView");
    var mProj = gl.getUniformLocation(shaderProgram, "mProj");

    var worldMatrix = mat4.create();
    var viewMatrix = mat4.create();
    var projMatrix = mat4.create();

    mat4.identity(worldMatrix);
    mat4.lookAt(
        viewMatrix, // Output matrix
        [0, 0, -5], // Eye position
        [0, 0, 0], // Target position
        [0, 1, 0] // Up direction
    );
    mat4.perspective(
        projMatrix, // Output Matrix
        glMatrix.toRadian(45), // Field of view in radians
        canvas.width / canvas.height, // Aspect ratio
        0.1, // Near clipping plane
        1000.0 // Far clipping plane
    );

    gl.uniformMatrix4fv(
        mWorld, // Location
        false, // Transpose
        worldMatrix // Matrix
    );
    gl.uniformMatrix4fv(mView, false, viewMatrix);
    gl.uniformMatrix4fv(mProj, false, projMatrix);




    /*============ Drawing the triangle =============*/

    var identityMatrix = mat4.create();
    mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(
            worldMatrix, // Destination matrix 
            identityMatrix, // Matrix to rotate
            angle,  // Amount to rotate in radians
            [1, 1, -1] // Axis to rotate around
        );
        gl.uniformMatrix4fv(mWorld, false, worldMatrix);

        gl.clearColor(...BLACK, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(
            gl.TRIANGLES,      // Primitive type
            boxIndices.length, // Number of elements to render
            gl.UNSIGNED_SHORT, // Type of elements 
            0                  // Offset to the first element
        );
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

main();
