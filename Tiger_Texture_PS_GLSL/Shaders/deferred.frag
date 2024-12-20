#version 430

out vec4 FragColor;

in vec2 tex_coords;

uniform sampler2D g_position;
uniform sampler2D g_normal;
uniform sampler2D g_albedo_spec;

void main() {
	vec3 diffuse = texture(g_albedo_spec, tex_coords).rgb;
	FragColor = vec4(diffuse, 1.0);
}