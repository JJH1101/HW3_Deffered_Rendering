#version 430

out vec4 final_color;

in vec2 tex_coords;

uniform sampler2D g_albedo_spec;

struct MATERIAL {
	vec4 ambient_color;
	vec4 diffuse_color;
	vec4 specular_color;
	vec4 emissive_color;
	float specular_exponent;
};

uniform vec4 u_global_ambient_color;
#define NUMBER_OF_MATERIAL_SUPPORTED 2
uniform vec4 u_emissive_color[NUMBER_OF_MATERIAL_SUPPORTED];

void main() {
	vec4 diffuse = vec4(texture(g_albedo_spec, tex_coords).rgb, 1.0f);
	int mat_idx = int(texture(g_albedo_spec, tex_coords).a * 10 + 0.1f);

	if(mat_idx < 0 || mat_idx > 1) final_color = vec4(0, 0, 0, 1);
	else
		final_color = u_emissive_color[mat_idx] + u_global_ambient_color * diffuse;
}