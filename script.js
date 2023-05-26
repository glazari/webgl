
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
    attribute vec2 coordinates;
    void main(void) {
        gl_Position = vec4(coordinates, 0.0, 1.0);
    }`;

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);
    return vertShader;
}

function create_fragment_shader(gl, color) {
    var fragCode = `
    void main(void) {
        gl_FragColor = vec4(${color.join(', ')});
    }`;
    
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(fragShader);
    return fragShader;
}

function create_shader_program(gl, vertShader, fragShader) {
    var shaderProgram = gl.createProgram();
    
    // Attach a vertex shader
    gl.attachShader(shaderProgram, vertShader);
    // Attach a fragment shader
    gl.attachShader(shaderProgram, fragShader);
    
    // Link both the programs
    gl.linkProgram(shaderProgram);
    return shaderProgram;
}

const GRAY = [0.5, 0.5, 0.5, 0.9];
const WHITE = [1.0, 1.0, 1.0, 1.0];
const BLACK = [0.0, 0.0, 0.0, 1.0];
const GREEN = [0.0, 1.0, 0.0, 1.0];
const RED = [1.0, 0.0, 0.0, 1.0];
const BLUE = [0.0, 0.0, 1.0, 1.0];
const YELLOW = [1.0, 1.0, 0.0, 1.0];
const CYAN = [0.0, 1.0, 1.0, 1.0];
const MAGENTA = [1.0, 0.0, 1.0, 1.0];
const ORANGE = [1.0, 0.5, 0.0, 1.0];

function main() {
    // Get a reference to the canvas
    var canvas = document.getElementById('canvas');
    var gl = initialize_webgl(canvas); 
    
    var triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    var triangleVertices = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // Create vertex and fragment shaders
    var vertShader = create_vertex_shader(gl);
    var fragShader = create_fragment_shader(gl, YELLOW);
    var shaderProgram = create_shader_program(gl, vertShader, fragShader);
    gl.useProgram(shaderProgram);
    
    /*======= Associating shaders to buffer objects =======*/
    
    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    // Get the attribute location
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    // Enable the attribute
    gl.enableVertexAttribArray(coord);
    
    /*============ Drawing the triangle =============*/
    
    // Clear the canvas
    gl.clearColor(...MAGENTA);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

main();
