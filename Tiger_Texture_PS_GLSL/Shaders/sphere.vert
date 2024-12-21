#version 430

uniform mat4 u_ModelViewProjectionMatrix;  

layout (location = 0) in vec3 a_position;

void main(void) {	
	gl_Position = u_ModelViewProjectionMatrix*vec4(a_position, 1.0f);
}