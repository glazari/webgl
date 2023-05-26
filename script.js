// Get a reference to the canvas
var canvas = document.getElementById('canvas');
// Initialize a WebGL context
var gl = canvas.getContext('webgl');
if (!gl) {
    alert('WebGL not supported!');
}

// Create a new buffer object
var triangleVertexBuffer = gl.createBuffer();
// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
// Vertices
var triangleVertices = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
// Pass the vertices data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// Vertex shader source code
var vertCode = `
attribute vec2 coordinates;
void main(void) {
    gl_Position = vec4(coordinates, 0.0, 1.0);
}`;

// Fragment shader source code
var fragCode = `
void main(void) {
    gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
}`;

// Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);
// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);
// Compile the vertex shader
gl.compileShader(vertShader);

// Create fragment shader object
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
// Attach fragment shader source code
gl.shaderSource(fragShader, fragCode);
// Compile the fragment shader
gl.compileShader(fragShader);

// Create a shader program object
var shaderProgram = gl.createProgram();

// Attach a vertex shader
gl.attachShader(shaderProgram, vertShader);
// Attach a fragment shader
gl.attachShader(shaderProgram, fragShader);

// Link both the programs
gl.linkProgram(shaderProgram);
// Use the combined shader program object
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
gl.clearColor(0.5, 0.5, 0.5, 0.9);
gl.clear(gl.COLOR_BUFFER_BIT);
// Draw the triangle
gl.drawArrays(gl.TRIANGLES, 0, 3);