import { mat4  } from 'gl-matrix';

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
    attribute vec2 coordinates;
    attribute vec3 vertColor;
    varying vec3 fragColor;
    void main(void) {
        fragColor = vertColor;
        gl_Position = vec4(coordinates, 0.0, 1.0);
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

const GRAY = [0.5, 0.5, 0.5 ];
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
    var triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    var triangleVertices = [
        0.0, 0.5, ...RED, 
        -0.5, -0.5, ...GREEN,
        0.5, -0.5, ...BLUE
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    var color = gl.getAttribLocation(shaderProgram, "vertColor");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    gl.enableVertexAttribArray(color);
    
    /*============ Drawing the triangle =============*/
    
    // Clear the canvas
    gl.clearColor(...BLACK, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
